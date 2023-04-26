import db from "../../../../utils/db";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import { userSignupValidation } from "../../../../utils/validators/signupValidation";
import { validationErrorResponse } from "../../../../utils/responses/errorResponse";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return;
  }

  const { name, email, password, role } = req.body;
  const validationResponse = userSignupValidation({
    name,
    email,
    password,
  });

  if (validationResponse.error) {
    return res
      .status(422)
      .json(
        validationErrorResponse(validationResponse.error.details[0].message)
      );
  }

  try {
    await db.connect();

    const existingUser = await User.findOne({ "credentials.email": email });
    if (existingUser) {
      const error = new Error();
      error.statusCode = 422;
      error.message = "User Already exists!";
      throw error;
    }

    const hashedPassword = bcrypt.hash(password, 12);
    const newUser = new User({
      credentials: {
        name: name,
        email: email,
        userImage: "/static/profileImages/no-img.png",
        password: hashedPassword,
      },

      enrolled: [],
      teaching: [],
    });

    await newUser.save();
    res.status(201).json({
      message: "Created new user!",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    res.status(error.statusCode).json(error);
  }
};

export default handler;
