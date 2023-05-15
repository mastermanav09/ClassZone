import mongoose from "mongoose";
import Class from "../../../../models/Class";
import manageResponses from "../../../../utils/responses/manageResponses";
import { authOptions } from "../auth/[...nextauth]";

const { getServerSession } = require("next-auth");
const { default: db } = require("../../../../utils/db");

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(400).json({
      status: 400,
      message: "Bad Request!",
    });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      const error = new Error("Sign in required!");
      error.statusCode = 401;
      throw error;
    }

    const { user } = session;
    let filter = { _id: user._id };

    if (!user._id) {
      filter = { "credentials.email": user.email };
    }

    await db.connect();
    const { classId, content } = req.body;
    const userClass = await Class.findById(classId);

    if (!userClass) {
      const error = new Error("Class do not exists!");
      error.statusCode = 404;
      throw error;
    }

    const updatedClass = await Class.findByIdAndUpdate(
      userClass._id,
      {
        $push: { announcements: { text: content, date: new Date() } },
      },
      { new: true }
    );

    await db.disconnect();

    return res.status(201).json({
      announcements: updatedClass.announcements,
      message: "Announcement created successfully!",
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
