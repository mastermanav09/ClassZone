import Class from "../../../../models/Class";
import mongoose from "mongoose";
import { authOptions } from "../auth/[...nextauth]";
import manageResponses from "../../../../utils/responses/manageResponses";
import { getServerSession } from "next-auth";
import User from "../../../../models/User";

const handler = async (req, res) => {
  if (req.method !== "PATCH") {
    return res.status(400).json({
      status: 400,
      message: "Bad Request!",
    });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user || !session.user._id) {
      const error = new Error("Sign in required!");
      error.statusCode = 401;
      throw error;
    }

    const { _id: userId } = session.user;

    const { fromIndex, toIndex, type, classId } = req.body;

    var ObjectId = mongoose.Types.ObjectId;
    if (!ObjectId.isValid(classId)) {
      const error = new Error("Invalid Class Id!");
      error.statusCode = 422;
      throw error;
    }

    if (type !== "CLASS_CARD_ENROLLED" && type !== "CLASS_CARD_TEACHING") {
      const error = new Error("Invalid class type!");
      error.statusCode = 422;
      throw error;
    }

    if (type === "CLASS_CARD_ENROLLED") {
    } else if (type === "CLASS_CARD_TEACHING") {
      const data = await User.findById(userId).select("teaching");
      const { teaching: teachingClasses } = data;

      if (
        fromIndex >= 0 &&
        fromIndex < teachingClasses.length &&
        toIndex >= 0 &&
        toIndex < teachingClasses.length
      ) {
        await User.findByIdAndUpdate(userId, {});
      }
    }

    // const joiningClass = await Class.findById(classId);

    // if (!joiningClass) {
    //   const error = new Error("Class do not exists!");
    //   error.statusCode = 404;
    //   throw error;
    // }

    // const joiningUser = await User.findOne({
    //   _id: userId,
    //   enrolled: { $in: [classId] },
    // });

    // if (joiningUser) {
    //   const error = new Error("You have already joined this class!");
    //   error.statusCode = 400;
    //   throw error;
    // }

    // if (userId.toString() === joiningClass.teacher.toString()) {
    //   const error = new Error("You are already a teacher of this class!");
    //   error.statusCode = 400;
    //   throw error;
    // }

    // await User.findByIdAndUpdate(userId, {
    //   $push: { enrolled: classId },
    // });

    // const updatedClass = await Class.findOneAndUpdate(joiningClass._id, {
    //   $push: { students: userId },
    // })
    //   .select("name backgroundColor _id teacher")
    //   .populate({
    //     path: "teacher",
    //     select: {
    //       "credentials.name": 1,
    //       "credentials.email": 1,
    //       "credentials.userImage": 1,
    //       _id: 0,
    //     },
    //   });

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
