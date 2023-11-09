import mongoose from "mongoose";
import Class from "../../../../../models/Class";
import manageResponses from "../../../../../utils/responses/manageResponses";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(400).json({
      status: 400,
      message: "Bad Request!",
    });
  }

  try {
    const { classId } = req.query;
    var ObjectId = mongoose.Types.ObjectId;

    if (!ObjectId.isValid(classId)) {
      const error = new Error("Invalid Id!");
      error.statusCode = 422;
      throw error;
    }

    const classData = await Class.findById(classId)
      .populate({
        path: "teacher",
        select: {
          "credentials.name": 1,
          "credentials.userImage": 1,
          _id: 1,
        },
      })
      .select("-members -assignments")
      .lean();

    if (!classData) {
      const error = new Error("Class do not exists!");
      error.statusCode = 404;
      throw error;
    }

    let announcements = [],
      pinnedAnnouncements = [];

    for (let item of classData.announcements) {
      if (item.isPinned) {
        pinnedAnnouncements.push(item);
      } else {
        announcements.push(item);
      }
    }

    announcements.sort((a, b) => b.createdAt - a.createdAt);
    pinnedAnnouncements.sort((a, b) => b.updatedAt - a.updatedAt);

    return res.status(200).json({
      class: { ...classData, announcements, pinnedAnnouncements },
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
