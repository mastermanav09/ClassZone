import "react-responsive-modal/styles.css";
import React, { useEffect, useRef, useState } from "react";
import classes from "./AssignmentCard.module.scss";
import Upload from "../../svg/Upload";
import { Modal } from "react-responsive-modal";
import Edit from "../../svg/Edit";
import Delete from "../../svg/Delete";
import { notifyAndUpdate } from "@/helper/toastNotifyAndUpdate";
import { toast } from "react-toastify";
import {
  createSubmission,
  removeSubmission,
} from "../../../../utils/store/reducers/class";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../progress/LoadingSpinner";
import { ERROR_TOAST } from "../../../../utils/constants";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  getFileExtension,
  removeFileExtension,
} from "@/helper/fileExtensionHelper";

const AssignmentCard = (props) => {
  const {
    assignment,
    confirmDeleteHandler,
    teacher,
    user,
    classId,
    backgroundColor,
  } = props;
  const dispatch = useDispatch();
  const [openContentModal, setOpenContentModal] = useState(false);
  const [openUploadFileModal, setOpenUploadFileModal] = useState(false);
  const [isNewFileSelected, setIsNewFileSelected] = useState(false);
  const [file, setFile] = useState(null);
  const userCommentRef = useRef(null);
  const userComment = useSelector(
    (state) => state.class.currentClassDetails.comment
  );
  const [assignmentLoader, setAssignmentLoader] = useState(false);
  const router = useRouter();
  const { responses } = assignment;
  const [isFileSubmitted, setIsFileSubmitted] = useState(
    responses && responses[0] ? true : false
  );
  const { _id: assignmentId } = assignment;

  // useEffect(() => {
  //   if (responses?.length > 0) {
  //     setUserComment(responses[0].comment);
  //   }
  // }, [responses]);

  const userNavigateHandler = () => {
    if (
      (user?._id && user?._id === teacher?.credentials._id) ||
      (user?.email && user?.email === teacher?.credentials.email)
    ) {
      router.push(
        `/classes/${classId}/classwork/${assignmentId}?bc=${encodeURIComponent(
          backgroundColor
        )}`
      );
    } else {
      setOpenContentModal(true);
    }
  };

  const fileHandler = (event) => {
    if (event.target?.files.length > 0) {
      setFile(event.target.files[0]);
      setIsNewFileSelected(true);
    }
  };

  const submitHandler = () => {
    if (!file) {
      notifyAndUpdate(
        ERROR_TOAST,
        "error",
        "Please select a file for submission.",
        toast
      );

      return;
    } else if (file && parseInt(file.size) / (1024 * 1024) > 10) {
      notifyAndUpdate(
        ERROR_TOAST,
        "error",
        "Maximum file size allowed is 10MB.",
        toast
      );

      return;
    }

    dispatch(
      createSubmission({
        setAssignmentLoader,
        classId,
        assignmentId,
        file,
        setFile,
        setIsNewFileSelected,
        setIsFileSubmitted,
        setOpenUploadFileModal,
        // setUserComment,
        userCommentRef,
      })
    );
  };

  const unsubmitHandler = () => {
    dispatch(
      removeSubmission({
        setAssignmentLoader,
        classId,
        assignmentId,
        setIsFileSubmitted,
        setOpenUploadFileModal,
      })
    );
  };

  let uploadingFileName = "";

  if (file) {
    let fileNameWithoutExt = removeFileExtension(file.name);
    if (fileNameWithoutExt.length < 15) {
      uploadingFileName = file.name;
    } else {
      uploadingFileName =
        fileNameWithoutExt.substring(0, 15) +
        ".... ." +
        getFileExtension(file.name);
    }
  }

  return (
    <>
      {openContentModal && (
        <Modal
          classNames={classes["react-responsive-modal-modal"]}
          onClose={() => setOpenContentModal(false)}
          center
          open={openContentModal}
          animationDuration={200}
          styles={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.75)",
            },

            closeIcon: {
              fill: "#ff0000",
              marginLeft: "10px",
            },

            modal: {
              maxHeight: "35rem",
              width: "90%",
              maxWidth: "55rem",
              borderRadius: "10px",
              padding: "1rem 1rem 0 1rem",
            },
          }}
        >
          <div className={classes["assignment-modal-body"]}>
            <div className={classes["assignment-content"]}>
              <div className={classes["assignment-title"]}>
                <span>Title : </span>
                <div>{assignment.title}</div>
              </div>

              <div className={classes["assignment-description"]}>
                <span>Description : </span>
                <div>{assignment?.description}</div>
              </div>
            </div>
          </div>
          <div className={classes["assignment-actions"]}>
            {/* {(user?._id && user?._id !== teacher?.credentials._id) ||
              (user?.email && user?.email !== teacher?.credentials.email && (
                <></>
              ))} */}

            <button
              className={classes["modal-upload-btn"]}
              onClick={() => setOpenUploadFileModal(true)}
            >
              Upload
            </button>
          </div>
        </Modal>
      )}

      {openUploadFileModal && (
        <Modal
          classNames={classes["react-responsive-modal-modal"]}
          onClose={() => {
            setOpenUploadFileModal(false);
            setFile(null);
            setIsNewFileSelected(false);
          }}
          center
          open={openUploadFileModal}
          animationDuration={200}
          styles={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.75)",
            },

            closeIcon: {
              fill: "#ff0000",
              marginLeft: "10px",
            },

            modal: {
              maxHeight: "35rem",
              width: "90%",
              maxWidth: "35rem",
              borderRadius: "10px",
            },
          }}
        >
          <div className={classes["upload-assignment-modal-body"]}>
            <div className={classes["upload-assignment-info"]}>
              <div>
                <span className={classes["assignment-title"]}>
                  Assignment Title :
                </span>
                <div className={classes["assignment-title-info"]}>
                  {assignment.title}
                </div>
              </div>
              <div>
                <span className={classes["assignment-submittedTo"]}>
                  {isFileSubmitted ? "Submitted to : " : "Submitting to :"}
                </span>
                <div className={classes["assignment-submission"]}>
                  <div className={classes["submittedTo-image"]}>
                    {teacher?.credentials.userImage && (
                      <Image
                        alt="teacher-image"
                        src={teacher.credentials.userImage}
                        width={50}
                        height={50}
                      />
                    )}
                  </div>
                  <div className={classes["assignment-submittedTo-info"]}>
                    {teacher?.credentials.name}
                  </div>
                </div>
              </div>
            </div>

            {!isFileSubmitted && (
              <div className={classes["upload-assignment-main"]}>
                <div>
                  {file && (
                    <div className={classes["uploadedFile-name"]}>
                      {uploadingFileName}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    className={[
                      classes["file-input-box"],
                      isNewFileSelected
                        ? classes["selected"]
                        : classes["not-selected"],
                    ].join(" ")}
                  >
                    <i className="fas fa-cloud-upload-alt fa-3x"></i>
                    <input
                      type="file"
                      className={classes["hidden"]}
                      onChange={fileHandler}
                    />
                    <div className={classes["file_select_text"]}>
                      {isNewFileSelected ? (
                        <span>File Selected</span>
                      ) : (
                        <span>Select File</span>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            )}

            <div className={classes.comment}>
              <span className={classes["comment-title"]}>
                {!isFileSubmitted ? (
                  "Private comment"
                ) : userComment ? (
                  "Submitted comment"
                ) : (
                  <></>
                )}
              </span>
              <span className={classes["comment-textarea"]}>
                {isFileSubmitted ? (
                  <div className={classes["submitted-comment"]}>
                    {userComment}
                  </div>
                ) : (
                  <textarea
                    rows={4}
                    placeholder="Write your comment here"
                    ref={userCommentRef}
                  ></textarea>
                )}
              </span>
            </div>

            <div
              className={
                isFileSubmitted
                  ? classes["unsubmit-assignment-btn"]
                  : classes["submit-assignment-btn"]
              }
            >
              <button
                disabled={assignmentLoader}
                onClick={isFileSubmitted ? unsubmitHandler : submitHandler}
              >
                {assignmentLoader ? (
                  <LoadingSpinner className={classes.spinner} />
                ) : (
                  <>{isFileSubmitted ? "Unsubmit" : "Submit"}</>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

      <div className={classes.container}>
        <div
          className={classes["assignment-card-body"]}
          onClick={userNavigateHandler}
        >
          <div>{assignment.title}</div>
        </div>

        <div className={classes.actions}>
          {(user?._id && user?._id === teacher?.credentials._id) ||
            (user?.email && user?.email === teacher?.credentials.email ? (
              <>
                <span>
                  <Edit tooltipContent="Edit" tooltipId="edit-assignment" />
                </span>
                <span onClick={() => confirmDeleteHandler(assignmentId)}>
                  <Delete
                    tooltipContent="Delete"
                    tooltipId="delete-assignment"
                  />
                </span>
              </>
            ) : (
              <span onClick={() => setOpenUploadFileModal(true)}>
                <Upload tooltipContent="Upload" tooltipId="upload-assignment" />
              </span>
            ))}
        </div>
      </div>
    </>
  );
};

export default AssignmentCard;
