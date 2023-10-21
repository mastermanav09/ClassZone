require("../../../../models/Class");
import User from "../../../../models/User";
import db from "../../../../utils/db";
import { authOptions } from "../auth/[...nextauth]";
import manageResponses from "../../../../utils/responses/manageResponses";
import { getServerSession } from "next-auth/next";

const handler = async (req, res) => {
  if (req.method !== "GET") {
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

    await db.connect();
    const userResponse = await User.findById(userId).select(
      "-credentials.password -__v -createdAt -updatedAt -provider"
    );

    let enrolledClasses = [],
      teachingClasses = [];

    let user_doc;
    user_doc = await User.findById(userId)
      .select("teaching")
      .populate("teaching", "name backgroundColor _id");

    teachingClasses = user_doc.teaching;

    user_doc = await User.findById(userId)
      .select("enrolled")
      .populate({
        path: "enrolled",
        select: {
          name: 1,
          backgroundColor: 1,
          _id: 1,
          teacher: 1,
        },

        populate: {
          path: "teacher",
          select: {
            "credentials.name": 1,
            "credentials.email": 1,
            "credentials.userImage": 1,
            _id: 0,
          },
        },
      });

    enrolledClasses = user_doc.enrolled;

    return res.status(200).json({
      ...manageResponses(200, null),
      user: {
        ...userResponse._doc,
        teaching: teachingClasses,
        enrolled: enrolledClasses,
      },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    return res
      .status(error.statusCode)
      .json(manageResponses(error.statusCode, error.message));
  }
};

export default handler;
