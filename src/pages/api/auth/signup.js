import User from "../../../../models/User";
import db from "../../../../utils/db";
import bcrypt from "bcryptjs";
import { userSignupValidation } from "../../../../utils/validators/userSignupValidation";
import manageResponses from "../../../../utils/responses/manageResponses";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(400).json({
      status: 400,
      message: "Bad Request!",
    });
  }

  try {
    const { name, email, password } = req.body;
    const validationResponse = userSignupValidation({
      name,
      email,
      password,
    });

    if (validationResponse.error) {
      const error = new Error(validationResponse.error?.details[0]?.message);
      error.statusCode = 422;
      throw error;
    }

    await db.connect();

    const existingUser = await User.findOne({ "credentials.email": email });
    if (existingUser) {
      const error = new Error();
      error.statusCode = 422;
      error.message = "User Already exists!";
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      credentials: {
        name: name,
        email: email,
        userImage: "/images/profileImages/no-img.png",
        password: hashedPassword,
      },

      enrolled: [],
      teaching: [],
    });

    await newUser.save();

    return res.status(201).json(manageResponses(201, null));
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
