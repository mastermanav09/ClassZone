import React from "react";
import classes from "./ChatItem.module.scss";
import moment from "moment";

const ChatItem = (props) => {
  const { message } = props;
  return (
    <div className={classes["chat-item"]}>
      <div className={classes["name"]}>
        {message.name}
        <span className={classes.time}>{message.time}</span>
      </div>
      <div className={classes["message"]}>{message.message}</div>
    </div>
  );
};

export default ChatItem;
