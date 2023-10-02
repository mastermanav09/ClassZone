import mongoose from "mongoose";
import Class from "../../../../../../models/Class";
import manageResponses from "../../../../../../utils/responses/manageResponses";
import { authOptions } from "../../../auth/[...nextauth]";
import db from "../../../../../../utils/db";
import User from "../../../../../../models/User";

const { getServerSession } = require("next-auth");

const handler = async (req, res) => {
  if (req.method !== "DELETE") {
    return res.status(400).json({
      status: 400,
      message: "Bad Request!",
    });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (
      !session ||
      !session.user ||
      (!session.user.email && !session.user._id)
    ) {
      const error = new Error("Sign in required!");
      error.statusCode = 401;
      throw error;
    }

    const { user } = session;
    let filter = { _id: user._id };

    if (!user._id) {
      filter = { "credentials.email": user.email };
    }

    const { classId, classMemberId } = req.query;
    var ObjectId = mongoose.Types.ObjectId;

    if (!ObjectId.isValid(classId) || !ObjectId.isValid(classMemberId)) {
      const error = new Error("Invalid Id!");
      error.statusCode = 422;
      throw error;
    }

    const currentUser = await User.findOne(filter);
    const { _id: userId } = currentUser;

    if (userId.toString() === classMemberId.toString()) {
      const error = new Error("You cannot remove yourself!");
      error.statusCode = 400;
      throw error;
    }

    await db.connect();
    await Class.findByIdAndUpdate(classId, {
      $pull: { students: classMemberId },
    });

    await User.findByIdAndUpdate(classMemberId, {
      $pull: { enrolled: classId },
    });

    // remove all responses of this user for this class.

    return res.status(200).json({
      message: "Member removed successfully",
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
