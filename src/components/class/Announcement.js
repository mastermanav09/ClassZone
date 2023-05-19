import React from "react";
import Image from "next/image";
import classes from "./Announcement.module.scss";
const Announcement = ({ teacher }) => {
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
					Dr. Anuradha Chug posted a new assignment: Strassen matrix
					multiplication
				</div>
				<div className={classes.date}>date</div>
			</div>
		</div>
	);
};

export default Announcement;
