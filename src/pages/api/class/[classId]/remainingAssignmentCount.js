import mongoose from "mongoose";
import manageResponses from "../../../../../utils/responses/manageResponses";
import db from "../../../../../utils/db";
import Class from "../../../../../models/Class";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(400).json({
      status: 400,
      message: "Bad Request!",
    });
  }

  try {
    const userId = req.headers["x-user-id"];

    const { classId } = req.query;
    var ObjectId = mongoose.Types.ObjectId;

    if (!ObjectId.isValid(classId)) {
      const error = new Error("Invalid Id!");
      error.statusCode = 422;
      throw error;
    }

    await db.connect();

    const classData = await Class.findById(classId)
      .select("-_id assignments teacher")
      .populate({
        path: "assignments",
        select: {
          _id: 0,
          responses: 1,
        },
      });

    if (classData.teacher.toString() === userId) {
      return res.status(200).json({
        assignmentsRemaining: 0,
      });
    }

    const { assignments: assignmentsResponsesArr } = classData;
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
