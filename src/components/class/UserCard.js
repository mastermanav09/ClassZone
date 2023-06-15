import React from "react";
import Image from "next/image";
import ThreeDots from "../svg/ThreeDots";
import classes from "./UserCard.module.scss";
const UserCard = ({ people }) => {
	return (
		<div className={classes.container}>
			<div className={classes.userinfo}>
				<Image
					width={40}
					height={40}
					src="/static/profileImages/no-img.png"
					className={classes.img}
				/>
				<span>{people.name}</span>
			</div>
			<div className={classes.threeDots}>
				<ThreeDots />
			</div>
		</div>
	);
};

export default UserCard;
