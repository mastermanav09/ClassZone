import React, { useState } from "react";
import Image from "next/image";
import classes from "./Announcement.module.scss";
import moment from "moment/moment";
import HTMLReactParser from "html-react-parser";
import ThreeDots from "../svg/ThreeDots";
import {
  deleteAnnouncement,
  manageAnnouncementPin,
} from "../../../utils/store/reducers/class";
import { useDispatch } from "react-redux";
import Pin from "../svg/Pin";
import Modal from "react-responsive-modal";
import LoadingSpinner from "../progress/LoadingSpinner";

const Announcement = ({
  teacher,
  user,
  announcement,
  classId,
  editAnnouncementHandler,
  backgroundColor,
}) => {
  const {
    _id: announcementId,
    text,
    createdAt,
    isEdited,
    isPinned,
  } = announcement;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const manageAnnouncementPinHandler = (isPinned) => {
    dispatch(manageAnnouncementPin({ classId, announcementId, isPinned }));
  };

  const openConfirmDeleteAnnouncementHandler = () => {
    setConfirmDelete(true);
  };

  const closeConfirmDeleteAnnouncementHandler = () => {
    setConfirmDelete(false);
  };

  const deleteAnnouncementHandler = () => {
    dispatch(
      deleteAnnouncement({
        setIsLoading,
        classId,
        announcementId,
        isPinned,
        closeConfirmDeleteAnnouncementHandler,
      })
    );
  };

  const fields = [
    {
      text: isPinned ? "Unpin" : "Pin",
      action: isPinned
        ? () => manageAnnouncementPinHandler(true)
        : () => manageAnnouncementPinHandler(false),
    },

    {
      text: "Edit",
      action: () => editAnnouncementHandler(text, announcementId, isPinned),
    },

    {
      text: "Delete",
      action: openConfirmDeleteAnnouncementHandler,
    },
  ];

  return (
    <>
      {confirmDelete && (
        <Modal
          classNames={classes["react-responsive-modal-modal"]}
          center
          onClose={closeConfirmDeleteAnnouncementHandler}
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
              <p>Do you really want to delete this announcement ?</p>
            </div>
            <div className={classes["modal-footer"]}>
              <button
                type="button"
                className={classes["cancel-button"]}
                data-dismiss="modal"
                onClick={closeConfirmDeleteAnnouncementHandler}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isLoading}
                className={classes["delete-button"]}
                onClick={deleteAnnouncementHandler}
              >
                {isLoading ? (
                  <LoadingSpinner className={classes.spinner} />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

      <div
        className={[
          `${classes.announcement}`,
          isPinned && `${classes["is_pinned"]}`,
        ].join(" ")}
      >
        <div className={classes.imageContainer}>
          <Image
            width={60}
            height={60}
            src={teacher?.credentials.userImage}
            alt="User image"
          />
        </div>
        <div className={classes.contentContainer}>
          <div className={classes.content}>{HTMLReactParser(text)}</div>
          <div className={classes.date}>
            <div>{moment(createdAt).format("LLL")}</div>
          </div>
        </div>
        {isPinned && (
          <Pin style={{ fill: backgroundColor }} className={classes.pin} />
        )}
        {isEdited && <p className={classes["isEdited_text"]}>Edited</p>}
        {user?._id === teacher?._id && <ThreeDots fields={fields} />}
      </div>
    </>
  );
};

export default React.memo(Announcement);
