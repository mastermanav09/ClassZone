import Class from "../../../../../models/Class";
import Assignment from "../../../../../models/Assignment";
import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import mongoose from "mongoose";
import manageResponses from "../../../../../utils/responses/manageResponses";
import { createAssignmentValidation } from "../../../../../utils/validators/createAssignmentValidation";
import db from "../../../../../utils/db";
import formidable from "formidable";
import path from "path";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = async (req, dirPath) => {
  options.filename = (name, ext, part, form) => {
    return Date.now().toString() + "_" + part.originalFilename;
  };

  const form = formidable(options);
  form.on("fileBegin", (formname, file) => {
    form.emit("data", { name: "fileBegin", formname, value: file });
  });

  form.on("file", (formname, file) => {
    form.emit("data", { name: "file", formname, value: file });
  });

  // console.log(files);
};

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(400).json({
      status: 400,
      message: "Bad Request!",
    });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (
      !session ||
      !session.user ||
      (!session.user.email && !session.user._id)
    ) {
      const error = new Error("Sign in required!");
      error.statusCode = 401;
      throw error;
    }

    const { user } = session;
    let filter = { _id: user._id };

    if (!user._id) {
      filter = { "credentials.email": user.email };
    }
    const options = {};
    const dirPath = path.join(`/public/assignments`);
    options.uploadDir = path.join(process.cwd(), dirPath).replaceAll("\\", "/");
    options.keepExtensions = true;

    const form = formidable(options);
    const [fields, files] = await form.parse(req);

    const title = fields.title[0];
    const description = fields.description[0];
    const classId = fields.classId[0];
    const { file } = files;

    // if (file && file[0]) {
    //   const dirPath = path.join(
    //     process.cwd() + `/public/assignments/${classId}`
    //   );

    // try {
    //   fs.readdirSync(dirPath);
    // } catch (error) {
    //   fs.mkdirSync(dirPath);
    // }

    // await readFile(req, dirPath);
    // }

    const validationResponse = createAssignmentValidation({
      title,
      description,
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

    if (user._id) {
      if (userClass.teacher._id.toString() !== user._id) {
        const error = new Error("Not authorized!");
        error.statusCode = 401;
        throw error;
      }
    } else {
      if (userClass.teacher.credentials.email !== user.email) {
        const error = new Error("Not authorized!");
        error.statusCode = 401;
        throw error;
      }
    }

    const newAssignment = new Assignment({
      title: title,
      description: description,
      file: file ? file[0].filepath.replaceAll("\\", "/") : undefined,
    });

    await newAssignment.save();

    return res.status(201).json({
      assignment: {
        _id: newAssignment._doc._id,
        title: newAssignment._doc.title,
        description: newAssignment._doc.description,
        fileUrl: newAssignment?._doc?.file,
      },
      ...manageResponses(201, "Assignment created successfully!"),
    });
  } catch (error) {
    console.log(error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    return res
      .status(error.statusCode)
      .json(manageResponses(error.statusCode, error.message));
  }
};

export default handler;
