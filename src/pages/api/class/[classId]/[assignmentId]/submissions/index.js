import mongoose from "mongoose";
import manageResponses from "../../../../../../../utils/responses/manageResponses";
import { authOptions } from "../../../../auth/[...nextauth]";
import db from "../../../../../../../utils/db";
import Assignment from "../../../../../../../models/Assignment";

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

    const { assignmentId } = req.query;
    var ObjectId = mongoose.Types.ObjectId;

    if (!ObjectId.isValid(assignmentId)) {
      const error = new Error("Invalid Id!");
      error.statusCode = 422;
      throw error;
    }

    await db.connect();

    const submissions = await Assignment.findById(assignmentId)
      .select("-_id responses")
      .populate({
        path: "responses.user",
        select: {
          _id: 0,
          "credentials.name": 1,
          "credentials.userImage": 1,
        },
      });

    if (!submissions) {
      const error = new Error("Submissions Not found!");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({
      submissions: submissions,
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
