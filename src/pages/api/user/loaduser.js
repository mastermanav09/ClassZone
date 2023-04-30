import User from "../../../../models/User";
import manageResponses from "../../../../utils/responses/manageResponses";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(400).json({
      message: "Bad Request!",
    });
  }

  try {
    const session = await getSession({ req });
    if (!session) {
      const error = new Error("Sign in required!");
      error.statusCode = 401;
      throw error;
    }

    const { user } = session;
    const { email } = user;

    const userResponse = await User.findOne({
      "credentials.email": email,
    }).select("-credentials.password -__v -createdAt -updatedAt");

    if (!userResponse) {
      const error = new Error("User not found!");
      error.statusCode = 404;
      throw error;
    }

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
