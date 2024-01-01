import Assignment from "../../../../../models/Assignment";
import Class from "../../../../../models/Class";
import mongoose from "mongoose";
import manageResponses from "../../../../../utils/responses/manageResponses";
import { createAssignmentValidation } from "../../../../../utils/validators/createAssignmentValidation";
import db from "../../../../../utils/db";
import formidable from "formidable";
import FormData from "form-data";
import fs from "fs";
import axios from "axios";
const cloudinary = require("cloudinary").v2;
const { v4: uuidv4 } = require("uuid");

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(400).json({
      status: 400,
      message: "Bad Request!",
    });
  }

  try {
    const userId = req.headers["x-user-id"];

    const form = formidable({
      keepExtensions: true,
      maxTotalFileSize: 10 * 1024 * 1024,
    });

    const [fields, files] = await form.parse(req);

    const {
      title: titleArr,
      description: descriptionArr,
      classId: classIdArr,
      dueDate: dueDateArr,
    } = fields;

    const { file } = files;
    const title = titleArr[0];
    const description = descriptionArr[0];
    const classId = classIdArr[0];
    const dueDate = dueDateArr[0];

    const validationResponse = createAssignmentValidation({
      title,
      description,
      dueDate,
    });

    if (validationResponse.error) {
      const error = new Error(validationResponse.error?.details[0]?.message);
      error.statusCode = 422;
      throw error;
    }

    var ObjectId = mongoose.Types.ObjectId;

    if (!ObjectId.isValid(classId)) {
      const error = new Error("Invalid Id!");
      error.statusCode = 422;
      throw error;
    }

    await db.connect();

    const userClass = await Class.findById(classId);

    if (!userClass) {
      const error = new Error("Class do not exists!");
      error.statusCode = 404;
      throw error;
    }

    if (userClass.teacher._id.toString() !== userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 401;
      throw error;
    }

    const url = process.env.UPLOAD_CLOUDINARY_URL;
    let uploadedFileUrl = null;
    const pathId = uuidv4();

    if (file && file[0]) {
      try {
        const uploadPath = `/assignments/${pathId}`;

        await cloudinary.api.create_folder(uploadPath);
        await cloudinary.api.create_folder(`${uploadPath}/submissions`);

        const formData = new FormData();
        formData.append("file", fs.createReadStream(file[0].filepath));
        formData.append(
          "public_id",
          file[0].originalFilename
            .trim()
            .replaceAll(" ", "_")
            .replace(/\.[^.\/]+$/, "")
        );
        formData.append("resource_type", "raw");
        formData.append("folder", uploadPath);
        formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);
        const { data } = await axios.post(url, formData);

        if (!data || !data.secure_url) {
          const error = new Error("Cannot upload File");
          error.statusCode = 500;
          throw error;
        }

        uploadedFileUrl = data.secure_url;
      } catch (error) {
        error = JSON.parse(JSON.stringify(error));
        return res
          .status(error.status)
          .json(
            manageResponses(
              error.status,
              "Something went wrong while uploading the file. Please try again"
            )
          );
      }
    }

    const newAssignment = new Assignment({
      title: title,
      description: description,
      ...(uploadedFileUrl && { filePath: uploadedFileUrl }),
      cloudinaryId: pathId,
      responses: [],
      dueDate: dueDate,
    });

    await newAssignment.save();

    await Class.findByIdAndUpdate(
      classId,
      {
        $push: { assignments: new mongoose.Types.ObjectId(newAssignment._id) },
      },
      { new: true }
    );

    return res.status(201).json({
      assignment: {
        _id: newAssignment._doc._id,
        title: newAssignment._doc.title,
        dueDate: newAssignment._doc.dueDate,
      },
      ...manageResponses(201, "Assignment created successfully!"),
    });
  } catch (error) {
    console.log(error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    if (error.httpCode && error.httpCode === 400) {
      return res
        .status(400)
        .json(
          manageResponses(
            400,
            "Failed to upload file, make sure the file size should be greater than 0 and under 10MB."
          )
        );
    }

    return res
      .status(error.statusCode)
      .json(manageResponses(error.statusCode, error.message));
  }
};

export default handler;
