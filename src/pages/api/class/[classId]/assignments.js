import mongoose from "mongoose";
import User from "../../../../../models/User";
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

    const { user } = session;

    let filter = { _id: user._id };

    if (!user._id) {
      filter = { "credentials.email": user.email };
    }

    const { classId } = req.query;
    var ObjectId = mongoose.Types.ObjectId;

    if (!ObjectId.isValid(classId)) {
      const error = new Error("Invalid Id!");
      error.statusCode = 422;
      throw error;
    }

    await db.connect();

    const classUser = await User.findOne(filter);

    const data = await Class.findById(classId)
      .select("assignments teacher -_id")
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
        path: "assignments",
        select: { cloudinaryId: 0, createdAt: 0, updatedAt: 0, __v: 0 },
      })
      .sort({ createdAt: -1 });

    if (!data) {
      const error = new Error("No assignments found!");
      error.statusCode = 404;
      throw error;
    }

    const isTeacher = classUser._id.toString() === data.teacher._id.toString();
    let updatedAssignments = [];

    for (let assignment of data.assignments) {
      if (isTeacher) {
        updatedAssignments.push({
          _id: assignment._doc._id,
          title: assignment._doc.title,
          dueDate: assignment._doc.dueDate,
        });
      } else {
        let updatedResponses = [];
        for (let userResponse of assignment.responses) {
          if (userResponse?.user?.toString() === classUser._id.toString()) {
            updatedResponses.push({
              submittedFilePath: userResponse.submittedFilePath,
              submittedOn: userResponse.submittedOn,
              ...(userResponse.comment && { comment: userResponse.comment }),
            });
            break;
          }
        }

        updatedAssignments.push({
          ...assignment._doc,
          responses: updatedResponses,
        });
      }
    }

    return res.status(200).json({
      assignments: updatedAssignments,
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
