import "react-datepicker/dist/react-datepicker.css";
import React, { useState } from "react";
import { useRouter } from "next/router";
import ClassNavDropdown from "../ClassNavDropdown";
import classes from "./Classwork.module.scss";
import AssignmentCard from "@/components/class/AssignmentCard";
import { Modal } from "react-responsive-modal";
import { useForm } from "react-hook-form";
import "react-responsive-modal/styles.css";
import { notifyAndUpdate } from "@/helper/toastNotifyAndUpdate";
import { ERROR_TOAST } from "../../../../utils/constants";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { createAssignment } from "../../../../utils/store/reducers/assignment";
import LoadingSpinner from "@/components/progress/LoadingSpinner";
import DatePicker from "react-datepicker";

const Classwork = () => {
  const router = useRouter();
  const { classId, bc: backgroundColor } = router.query;
  const [openAssignmentModal, setOpenAssignmentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;
  const [isNewFileSelected, setIsNewFileSelected] = useState(false);
  const [file, setFile] = useState(null);
  const [startDate, setStartDate] = useState(new Date());

  const fileHandler = (event) => {
    if (event.target?.files.length > 0) {
      setFile(event.target.files[0]);
      setIsNewFileSelected(true);
    }
  };

  const submitHandler = ({ title, description }) => {
    if (title.trim().length < 3 || description.trim().length < 5) {
      notifyAndUpdate(
        ERROR_TOAST,
        "error",
        "Please fill valid information!",
        toast
      );

      return;
    }

    if (file && file.size / (1024 * 1024) > 10) {
      notifyAndUpdate(
        ERROR_TOAST,
        "error",
        "Maximum file size allowed is 10MB.",
        toast
      );

      return;
    }

    dispatch(
      createAssignment({
        title,
        description,
        classId,
        startDate,
        file,
        setIsLoading,
        setOpenAssignmentModal,
        reset,
        setFile,
      })
    );

    setStartDate(new Date());
  };

  return (
    <>
      {openAssignmentModal && (
        <Modal
          classNames={classes["react-responsive-modal-modal"]}
          onClose={() => setOpenAssignmentModal(false)}
          center
          open={openAssignmentModal}
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
              minHeight: "35rem",
              width: "90%",
              maxWidth: "35rem",
              borderRadius: "10px",
            },
          }}
        >
          <div className={classes.modal}>
            <h2>Create Assignment</h2>
            <form
              className={classes.form}
              id="my-form"
              type="text"
              onSubmit={handleSubmit(submitHandler)}
            >
              <div>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  placeholder="Title"
                  {...register("title", {
                    required: "Please enter valid title for assignment",
                    minLength: {
                      value: 3,
                      message: "Title must be of at least 3 characters.",
                    },
                  })}
                />

                {errors.title && (
                  <div className={classes["validation-text"]}>
                    {errors.title.message}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="description">Description</label>
                <textarea
                  placeholder="Description"
                  id="description"
                  {...register("description", {
                    required: "Please enter valid description",
                    minLength: {
                      value: 5,
                      message: "Description must be of at least 5 characters.",
                    },
                  })}
                />
                {errors.description && (
                  <div className={classes["validation-text"]}>
                    {errors.description.message}
                  </div>
                )}
              </div>
              <div>
                <div
                  className={classes["remove-file-text"]}
                  onClick={() => {
                    setIsNewFileSelected(false);
                    setFile(null);
                  }}
                >
                  <span>Remove file</span>
                </div>

                <div className={classes["file-edit-main"]}>
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
              <div className={classes["due-date-pick"]}>
                <label htmlFor="description">Due Date</label>
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                />
              </div>
            </form>
            <div className={classes.btn}>
              <button
                className={classes["create-assignment-btn"]}
                type="submit"
                form="my-form"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner className={classes.spinner} />
                ) : (
                  "Create"
                )}
              </button>
              <button onClick={() => setOpenAssignmentModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
      <div className={classes.assignment}>
        <ClassNavDropdown _id={classId} backgroundColor={backgroundColor} />
        <div className={classes.container}>
          <h2>Classwork</h2>
          <button onClick={() => setOpenAssignmentModal(true)}>
            Create Assignment
          </button>
        </div>
        <hr style={{ marginBottom: "1rem" }} />
        <AssignmentCard id={1} text={"Physics Assignment 1"} />
        <AssignmentCard id={2} text={"Maths Assignment 2"} />
        <AssignmentCard id={3} text={"Chemistry Assignment 3"} />
        <AssignmentCard id={4} text={"C++ Assignment 4"} />
      </div>
    </>
  );
};

export default Classwork;
