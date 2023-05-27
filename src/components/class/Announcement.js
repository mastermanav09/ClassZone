import React from "react";
import Image from "next/image";
import classes from "./Announcement.module.scss";
import moment from "moment/moment";
import HTMLReactParser from "html-react-parser";
import ThreeDots from "../svg/ThreeDots";
import { deleteAnnouncement } from "../../../utils/store/reducers/class";
import { useDispatch } from "react-redux";

const Announcement = ({
  teacher,
  announcement,
  classId,
  editAnnouncementHandler,
}) => {
  const { _id, text, date, isEdited } = announcement;
  const dispatch = useDispatch();

  const PinAnnouncementHandler = () => {};

  const deleteAnnouncementHandler = () => {
    dispatch(deleteAnnouncement({ classId, _id }));
  };

  const fields = [
    {
      text: "Pin",
      action: PinAnnouncementHandler,
    },

    {
      text: "Edit",
      action: () => editAnnouncementHandler(text, _id),
    },

    {
      text: "Delete",
      action: deleteAnnouncementHandler,
    },
  ];

  return (
    <div className={classes.announcement}>
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
          <div>{moment(date).format("LLL")}</div>
        </div>
      </div>
      {isEdited && <p className={classes["isEdited_text"]}>Edited</p>}
      <ThreeDots fields={fields} />
    </div>
  );
};

export default Announcement;
