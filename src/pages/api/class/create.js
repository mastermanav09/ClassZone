import Class from "../../../../models/Class";
import User from "../../../../models/User";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

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

    const { className, subject, batch, pathname } = req.body;

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

    const teacher = await User.findOne(filter).select(
      "-credentials.password -credentials.isAdmin -enrolled -teaching -provider -createdAt -updatedAt -__v"
    );

    if (!teacher) {
      const error = new Error("User do not exists!");
      error.statusCode = 404;
      throw error;
    }

    const backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    const newClass = new Class({
      name: className,
      subject: subject,
      batch: batch,
      announcements: [],
      teacher: teacher._id,
      students: [],
      backgroundColor,
    });

    await newClass.save();

    await User.findByIdAndUpdate(teacher._id, {
      $push: { teaching: newClass._id },
    });

    return res.status(201).json({
      class: {
        _id: newClass._doc._id,
        name: newClass._doc.name,
        backgroundColor: newClass._doc.backgroundColor,
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
