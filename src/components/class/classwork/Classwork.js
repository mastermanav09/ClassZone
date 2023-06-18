import React, { useState } from "react";
import { useRouter } from "next/router";
import ClassNavDropdown from "../ClassNavDropdown";
import classes from "./Classwork.module.scss";
import AssignmentCard from "@/components/class/AssignmentCard";
import { Modal } from "react-responsive-modal";
import { useForm } from "react-hook-form";
import "react-responsive-modal/styles.css";

const Classwork = () => {
  const router = useRouter();
  console.log(router.query);
  const { classId, bc: backgroundColor } = router.query;
  const [openAssignmentModal, setOpenAssignmentModal] = useState(false);
  const form = useForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <>
      {openAssignmentModal === true ? (
        <Modal
          classNames={classes["react-responsive-modal-modal"]}
          onClose={() => setOpenAssignmentModal(false)}
          center
          open={openAssignmentModal}
          animationDuration={200}
          styles={{
            overlay: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.75)",
            },
            closeIcon: {
              fill: "#ff0000",
              marginLeft: "10px",
            },
            modal: {
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
              // onSubmit={handleSubmit(onSubmit)}
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
                      value: 5,
                      message: "Title must be of at least 5 characters.",
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
                <input
                  type="text"
                  placeholder="Description"
                  id="description"
                  {...register("description", {
                    required: "Please enter valid description",
                    minLength: {
                      value: 3,
                      message: "Description must be of at least 3 characters.",
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
                <input type="file" />
              </div>
            </form>
            <div className={classes.btn}>
              <button type="submit" form="my-form">
                Create
              </button>
              <button onClick={() => setOpenAssignmentModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      ) : null}
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
