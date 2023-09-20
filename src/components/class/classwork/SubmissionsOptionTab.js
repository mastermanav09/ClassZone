import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  getAssignmentSubmissions,
  getAssignmentSubmissionsRemaining,
} from "../../../../utils/store/reducers/class";
import { useDispatch } from "react-redux";
import SubmissionCard from "./SubmissionCard";
import classes from "./SubmissionsOptionTab.module.scss";

const SubmissionsOptionTab = (props) => {
  const {
    classId,
    assignmentId,
    assignmentSubmissions,
    assignmentSubmissionsRemaining,
    loader,
    setAssignmentSubmissions,
    setAssignmentSubmissionsRemaining,
  } = props;

  const [isRemainingSelected, setIsRemainingSelected] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (isRemainingSelected) {
      if (!assignmentSubmissionsRemaining) {
        dispatch(
          getAssignmentSubmissionsRemaining({
            classId,
            assignmentId,
            router,
            setAssignmentSubmissionsRemaining,
          })
        );
      } else {
      }
    }
  }, [
    assignmentId,
    assignmentSubmissionsRemaining,
    classId,
    dispatch,
    isRemainingSelected,
    router,
    setAssignmentSubmissionsRemaining,
  ]);

  useEffect(() => {
    if (!assignmentSubmissions) {
      if (classId && assignmentId) {
        dispatch(
          getAssignmentSubmissions({
            classId,
            assignmentId,
            router,
            setAssignmentSubmissions,
          })
        );
      }
    }
  }, [
    assignmentId,
    assignmentSubmissions,
    classId,
    setAssignmentSubmissions,
    router,
    dispatch,
  ]);

  return (
    <div className={classes.container}>
      <div className={classes.options}>
        <button
          onClick={() => setIsRemainingSelected(!isRemainingSelected)}
          className={[
            classes.remaining,
            isRemainingSelected ? classes.selected : "",
          ].join(" ")}
        >
          Remaining
        </button>
      </div>
      {!assignmentSubmissions ||
      (isRemainingSelected && !assignmentSubmissionsRemaining) ? (
        <div style={{ marginTop: "10rem" }}>{loader}</div>
      ) : (
        <div className={classes.list}>
          {isRemainingSelected ? (
            <>
              {assignmentSubmissionsRemaining?.map((response, index) => (
                <SubmissionCard key={index} submission={response} />
              ))}
            </>
          ) : (
            <>
              {assignmentSubmissions?.responses.map((response) => (
                <SubmissionCard key={response._id} submission={response} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(SubmissionsOptionTab);
