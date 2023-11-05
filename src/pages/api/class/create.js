import Class from "../../../../models/Class";
import User from "../../../../models/User";
import manageResponses from "../../../../utils/responses/manageResponses";
import { createClassValidation } from "../../../../utils/validators/createClassValidation";

const colors = [
  "#0a9689",
  "#2c6fbb",
  "#4e2374",
  "#CC313D",
  "#7A2048",
  "#008d7d",
];

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(400).json({
      status: 400,
      message: "Bad Request!",
    });
  }

  try {
    const { className, subject, batch, pathname } = req.body;
    const teacherId = req.headers["x-user-id"];
    if (pathname !== "/") {
      const error = new Error("Invalid request");
      error.statusCode = 400;
      throw error;
    }

    const validationResponse = createClassValidation({
      className,
      subject,
      batch,
    });

    if (validationResponse.error) {
      const error = new Error(validationResponse.error?.details[0]?.message);
      error.statusCode = 422;
      throw error;
    }

    const backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    const newClass = new Class({
      name: className,
      subject: subject,
      batch: batch,
      announcements: [],
      assignments: [],
      teacher: teacherId,
      members: [],
      backgroundColor,
    });

    await newClass.save();

    await User.findByIdAndUpdate(teacherId, {
      $inc: { "teaching.$[].index": 1 },
    });

    await User.findByIdAndUpdate(teacherId, {
      $push: {
        teaching: {
          $each: [{ classDetails: newClass._id, index: 0 }],
          $position: 0,
        },
      },
    });

    return res.status(201).json({
      class: {
        classDetails: {
          _id: newClass._doc._id,
          name: newClass._doc.name,
          backgroundColor: newClass._doc.backgroundColor,
        },

        index: 0,
      },
      ...manageResponses(201, "Class created successfully!"),
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
