import mongoose from "mongoose";
import Class from "../../../../../models/Class";
import manageResponses from "../../../../../utils/responses/manageResponses";
import { authOptions } from "../../auth/[...nextauth]";
import db from "../../../../../utils/db";

const { getServerSession } = require("next-auth");

const handler = async (req, res) => {
  if (req.method !== "GET") {
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

    const { classId } = req.query;
    var ObjectId = mongoose.Types.ObjectId;

    if (!ObjectId.isValid(classId)) {
      const error = new Error("Invalid Id!");
      error.statusCode = 422;
      throw error;
    }

    await db.connect();

    const data = await Class.findById(classId)
      .select("students teacher -_id")
      .populate({
        path: "teacher",
        select: {
          "credentials.email": 1,
          "credentials.userImage": 1,
          "credentials.name": 1,
          _id: 1,
        },
      })
      .populate({
        path: "students",
        select: {
          "credentials.email": 1,
          "credentials.userImage": 1,
          "credentials.name": 1,
          _id: 1,
        },
      });

    if (!data) {
      const error = new Error("No people found!");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({
      people: data.students,
      teacher: data.teacher,
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
