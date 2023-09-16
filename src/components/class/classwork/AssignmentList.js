import React, { useState } from "react";
import AssignmentCard from "./AssignmentCard";
import { useDispatch } from "react-redux";
import classes from "./AssignmentList.module.scss";
import { deleteAssignment } from "../../../../utils/store/reducers/class";
import LoadingSpinner from "@/components/progress/LoadingSpinner";
import Modal from "react-responsive-modal";

const AssignmentList = (props) => {
  const { classId, assignments, teacher, user, backgroundColor } = props;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteAssignmentId, setDeleteAssignmentId] = useState(null);

  const openConfirmDeleteAssignmentHandler = (id) => {
    setConfirmDelete(true);
    setDeleteAssignmentId(id);
  };

  const closeConfirmDeleteAssignmentHandler = () => {
    setConfirmDelete(false);
    setDeleteAssignmentId(null);
  };

  const deleteAssignmentHandler = () => {
    dispatch(
      deleteAssignment({
        deleteAssignmentId,
        classId,
        setIsLoading,
        closeConfirmDeleteAssignmentHandler,
      })
    );
  };

  if (!assignments) {
    return (
      <div className={classes["center"]}>
        <LoadingSpinner className={classes.spinner_one} />
      </div>
    );
  }

  return (
    <>
      {confirmDelete && (
        <Modal
          classNames={classes["react-responsive-modal-modal"]}
          center
          onClose={closeConfirmDeleteAssignmentHandler}
          open={confirmDelete}
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
          <div className={classes["modal-content"]}>
            <div
              className={`${classes["modal-header"]} ${classes["flex-column"]}`}
            >
              <h4 className={classes["modal-title"]}>Are you sure ?</h4>
            </div>
            <div className={classes["modal-body"]}>
              <p>Do you really want to delete this assignment ?</p>
            </div>
            <div className={classes["modal-footer"]}>
              <button
                type="button"
                className={classes["cancel-button"]}
                data-dismiss="modal"
                onClick={closeConfirmDeleteAssignmentHandler}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isLoading}
                className={classes["delete-button"]}
                onClick={deleteAssignmentHandler}
              >
                {isLoading ? (
                  <LoadingSpinner className={classes.spinner_two} />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

      <div className={classes["assignment-list"]}>
        {assignments?.length > 0 ? (
          assignments.map((assignment) => (
            <AssignmentCard
              key={assignment._id}
              assignment={assignment}
              teacher={teacher}
              classId={classId}
              backgroundColor={backgroundColor}
              user={user}
              confirmDeleteHandler={openConfirmDeleteAssignmentHandler}
            />
          ))
        ) : (
          <div className={classes["no-assignments-found-text"]}>
            <h3>No Assignments found!</h3>
          </div>
        )}
      </div>
    </>
  );
};

export default React.memo(AssignmentList);
