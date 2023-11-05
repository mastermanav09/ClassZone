import Class from "../../../../../models/Class";
import manageResponses from "../../../../../utils/responses/manageResponses";
import mongoose from "mongoose";

const handler = async (req, res) => {
  if (req.method !== "PATCH") {
    return res.status(400).json({
      status: 400,
      message: "Bad Request!",
    });
  }

  try {
    const userId = req.headers["x-user-id"];
    const { announcementId, classId, isPinned } = req.body;

    var ObjectId = mongoose.Types.ObjectId;

    if (!ObjectId.isValid(announcementId) || !ObjectId.isValid(classId)) {
      const error = new Error("Invalid Id!");
      error.statusCode = 422;
      throw error;
    }

    const userClass = await Class.findById(classId).populate("teacher");

    if (!userClass) {
      const error = new Error("Class not found!");
      error.statusCode = 404;
      throw error;
    }

    if (userClass.teacher._id.toString() !== userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 401;
      throw error;
    }

    await Class.updateOne(
      { _id: classId, "announcements._id": announcementId },
      {
        $set: {
          "announcements.$.updatedAt": new Date(),
          "announcements.$.isPinned": isPinned ? false : true,
        },
      }
    );

    let message;
    if (isPinned) {
      message = "Announcement unpinned successfully!";
    } else {
      message = "Announcement pinned successfully!";
    }

    return res.status(200).json({
      message,
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
