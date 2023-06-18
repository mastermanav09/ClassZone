import React, { useState } from "react";
import classes from "./AssignmentCard.module.scss";
import Upload from "../svg/Upload";
import { Modal } from "react-responsive-modal";

import "react-responsive-modal/styles.css";
const AssignmentCard = ({ id, text }) => {
  const [openContentModal, setOpenContentModal] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  return (
    <>
      {openContentModal === true ? (
        <Modal
          classNames={classes["react-responsive-modal-modal"]}
          onClose={() => setOpenContentModal(false)}
          center
          open={openContentModal}
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
          <div style={{ padding: "10px", display: "flex" }}>
            <span style={{ fontWeight: "600" }}>{id})&nbsp;&nbsp; </span>
            <span>{text}</span>
          </div>
        </Modal>
      ) : (
        <></>
      )}
      {openUploadModal === true ? (
        <Modal
          classNames={classes["react-responsive-modal-modal"]}
          onClose={() => setOpenUploadModal(false)}
          center
          open={openUploadModal}
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
          <div style={{ padding: "10px" }}>{text}</div>
        </Modal>
      ) : null}
      <div className={classes.container}>
        <div
          className={classes.assignmentText}
          onClick={() => setOpenContentModal(true)}
        >
          <div>{id})</div>
          <div>{text}</div>
        </div>
        {/* <div className={classes.vl}></div> */}
        <div
          className={classes.Upload}
          onClick={() => setOpenUploadModal(true)}
        >
          <Upload />
        </div>
      </div>
    </>
  );
};

export default AssignmentCard;
