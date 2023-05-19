import React, { useState } from "react";
import Link from "next/link";
import classes from "./ClassUI.module.scss";
import Image from "next/image";
import { createNewAnnouncement } from "../../../utils/store/reducers/class";
import { useDispatch } from "react-redux";
import EditorWrapper from "./EditorWrapper";
import Announcement from "./Announcement";
import ScrollToTop from "../svg/ScrollToTop";

const ClassUI = ({ classDetails }) => {
	const dispatch = useDispatch();
	const { _id, name, backgroundColor, teacher, batch } = classDetails;

	const createAnnouncement = () => {
		dispatch(createNewAnnouncement({ classId: _id, content }));
	};
	return (
		<div className={classes.class}>
			<div
				className={classes["class__nameBox"]}
				style={{ backgroundColor: backgroundColor }}
			>
				<div className={classes["class__name"]}>{name}</div>
				<div className={classes["class__batch"]}>{batch}</div>
			</div>
			<div className={classes.container}>
				<div className={classes["classes__upcoming"]}>
					<h4>Upcoming</h4>
					<p>Woohoo, no work due soon!</p>
					<div className={classes.viewAllContainer}>
						<Link href="" className={classes.viewAll}>
							View all
						</Link>
					</div>
				</div>
				<div className={classes.announcementContainer}>
					<EditorWrapper
						createAnnouncement={createAnnouncement}
						teacher={teacher}
					/>
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
					<Announcement teacher={teacher} />
				</div>
			</div>
			<ScrollToTop />
		</div>
	);
};

export default React.memo(ClassUI);
