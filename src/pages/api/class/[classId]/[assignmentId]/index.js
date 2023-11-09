import mongoose from "mongoose";
import manageResponses from "../../../../../../utils/responses/manageResponses";
import db from "../../../../../../utils/db";
import Assignment from "../../../../../../models/Assignment";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(400).json({
      status: 400,
      message: "Bad Request!",
    });
  }

  try {
    const { assignmentId } = req.query;
    var ObjectId = mongoose.Types.ObjectId;

    if (!ObjectId.isValid(assignmentId)) {
      const error = new Error("Invalid Id!");
      error.statusCode = 422;
      throw error;
    }

    const assignment = await Assignment.findById(assignmentId).select(
      "-__v -cloudinaryId -responses"
    );

    if (!assignment) {
      const error = new Error("Assignment Not found!");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({
      assignment: assignment,
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
