import React from "react";
import classes from "./ChatItem.module.scss";

const ChatItem = () => {
  return (
    <div className={classes["chat-item"]}>
      <div className={classes["name"]}>
        Manav Naharwal <span className={classes.time}>5:05 PM</span>
      </div>
      <div className={classes["message"]}>
        Manav NaharwalManav NaharwalManav NaharwalManav Naharwal
      </div>
    </div>
  );
};

export default ChatItem;
