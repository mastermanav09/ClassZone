import React from "react";
import classes from "./Card.module.scss";
import { useRouter } from "next/router";
import Image from "next/image";

const Card = ({ classId }) => {
  const router = useRouter();

  return (
    <div
      className={classes.classCard}
      style={{ marginRight: 30, marginBottom: 30 }}
      onClick={() =>
        router.push({
          pathname: "/classes/[classId]",
          query: { classId: classId },
        })
      }
    >
      <div className={classes["classCard__upper"]}>
        <div className={classes["classCard_desc"]}>
          <span className={classes["classCard__className"]}>Name</span>
          <span className={classes["classCard__creatorName"]}>Creator</span>
        </div>

        <Image
          width={60}
          height={60}
          src="/static/profileImages/user.jpg"
          alt="user_img"
          className={classes["classCard__creatorPhoto"]}
        />
      </div>
      <div className={classes["classCard__middle"]}></div>
      <div className={classes["classCard__lower"]}></div>
    </div>
  );
};

export default Card;
