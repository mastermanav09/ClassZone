import db from "../../../../utils/db";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import Class from "../../../../models/Class";
import manageResponses from "../../../../utils/responses/manageResponses";
import { createClassValidation } from "../../../../utils/validators/createClassValidation";
import User from "../../../../models/User";

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

    const { className, subject, batch } = req.body;
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

    await db.connect();

    const teacher = await User.findOne(filter);
    if (!teacher) {
      const error = new Error("User do not exists!");
      error.statusCode = 404;
      throw error;
    }

    const newClass = new Class({
      name: className,
      subject: subject,
      batch: batch,
      announcements: [],
      teacher: teacher._id,
      students: [],
    });

    await newClass.save();
    await db.disconnect();

    return res.status(201).json({
      class: newClass,
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
