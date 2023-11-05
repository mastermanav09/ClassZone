import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../api/auth/[...nextauth]";
import Classwork from "@/components/class/classwork/Classwork";
import Class from "../../../../../models/Class";

const ClassworkPage = () => {
  return <Classwork />;
};

export default ClassworkPage;
export async function getServerSideProps(context) {
  const { classId } = context.query;
  const session = await getServerSession(context.req, context.res, authOptions);
  const classData = await Class.findById(classId);

  let authRes = {};
  if (session) {
    const { _id: userId } = session.user;

    if (classData.teacher.toString() !== userId) {
      const authMid = await import("../../../api/class/authorize");
      authRes = await authMid.handler(userId, classId);
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
