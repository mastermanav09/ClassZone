import mongoose from "mongoose";
import manageResponses from "../../../../../../../utils/responses/manageResponses";
import { authOptions } from "../../../../auth/[...nextauth]";
import db from "../../../../../../../utils/db";
import Assignment from "../../../../../../../models/Assignment";
import Class from "../../../../../../../models/Class";
import User from "../../../../../../../models/User";

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

    const { assignmentId, classId } = req.query;
    var ObjectId = mongoose.Types.ObjectId;

    if (!ObjectId.isValid(assignmentId)) {
      const error = new Error("Invalid Id!");
      error.statusCode = 422;
      throw error;
    }

    await db.connect();

    const classStudents = await Class.findById(classId).select("-_id students");
    const { students } = classStudents;

    const submissions = await Assignment.findById(assignmentId).select(
      "-_id responses.user"
    );

    const remainingUsers = students.filter((student) =>
      submissions.responses.some(
        (submission) => submission.user.toString() !== student.toString()
      )
    );

    let remainingSubmissions = remainingUsers.map(async (user) => {
      try {
        console.log(user);
        const detail = await User.findOne(user).select(
          "-_id credentials.name credentials.userImage"
        );
        return {
          user: detail,
        };
      } catch (error) {
        return res
          .status(500)
          .json(manageResponses(error.statusCode, "Couldn't get the list!"));
      }
    });

    remainingSubmissions = await Promise.all(remainingSubmissions);

    return res.status(200).json({
      remainingSubmissions,
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
