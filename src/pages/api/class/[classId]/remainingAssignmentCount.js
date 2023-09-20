import mongoose from "mongoose";
import { authOptions } from "../../auth/[...nextauth]";
import manageResponses from "../../../../../utils/responses/manageResponses";
import db from "../../../../../utils/db";
import Class from "../../../../../models/Class";
import User from "../../../../../models/User";

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
    const { user } = session;

    let filter = { _id: user._id };

    if (!user._id) {
      filter = { "credentials.email": user.email };
    }

    var ObjectId = mongoose.Types.ObjectId;

    if (!ObjectId.isValid(classId)) {
      const error = new Error("Invalid Id!");
      error.statusCode = 422;
      throw error;
    }

    await db.connect();
    const userDetails = await User.findOne(filter).select("_id");
    const { _id: userId } = userDetails;

    const assignmentsResponses = await Class.findById(classId)
      .select("-_id assignments")
      .populate({
        path: "assignments",
        select: {
          _id: 0,
          responses: 1,
        },
      });

    console.log(assignmentsResponses);
    const { assignments: assignmentsResponsesArr } = assignmentsResponses;
    const assignmentsRemaining = assignmentsResponsesArr.filter((obj) => {
      for (let response of obj.responses) {
        if (response.user.toString() === userId.toString()) {
          return false;
        }
      }

      return true;
    });

    return res.status(200).json({
      assignmentsRemaining: assignmentsRemaining.length,
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
