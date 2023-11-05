import mongoose from "mongoose";
import manageResponses from "../../../../utils/responses/manageResponses";
import User from "../../../../models/User";

const handler = async (req, res) => {
  if (req.method !== "PATCH") {
    return res.status(400).json({
      status: 400,
      message: "Bad Request!",
    });
  }

  try {
    const userId = req.headers["x-user-id"];
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
      const { enrolled: enrolledClasses } = await User.findById(userId).select(
        "enrolled"
      );

      if (
        fromIndex >= 0 &&
        fromIndex < enrolledClasses.length &&
        toIndex >= 0 &&
        toIndex < enrolledClasses.length
      ) {
        if (fromIndex < toIndex) {
          await User.updateOne(
            {
              _id: userId,
            },
            { $inc: { "enrolled.$[element].index": -1 } },
            {
              arrayFilters: [
                {
                  "element.index": {
                    $gt: fromIndex,
                    $lte: toIndex,
                  },
                },
              ],
            }
          );
        } else {
          await User.updateOne(
            {
              _id: userId,
            },
            { $inc: { "enrolled.$[element].index": 1 } },
            {
              arrayFilters: [
                {
                  "element.index": {
                    $gte: toIndex,
                    $lt: fromIndex,
                  },
                },
              ],
            }
          );
        }

        await User.updateOne(
          { _id: userId, "enrolled.classDetails": classId },
          {
            $set: {
              "enrolled.$.index": toIndex,
            },
          }
        );
      } else {
        const error = new Error("Invalid index!");
        error.statusCode = 422;
        throw error;
      }
    } else if (type === "CLASS_CARD_TEACHING") {
      const data = await User.findById(userId).select("teaching");
      const { teaching: teachingClasses } = data;

      if (
        fromIndex >= 0 &&
        fromIndex < teachingClasses.length &&
        toIndex >= 0 &&
        toIndex < teachingClasses.length
      ) {
        if (fromIndex < toIndex) {
          await User.updateOne(
            {
              _id: userId,
            },
            { $inc: { "teaching.$[element].index": -1 } },
            {
              arrayFilters: [
                {
                  "element.index": {
                    $gt: fromIndex,
                    $lte: toIndex,
                  },
                },
              ],
            }
          );
        } else {
          await User.updateOne(
            {
              _id: userId,
            },
            { $inc: { "teaching.$[element].index": 1 } },
            {
              arrayFilters: [
                {
                  "element.index": {
                    $gte: toIndex,
                    $lt: fromIndex,
                  },
                },
              ],
            }
          );
        }

        await User.updateOne(
          { _id: userId, "teaching.classDetails": classId },
          {
            $set: {
              "teaching.$.index": toIndex,
            },
          }
        );
      } else {
        const error = new Error("Invalid index!");
        error.statusCode = 422;
        throw error;
      }
    }

    return res.status(200).json({});
  } catch (error) {
    console.log(error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    return res
      .status(error.statusCode)
      .json(manageResponses(error.statusCode, "Something went wrong!"));
  }
};

export default handler;
