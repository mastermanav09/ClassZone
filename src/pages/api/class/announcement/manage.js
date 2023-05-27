import Class from "../../../../../models/Class";
import manageResponses from "../../../../../utils/responses/manageResponses";
import { authOptions } from "../../auth/[...nextauth]";
import mongoose from "mongoose";

const { getServerSession } = require("next-auth");

const sendErrorResponse = (res, error) => {
  console.log(error);
  if (!error.statusCode) {
    error.statusCode = 500;
  }

  return res
    .status(error.statusCode)
    .json(manageResponses(error.statusCode, error.message));
};

const handler = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      const error = new Error("Sign in required!");
      error.statusCode = 401;
      throw error;
    }

    const { classId, content } = req.body;
    const plainString = content.replace(/<[^>]+>/g, "");
    const updatedStr = plainString.split("&nbsp;").join("");

    if (updatedStr.trim().length === 0) {
      const error = new Error("Announcement should contain valid text!");
      error.statusCode = 422;
      throw error;
    }

    const ObjectId = mongoose.Types.ObjectId;
    if (!ObjectId.isValid(classId)) {
      const error = new Error("Invalid Id!");
      error.statusCode = 422;
      throw error;
    }

    const userClass = await Class.findById(classId);

    if (!userClass) {
      const error = new Error("Class do not exists!");
      error.statusCode = 404;
      throw error;
    }
  } catch (error) {
    return sendErrorResponse(res, error);
  }

  if (req.method === "POST") {
    try {
      const { classId, content } = req.body;

      const updatedClass = await Class.findByIdAndUpdate(
        classId,
        {
          $push: {
            announcements: {
              $each: [{ text: content, date: new Date(), isEdited: false }],
              $sort: { date: -1 },
            },
          },
        },
        { new: true }
      );

      return res.status(201).json({
        announcements: updatedClass.announcements,
        message: "Announcement created successfully!",
      });
    } catch (error) {
      return sendErrorResponse(res, error);
    }
  }

  if (req.method === "PATCH") {
    try {
      const { classId, content, announcementId } = req.body;
      await Class.updateOne(
        { _id: classId, "announcements._id": announcementId },
        {
          $set: {
            "announcements.$.text": content,
            "announcements.$.isEdited": true,
          },
        }
      );

      return res.status(200).json({
        message: "Announcement updated successfully!",
      });
    } catch (error) {
      return sendErrorResponse(res, error);
    }
  }

  return res.status(400).json({
    status: 400,
    message: "Bad Request!",
  });
};

export default handler;
