import Class from "../../../models/Class";
import ClassUI from "@/components/class/ClassUI";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import db from "../../../utils/db";

const ClassPage = ({ classDetails, error }) => {
  return <ClassUI classDetails={classDetails} />;
};

ClassPage.auth = true;
export default ClassPage;

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: true,
      },
    };
  }

  let userClass = null;
  try {
    const query = context.query;
    const { classId } = query;
    await db.connect();

    userClass = await Class.findById(classId)
      .populate({
        path: "teacher",
        select: {
          "credentials.name": 1,
          "credentials.email": 1,
          "credentials.userImage": 1,
          _id: 0,
        },
      })
      .lean();

    userClass = JSON.stringify(userClass);
    await db.disconnect();

    return {
      props: {
        classDetails: JSON.parse(userClass),
      },
    };
  } catch (error) {
    return {
      redirect: {
        permanent: true,
        destination: "/not_found",
      },
    };
  }

  return {};
}
