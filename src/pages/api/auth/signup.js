import db from "../../../utils/db";
import User from "../../../models/user";
import bcrypt from "bcryptjs";
import { userSignupValidation } from "../../../../utils/validators/signupValidation";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return;
  }

  const { name, email, password, role } = req.body;
  userSignupValidation(
    {
      name,
      email,
      password,
    },
    res
  );

  try {
    await db.connect();

    const existingUser = await User.findOne({ "credentials.email": email });
    if (existingUser) {
      const error = new Error();
      error.statusCode = 422;
      error.message = "User Already exists!";
      throw error;
    }

    const newUser = new User({
      credentials: {
        name: name,
        email: email,
        password: bcrypt.hashSync(password),
        role: role,
        isAdmin: false,
      },

      classes: [],
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
