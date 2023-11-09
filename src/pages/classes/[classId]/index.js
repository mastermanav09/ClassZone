import ClassUI from "@/components/class/ClassUI";
import Class from "../../../../models/Class.js";
import { authOptions } from "@/pages/api/auth/[...nextauth].js";
import { getServerSession } from "next-auth";
import { classAuthHandler } from "@/pages/api/class/authorize.js";
import db from "../../../../utils/db.js";

const ClassPage = (props) => {
  return <ClassUI />;
};

ClassPage.auth = true;
export default ClassPage;

export async function getServerSideProps(context) {
  await db.connect();

  const { classId } = context.query;
  const session = await getServerSession(context.req, context.res, authOptions);
  const classData = await Class.findById(classId);

  let authRes = {};
  if (session) {
    const { _id: userId } = session.user;

    if (classData.teacher.toString() !== userId) {
      authRes = await classAuthHandler(userId, classId);
    } else {
      authRes = { isAuthorized: true };
    }
  }

  if (!authRes.isAuthorized) {
    return {
      redirect: {
        destination: "/?class_force_redirect=true",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
