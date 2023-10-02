import React, { useState } from "react";
import { useRouter } from "next/router";
import ClassNavDropdown from "../ClassNavDropdown";
import classes from "./AssignmentDetail.module.scss";
import AssignmentOptionTab from "./AssignmentOptionTab";
import SubmissionsOptionTab from "./SubmissionsOptionTab";
import LoadingSpinner from "@/components/progress/LoadingSpinner";

const AssignmentDetail = (props) => {
  const {
    classAssignment,
    assignmentSubmissions,
    assignmentSubmissionsRemaining,
    setClassAssignment,
    setAssignmentSubmissions,
    setAssignmentSubmissionsRemaining,
    currentTab,
    navigateTab,
  } = props;
  const router = useRouter();
  const { classId, bc: backgroundColor, assignmentId } = router.query;

  return (
    <>
      <ClassNavDropdown classId={classId} backgroundColor={backgroundColor} />
      <div className={classes.container}>
        <div className={classes.optionBox}>
          <div
            className={[
              classes.options,
              currentTab === "assignments" && classes.active,
            ].join(" ")}
            onClick={() => navigateTab("assignments")}
          >
            Assignment
          </div>
          <div
            className={[
              classes.options,
              currentTab === "submissions" && classes.active,
            ].join(" ")}
            onClick={() => navigateTab("submissions")}
          >
            Submissions
          </div>
        </div>
        <hr />

        <div className={classes["tab-content"]}>
          {currentTab === "assignments" ? (
            <AssignmentOptionTab
              classId={classId}
              assignmentId={assignmentId}
              classAssignment={classAssignment}
              setClassAssignment={setClassAssignment}
              loader={<LoadingSpinner className={classes.spinner} />}
            />
          ) : (
            <SubmissionsOptionTab
              classId={classId}
              assignmentId={assignmentId}
              assignmentSubmissions={assignmentSubmissions}
              assignmentSubmissionsRemaining={assignmentSubmissionsRemaining}
              setAssignmentSubmissions={setAssignmentSubmissions}
              setAssignmentSubmissionsRemaining={
                setAssignmentSubmissionsRemaining
              }
              loader={<LoadingSpinner className={classes.spinner} />}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AssignmentDetail;
