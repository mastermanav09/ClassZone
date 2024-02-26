import React, { useEffect } from "react";
import classes from "./JoinToast.module.scss";
import Image from "next/image";

const JoinToast = (props) => {
  const {
    showToast,
    callerName,
    callerImage,
    admitUserHandler,
    rejectUserHandler,
  } = props;

  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        const audio = new Audio("/sounds/admit.wav");
        audio.play();
      }, 500);
    }
  }, [showToast]);

  return (
    <div className={`${classes.toast} ${showToast ? classes.show : ""}`}>
      <div className={classes.userInfo}>
        <Image
          src={callerImage}
          alt="User Avatar"
          width={40}
          height={40}
          className={classes.avatar}
        />
        <div className={classes.userDetails}>
          <span className={classes.username}>{callerName}</span>
          <span className={classes.message}> wants to join the call</span>
        </div>
      </div>
      <div className={classes.actionButtons}>
        <button
          className={`${classes.btn} ${classes.admitBtn}`}
          onClick={admitUserHandler}
        >
          Admit
        </button>
        <button
          className={`${classes.btn} ${classes.denyBtn}`}
          onClick={rejectUserHandler}
        >
          Deny
        </button>
      </div>
    </div>
  );
};

export default JoinToast;
