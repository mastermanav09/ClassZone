import React from "react";
import Image from "next/image";
import classes from "./Announcement.module.scss";
import moment from "moment/moment";
import HTMLReactParser from "html-react-parser";
import ThreeDots from "../svg/ThreeDots";

const Announcement = ({ teacher, announcement }) => {
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
        <div className={classes.content}>
          {HTMLReactParser(announcement.text)}
        </div>
        <div className={classes.date}>
          <div>{moment(announcement.date).format("LLL")}</div>
        </div>
      </div>
      <ThreeDots />
    </div>
  );
};

export default Announcement;
