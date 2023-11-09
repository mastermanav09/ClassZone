import AssignmentDetail from "@/components/class/classwork/AssignmentDetail";
import React, { useState } from "react";
import Class from "../../../../../models/Class";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { classAuthHandler } from "@/pages/api/class/authorize";
import db from "../../../../../utils/db";

const AssignmentDetailPage = () => {
  const [classAssignment, setClassAssignment] = useState(null);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState(null);
  const [assignmentSubmissionsRemaining, setAssignmentSubmissionsRemaining] =
    useState(null);
  const [currentTab, setCurrentTab] = useState("assignments");

  const navigateTab = (tab) => {
    setCurrentTab(tab);
  };

  return (
    <AssignmentDetail
      classAssignment={classAssignment}
      assignmentSubmissions={assignmentSubmissions}
      assignmentSubmissionsRemaining={assignmentSubmissionsRemaining}
      setClassAssignment={setClassAssignment}
      setAssignmentSubmissions={setAssignmentSubmissions}
      setAssignmentSubmissionsRemaining={setAssignmentSubmissionsRemaining}
      navigateTab={navigateTab}
      currentTab={currentTab}
    />
  );
};

export default AssignmentDetailPage;

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
