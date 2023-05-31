import React from "react";
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

const Announcement = ({
  teacher,
  announcement,
  classId,
  editAnnouncementHandler,
  backgroundColor,
}) => {
  const { _id, text, createdAt, isEdited, isPinned } = announcement;
  const dispatch = useDispatch();

  const manageAnnouncementPinHandler = (isPinned) => {
    dispatch(manageAnnouncementPin({ classId, _id, isPinned }));
  };

  const deleteAnnouncementHandler = () => {
    dispatch(deleteAnnouncement({ classId, _id, isPinned }));
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
      action: () => editAnnouncementHandler(text, _id, isPinned),
    },

    {
      text: "Delete",
      action: deleteAnnouncementHandler,
    },
  ];

  return (
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
          src={teacher.credentials.userImage}
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
      <ThreeDots fields={fields} />
    </div>
  );
};

export default React.memo(Announcement);
