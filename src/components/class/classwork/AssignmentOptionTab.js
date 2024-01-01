import React, { useEffect } from "react";
import classes from "./AssignmentOptionTab.module.scss";
import { useRouter } from "next/router";
import { getAssignmentDetails } from "../../../../utils/store/reducers/class";
import { useDispatch } from "react-redux";
import { getFileExtension } from "@/helper/fileExtensionHelper";
import { FileIcon, defaultStyles } from "react-file-icon";
import moment from "moment";

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

  const submittedFileExtension = getFileExtension(classAssignment?.filePath);
  const dueDate = classAssignment && new Date(classAssignment.dueDate);

  const downloadFileHandler = () => {
    window.open(classAssignment?.filePath, "_blank");
  };

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

          {classAssignment.filePath ? (
            <div className={classes["file-icon"]}>
              {classAssignment?.filePath && (
                <div
                  className={classes["download-file"]}
                  onClick={downloadFileHandler}
                >
                  <FileIcon
                    extension={submittedFileExtension}
                    {...defaultStyles[submittedFileExtension]}
                  />
                </div>
              )}
            </div>
          ) : (
            <div>
              <h5 style={{ fontWeight: "bold", color: "#BF3131" }}>
                No files uploaded!
              </h5>
            </div>
          )}
        </div>

        <div className={classes["dueDate"]}>
          <span>Due Date</span>
          <div>{moment(dueDate).format("LL")}</div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AssignmentOptionTab);
