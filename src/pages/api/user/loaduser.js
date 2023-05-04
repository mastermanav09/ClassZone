import User from "../../../../models/User";
import db from "../../../../utils/db";
import { authOptions } from "../auth/[...nextauth]";
import manageResponses from "../../../../utils/responses/manageResponses";
import { getServerSession } from "next-auth/next";

const handler = async (req, res) => {
  if (req.method !== "GET") {
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
    const { email } = user;

    await db.connect();

    const userResponse = await User.findOne({
      "credentials.email": email,
    }).select("-credentials.password -__v -createdAt -updatedAt");

    if (!userResponse) {
      const error = new Error("User not found!");
      error.statusCode = 404;
      throw error;
    }

    await db.disconnect();

    return res
      .status(200)
      .json({ ...manageResponses(200, null), user: userResponse });
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
