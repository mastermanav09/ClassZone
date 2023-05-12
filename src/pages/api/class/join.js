import mongoose from "mongoose";
import { authOptions } from "../auth/[...nextauth]";
import User from "../../../../models/User";
import Class from "../../../../models/Class";
import manageResponses from "../../../../utils/responses/manageResponses";
import db from "../../../../utils/db";
import { getServerSession } from "next-auth";

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

    const { classId } = req.body;
    await db.connect();

    let joiningUser = await User.findOne({
      ...filter,
      enrolled: { $in: [classId] },
    });

    if (joiningUser) {
      const error = new Error("You have already joined this class!");
      error.statusCode = 400;
      throw error;
    }

    joiningUser = await User.findById(filter);
    const joiningClass = await Class.findById(classId);

    if (!joiningClass) {
      const error = new Error("Class do not exists!");
      error.statusCode = 404;
      throw error;
    }

    if (joiningUser._id.toString() === joiningClass.teacher.toString()) {
      const error = new Error("You are already a teacher of this class!");
      error.statusCode = 400;
      throw error;
    }

    await User.findByIdAndUpdate(joiningUser._id, {
      $push: { enrolled: new mongoose.Types.ObjectId(classId) },
    });

    const updatedClass = await Class.findOneAndUpdate(joiningClass._id, {
      $push: { students: new mongoose.Types.ObjectId(joiningUser._id) },
    })
      .select("name backgroundColor _id teacher")
      .populate({
        path: "teacher",
        select: {
          "credentials.name": 1,
          "credentials.email": 1,
          "credentials.userImage": 1,
          _id: 0,
        },
      });

    console.log(updatedClass);

    await db.disconnect();
    return res.status(200).json({
      class: updatedClass,
      ...manageResponses(200, "Class joined successfully!"),
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
