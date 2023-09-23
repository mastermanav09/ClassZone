import React, { useEffect } from "react";
import classes from "./AssignmentOptionTab.module.scss";
import { useRouter } from "next/router";
import { getAssignmentDetails } from "../../../../utils/store/reducers/class";
import { useDispatch } from "react-redux";

const AssignmentOptionTab = (props) => {
  const { classId, assignmentId, classAssignment, loader, setClassAssignment } =
    props;
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!classAssignment) {
      if (classId && assignmentId) {
        dispatch(
          getAssignmentDetails({
            classId,
            assignmentId,
            router,
            setClassAssignment,
          })
        );
      }
    }
  }, [
    assignmentId,
    classAssignment,
    classId,
    dispatch,
    router,
    setClassAssignment,
  ]);

  if (!classAssignment) {
    return <div style={{ marginTop: "13rem" }}>{loader}</div>;
  }

  return (
    <div>
      <div className={classes["assignment-details"]}>
        <div className={classes["title"]}>
          <span>Title</span>
          <div>{classAssignment.title}</div>
        </div>

        <div className={classes["description"]}>
          <span>Description</span>
          <div>{classAssignment.description}</div>
        </div>

        <div className={classes["documents"]}>
          <span>Documents</span>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AssignmentOptionTab);
