import React from "react";
import Image from "next/image";
import ThreeDots from "../svg/ThreeDots";
import classes from "./UserCard.module.scss";
const UserCard = ({ user }) => {
  return (
    <div className={classes.container}>
      <div className={classes.userinfo}>
        <Image
          alt="user-image"
          width={40}
          height={40}
          src={user?.credentials?.userImage || "/profileImages/no-img.png"}
          className={classes.img}
        />
        <span>{user?.credentials?.name}</span>
      </div>
      <div className={classes.threeDots}>
        <ThreeDots />
      </div>
    </div>
  );
};

export default UserCard;
