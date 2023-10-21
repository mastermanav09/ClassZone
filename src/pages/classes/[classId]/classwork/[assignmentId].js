import AssignmentDetail from "@/components/class/classwork/AssignmentDetail";
import React, { useState } from "react";
import Class from "../../../../../models/Class";
import db from "../../../../../utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import mongoose from "mongoose";

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
  const { query, req, res } = context;
  const { classId } = query;

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user || !session.user._id) {
    return {
      props: {},
      redirect: {
        destination: "/unauthorized",
        permanent: true,
      },
    };
  }

  const { _id: userId } = session.user;

  let ObjectId = mongoose.Types.ObjectId;
  if (!ObjectId.isValid(classId)) {
    return {
      props: {},
      redirect: {
        destination: "/not_found",
        permanent: true,
      },
    };
  }

  await db.connect();
  const userClass = await Class.findOne({
    _id: classId,
  })
    .select("teacher")
    .populate({
      path: "teacher",
      select: {
        "credentials.email": 1,
        "credentials.userImage": 1,
        "credentials.name": 1,
        _id: 1,
      },
    });

  if (!userClass) {
    return {
      props: {},
      redirect: {
        destination: "/not_found",
        permanent: true,
      },
    };
  }

  if (userClass.teacher._id.toString() !== userId) {
    return {
      props: {},
      redirect: {
        destination: "/unauthorized",
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
}
