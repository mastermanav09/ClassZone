import React, { useState } from "react";
import classes from "./AssignmentCard.module.scss";
import Upload from "../svg/Upload";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

const AssignmentCard = ({ id, text }) => {
  const [openContentModal, setOpenContentModal] = useState(false);

  return (
    <>
      {openContentModal && (
        <Modal
          classNames={classes["react-responsive-modal-modal"]}
          onClose={() => setOpenContentModal(false)}
          center
          o
          pen={openContentModal}
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
              width: "90%",
              maxWidth: "35rem",
              borderRadius: "10px",
            },
          }}
        >
          <div className={classes["assignment-body"]}>
            <div>{text}</div>
          </div>
        </Modal>
      )}

      <div className={classes.container}>
        <div
          className={classes.assignmentText}
          onClick={() => setOpenContentModal(true)}
        >
          <div>{id})</div>
          <div>{text}</div>
        </div>
        {/* <div className={classes.vl}></div> */}
        <div className={classes.Upload}>
          <Upload />
        </div>
      </div>
    </>
  );
};

export default AssignmentCard;
