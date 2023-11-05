import mongoose from "mongoose";
import Class from "../../../../../../models/Class";
import manageResponses from "../../../../../../utils/responses/manageResponses";
import db from "../../../../../../utils/db";
import User from "../../../../../../models/User";

const handler = async (req, res) => {
  if (req.method !== "DELETE") {
    return res.status(400).json({
      status: 400,
      message: "Bad Request!",
    });
  }

  try {
    const userId = req.headers["x-user-id"];

    const { classId, classMemberId } = req.query;
    var ObjectId = mongoose.Types.ObjectId;

    if (!ObjectId.isValid(classId) || !ObjectId.isValid(classMemberId)) {
      const error = new Error("Invalid Id!");
      error.statusCode = 422;
      throw error;
    }

    if (userId.toString() === classMemberId.toString()) {
      const error = new Error("You cannot remove yourself!");
      error.statusCode = 400;
      throw error;
    }

    await db.connect();

    const classData = await Class.findById(classId);

    if (classData?.teacher.toString() !== userId) {
      const error = new Error("Unauthorized!");
      error.statusCode = 401;
      throw error;
    }

    await Class.findByIdAndUpdate(classId, {
      $pull: { members: classMemberId },
    });

    const data = await User.findOneAndUpdate(
      { _id: classMemberId },
      {
        $pull: { enrolled: { classDetails: classId } },
      }
    );

    if (data) {
      const enrolledClasses = data.enrolled;
      const removedClass = enrolledClasses.filter(
        (item) => item.classDetails.toString() === classId
      );

      const removedClassIndex = removedClass[0].index;

      await User.updateOne(
        {
          _id: classMemberId,
        },
        { $inc: { "enrolled.$[element].index": -1 } },
        {
          arrayFilters: [{ "element.index": { $gt: removedClassIndex } }],
        }
      );
    }

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
