import User from "../../../../models/User";
import db from "../../../../utils/db";
import manageResponses from "../../../../utils/responses/manageResponses";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(400).json({
      status: 400,
      message: "Bad Request!",
    });
  }

  try {
    const userId = req.headers["x-user-id"];

    await db.connect();
    const userResponse = await User.findById(userId).select(
      "-credentials.password -__v -createdAt -updatedAt -provider"
    );

    let enrolledClasses = [],
      teachingClasses = [];

    let user_doc;
    user_doc = await User.findById(userId)
      .select("teaching")
      .populate({
        path: "teaching.classDetails",
        select: {
          teaching: 1,
          name: 1,
          backgroundColor: 1,
          _id: 1,
        },
      });

    teachingClasses = user_doc.teaching;

    user_doc = await User.findById(userId)
      .select("enrolled")
      .populate({
        path: "enrolled.classDetails",
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

    enrolledClasses.sort((a, b) => a.index - b.index);
    teachingClasses.sort((a, b) => a.index - b.index);

    return res.status(200).json({
      ...manageResponses(200, null),
      user: {
        ...userResponse._doc,
        teaching: teachingClasses,
        enrolled: enrolledClasses,
      },
    });
  } catch (error) {
    console.log(error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    return res
      .status(error.statusCode)
      .json(
        manageResponses(
          error.statusCode,
          "Oops, something went wrong. Please try again later."
        )
      );
  }
};
export default handler;
