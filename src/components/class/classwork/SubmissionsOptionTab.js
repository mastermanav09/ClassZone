import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getAssignmentSubmissions } from "../../../../utils/store/reducers/class";
import { useDispatch } from "react-redux";
import SubmissionCard from "./SubmissionCard";
import classes from "./SubmissionsOptionTab.module.scss";

const SubmissionsOptionTab = (props) => {
  const {
    classId,
    assignmentId,
    assignmentSubmissions,
    loader,
    setAssignmentSubmissions,
  } = props;

  const [isRemainingSelected, setIsRemainingSelected] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

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

  if (!assignmentSubmissions) {
    return loader;
  }

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
      <div className={classes.list}>
        {assignmentSubmissions?.responses.map((response) => (
          <SubmissionCard key={response._id} submission={response} />
        ))}
      </div>
    </div>
  );
};

export default React.memo(SubmissionsOptionTab);
