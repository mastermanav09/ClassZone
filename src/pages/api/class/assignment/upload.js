import Assignment from "../../../../../models/Assignment";
import Class from "../../../../../models/Class";
import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import mongoose from "mongoose";
import manageResponses from "../../../../../utils/responses/manageResponses";
import db from "../../../../../utils/db";
import formidable from "formidable";
import FormData from "form-data";
import fs from "fs";
import axios from "axios";
import User from "../../../../../models/User";
import { removeFileExtension } from "@/helper/fileExtensionHelper";
const cloudinary = require("cloudinary").v2;

export const config = {
  api: {
    bodyParser: false,
  },
};

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
};

const checkAuthorization = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user || (!session.user.email && !session.user._id)) {
    return null;
  }

  return session;
};

const handler = async (req, res) => {
  if (req.method === "POST") {
    const authObj = await checkAuthorization(req, res);
    if (!authObj) {
      const error = new Error("Sign in required!");
      error.statusCode = 401;
      throw error;
    }

    let uploadPath;
    try {
      const { user } = authObj;

      let filter = { _id: user._id };

      if (!user._id) {
        filter = { "credentials.email": user.email };
      }

      const form = formidable({ keepExtensions: true });
      const [fields, files] = await form.parse(req);

      const {
        assignmentId: assignmentIdArr,
        classId: classIdArr,
        comment: commentArr,
      } = fields;
      const { file } = files;
      const assignmentId = assignmentIdArr[0];
      const classId = classIdArr[0];
      const userComment = commentArr[0];

      if (!file || !file[0]) {
        const error = new Error("No submission found!");
        error.statusCode = 422;
        throw error;
      }

      let ObjectId = mongoose.Types.ObjectId;

      if (!ObjectId.isValid(assignmentId)) {
        const error = new Error("Invalid AssignmentId Id!");
        error.statusCode = 422;
        throw error;
      }

      if (!ObjectId.isValid(classId)) {
        const error = new Error("Invalid Class Id!");
        error.statusCode = 422;
        throw error;
      }

      await db.connect();

      const classAssignment = await Assignment.findById(assignmentId);
      const userClass = await Class.findById(classId);
      const classUser = await User.findOne(filter);

      if (!classAssignment) {
        const error = new Error("Assignment do not exists!");
        error.statusCode = 404;
        throw error;
      }

      if (!userClass) {
        const error = new Error("Class do not exists!");
        error.statusCode = 404;
        throw error;
      }

      if (userClass.teacher.toString() === classUser._id.toString()) {
        const error = new Error("You cannot make submission!");
        error.statusCode = 401;
        throw error;
      }

      const assignmentDetail = await Assignment.findById(assignmentId).select(
        "responses -_id"
      );

      const { responses } = assignmentDetail;
      const isAlreadySubmitted = responses.some(
        (response) => response.user.toString() === classUser._id.toString()
      );

      if (isAlreadySubmitted) {
        const error = new Error("You've already made a submission!");
        error.statusCode = 400;
        throw error;
      }

      cloudinary.config(cloudinaryConfig);

      uploadPath = `/assignments/${classAssignment.cloudinaryId}/submissions/${classUser._id}`;

      await cloudinary.api.create_folder(uploadPath);
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
      const { data } = await axios.post(
        process.env.UPLOAD_CLOUDINARY_URL,
        formData
      );

      if (!data || !data.secure_url) {
        const error = new Error("Cannot upload File");
        error.statusCode = 500;
        throw error;
      }
      console.log(data);
      const uploadedFileUrl = data.secure_url;
      const isValidComment = userComment.trim().length > 0;

      await Assignment.findByIdAndUpdate(assignmentId, {
        $push: {
          responses: {
            user: classUser._id,
            submittedFilePath: uploadedFileUrl,
            submittedOn: new Date(),
            ...(isValidComment && { comment: userComment }),
          },
        },
      });

      return res.status(200).json({
        message: "Assignment submitted successfully!",
        submittedFilePath: uploadedFileUrl,
        submittedOn: new Date(),
        ...(isValidComment && { comment: userComment }),
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
  }

  if (req.method === "DELETE") {
    const authObj = await checkAuthorization(req, res);
    if (!authObj) {
      const error = new Error("Sign in required!");
      error.statusCode = 401;
      throw error;
    }

    try {
      const { user } = authObj;
      let filter = { _id: user._id };

      if (!user._id) {
        filter = { "credentials.email": user.email };
      }

      const { assignmentId, classId } = req.query;
      await db.connect();

      let ObjectId = mongoose.Types.ObjectId;
      if (!ObjectId.isValid(assignmentId)) {
        const error = new Error("Invalid Assignment Id!");
        error.statusCode = 422;
        throw error;
      }

      const classAssignment = await Assignment.findById(assignmentId);
      const userClass = await Class.findById(classId);
      const classUser = await User.findOne(filter);

      if (!classAssignment) {
        const error = new Error("Assignment do not exists!");
        error.statusCode = 404;
        throw error;
      }

      if (!userClass) {
        const error = new Error("Class do not exists!");
        error.statusCode = 404;
        throw error;
      }

      if (userClass.teacher.toString() === classUser._id.toString()) {
        const error = new Error("You cannot remove submission!");
        error.statusCode = 401;
        throw error;
      }

      const userResponse = classAssignment.responses[0];

      if (!userResponse || !userResponse.submittedFilePath) {
        const error = new Error("Submission do not exists!");
        error.statusCode = 404;
        throw error;
      }

      let publicId = userResponse.submittedFilePath.split("assignments")[1];
      const publicId1 = "assignments" + publicId.replace(/\.[^.\/]+$/, "");
      const publicId2 = "assignments" + publicId;

      try {
        const result = await cloudinary.api.delete_resources([publicId1], {
          invalidate: true,
          type: "authenticated",
        });
        console.log("result1", result);
        if (
          result.deleted[publicId1] === "not_found" ||
          result.deleted_counts[publicId1].original === 0
        ) {
          console.log("aa aaa gya");
          throw new Error("Something went wrong. Please try again later");
        }
      } catch (error) {
        const result = await cloudinary.api.delete_resources([publicId2], {
          invalidate: true,
          type: "authenticated",
          resource_type: "raw",
        });

        console.log("result2", result);
        if (
          result.deleted[publicId2] === "not_found" ||
          result.deleted_counts[publicId2].original === 0
        ) {
          throw new Error("Something went wrong. Please try again later");
        }
      }

      await cloudinary.api.delete_folder(
        `/assignments/${classAssignment.cloudinaryId}/submissions/${classUser._id}`
      );

      const projection = {
        _id: 0,
        cloudinaryId: 1,
        responses: { $elemMatch: { user: classUser._id } },
      };

      await Assignment.findOneAndUpdate(
        { _id: assignmentId },
        { $pull: { responses: { user: classUser._id } } },
        {
          returnOriginal: true,
          projection,
        }
      );

      return res
        .status(200)
        .json(manageResponses(200, "Submission removed successfully!"));
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }

      return res
        .status(error.statusCode)
        .json(manageResponses(error.statusCode, error.message));
    }
  }

  return res.status(400).json({
    status: 400,
    message: "Bad Request!",
  });
};

export default handler;
