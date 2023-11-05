import User from "../../../../models/User";

export const handler = async (userId, classId) => {
  try {
    const user = await User.findById(userId);
    const { enrolled: enrolledClasses } = user;

    const isAuthorized = enrolledClasses.find(
      (item) => item.classDetails.toString() === classId
    );

    return {
      isAuthorized,
    };
  } catch (error) {
    return {
      isAuthorized: false,
    };
  }
};
