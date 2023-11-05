import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import classes from "./AddClassForm.module.scss";
import { useDispatch } from "react-redux";
import { createClass } from "../../../utils/store/reducers/class";
import { useState } from "react";
import LoadingSpinner from "../progress/LoadingSpinner";

const AddClassForm = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toggleAddClassModal, showAddClassModal, pathname } = props;
  const form = useForm();
  const distpatch = useDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = ({ className, subject, batch }) => {
    distpatch(
      createClass({
        setIsLoading,
        router,
        pathname,
        classData: { className, subject, batch },
      })
    );
  };

  return (
    <div>
      <Modal
        classNames={classes["react-responsive-modal-modal"]}
        onClose={toggleAddClassModal}
        center
        open={showAddClassModal}
        animationDuration={200}
        styles={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
          closeIcon: {
            fill: "#ff0000",
          },
          modal: {
            width: "90%",
            maxWidth: "35rem",
            borderRadius: "10px",
          },
        }}
      >
        <div className={classes.modal}>
          <h2>Create class</h2>
          <form
            className={classes.form}
            id="my-form"
            type="text"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label htmlFor="className">Class name</label>
              <input
                type="text"
                id="className"
                placeholder="Class name"
                {...register("className", {
                  required: "Please enter valid name of class",
                  minLength: {
                    value: 5,
                    message: "Class name must be of at least 5 characters.",
                  },
                })}
              />

              {errors.className && (
                <div className={classes["validation-text"]}>
                  {errors.className.message}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="batch">Batch</label>
              <input
                type="text"
                placeholder="Batch"
                id="batch"
                {...register("batch", {
                  required: "Please enter valid name of batch",
                  minLength: {
                    value: 3,
                    message: "Batch name must be of at least 3 characters.",
                  },
                })}
              />
              {errors.batch && (
                <div className={classes["validation-text"]}>
                  {errors.batch.message}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                placeholder="Subject"
                id="subject"
                {...register("subject", {
                  required: "Please enter valid name of subject",
                  minLength: {
                    value: 3,
                    message: "Subject name must be of at least 3 characters.",
                  },
                })}
              />
              {errors.subject && (
                <div className={classes["validation-text"]}>
                  {errors.subject.message}
                </div>
              )}
            </div>
          </form>
          <div className={classes.btn}>
            <button type="submit" form="my-form" disabled={isLoading}>
              {isLoading ? (
                <LoadingSpinner className={classes.spinner} />
              ) : (
                "Create"
              )}
            </button>
            <button onClick={toggleAddClassModal}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddClassForm;
