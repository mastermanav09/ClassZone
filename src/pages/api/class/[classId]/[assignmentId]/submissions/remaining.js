import mongoose from "mongoose";
import manageResponses from "../../../../../../../utils/responses/manageResponses";
import db from "../../../../../../../utils/db";
import Assignment from "../../../../../../../models/Assignment";
import Class from "../../../../../../../models/Class";
import User from "../../../../../../../models/User";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(400).json({
      status: 400,
      message: "Bad Request!",
    });
  }

  try {
    const { assignmentId, classId } = req.query;
    const userId = req.headers["x-user-id"];
    var ObjectId = mongoose.Types.ObjectId;

    if (!ObjectId.isValid(assignmentId) || !ObjectId.isValid(classId)) {
      const error = new Error("Invalid Id!");
      error.statusCode = 422;
      throw error;
    }

    await db.connect();

    const classData = await Class.findById(classId).select(
      "-_id members teacher"
    );
    const { members, teacher } = classData;

    if (teacher.toString() !== userId) {
      const error = new Error("Unauthorized!");
      error.statusCode = 401;
      throw error;
    }

    const submissions = await Assignment.findById(assignmentId).select(
      "-_id responses.user"
    );

    const submissionResponses = submissions.responses.map((response) =>
      response.user.toString()
    );

    const remainingUsers = members.filter((student) => {
      if (!submissionResponses.includes(student.toString())) {
        return true;
      }

      return false;
    });

    let remainingSubmissions = remainingUsers.map(async (user) => {
      try {
        const detail = await User.findById(user).select(
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
