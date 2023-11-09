import mongoose from "mongoose";
import Class from "../../../../../../models/Class";
import manageResponses from "../../../../../../utils/responses/manageResponses";

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

    const data = await Class.findById(classId)
      .select("members teacher -_id")
      .populate({
        path: "teacher",
        select: {
          "credentials.email": 1,
          "credentials.userImage": 1,
          "credentials.name": 1,
          _id: 1,
        },
      })
      .populate({
        path: "members",
        select: {
          "credentials.userImage": 1,
          "credentials.email": 1,
          "credentials.name": 1,
          _id: 1,
        },
      });

    return res.status(200).json({
      people: data.members,
      teacher: data.teacher,
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
