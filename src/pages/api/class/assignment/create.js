import Class from "../../../../../models/Class";
import Assignment from "../../../../../models/Assignment";
import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import mongoose from "mongoose";
import manageResponses from "../../../../../utils/responses/manageResponses";
import { createAssignmentValidation } from "../../../../../utils/validators/createAssignmentValidation";
import db from "../../../../../utils/db";
import formidable from "formidable";

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

    const data = await new Promise((resolve, reject) => {
      formidable().parse(req, (err, fields, files) => {
        if (err) {
          reject({ err });
        }

        const titleArr = fields.title;
        const descriptionArr = fields.description;
        const classIdArr = fields.classId;

        const resolvedFields = {
          title: titleArr[0],
          description: descriptionArr[0],
          classId: classIdArr[0],
        };

        resolve({ err, resolvedFields, files });
      });
    });
    console.log(data);
    const { title, description, classId } = data.resolvedFields;
    return;
    // const validationResponse = createAssignmentValidation({
    //   title[0],
    //   description][],
    // });

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
      file: req?.file?.path.replaceAll("\\", "/"),
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
