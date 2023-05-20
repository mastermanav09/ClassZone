import React from "react";
import Image from "next/image";
import classes from "./Announcement.module.scss";
import moment from "moment/moment";
import HTMLReactParser from "html-react-parser";

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
          <pre>{HTMLReactParser(announcement.text)}</pre>
        </div>
        <div className={classes.date}>
          <div>{moment(announcement.date).format("LLL")}</div>
        </div>
      </div>
    </div>
  );
};

export default Announcement;
