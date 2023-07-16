import React, { useEffect, useState } from "react";
import AssignmentCard from "../AssignmentCard";
import { useSelector, useDispatch } from "react-redux";
import classes from "./AssignmentList.module.scss";
import {
  getClass,
  getClassAssignments,
} from "../../../../utils/store/reducers/class";
import LoadingSpinner from "@/components/progress/LoadingSpinner";

const AssignmentList = (props) => {
  const { classId, router } = props;
  const dispatch = useDispatch();
  const classAssignments = useSelector(
    (state) => state.class?.currentClassDetails?.assignments
  );

  useEffect(() => {
    if (classId) {
      if (!classAssignments) {
        dispatch(getClassAssignments({ router, classId }));
      }
    }
  }, [classId, dispatch, classAssignments, router]);

  if (!classAssignments) {
    return (
      <div className={classes["center"]}>
        <LoadingSpinner className={classes.spinner} />
      </div>
    );
  }

  return (
    <>
      {classAssignments?.length > 0 ? (
        classAssignments.map((assignment) => (
          <AssignmentCard key={assignment._id} assignment={assignment} />
        ))
      ) : (
        <div className={classes["no-assignments-found-text"]}>
          <h4>No Assignments found!</h4>
        </div>
      )}
    </>
  );
};

export default React.memo(AssignmentList);
