import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import classes from "./InsideClass.module.scss";
const Class = ({ classId }) => {
	const [textEditor, setTextEditor] = useState(false);
	const [content, setContent] = useState("");
	const Editor = dynamic(() => import("./Editor"), { ssr: false });
	const getValue = (value) => {
		setContent(value);
	};
	const cancelButton = () => {
		setContent("");
		setTextEditor(false);
	};
	return (
		<div className={classes.class}>
			<div className={classes["class__nameBox"]}>
				<div className={classes["class__name"]}>NAME</div>
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
				{textEditor === false ? (
					<div className={classes["class__announce"]}>
						<img
							src="https://th.bing.com/th/id/OIP.YHCtUpoNz1wqYbf0d9tIUQHaLO?pid=ImgDet&rs=1"
							alt="User image"
						/>
						<input
							type="text"
							placeholder="Announce something to your class"
							onClick={() => setTextEditor(true)}
						/>
					</div>
				) : null}
				{textEditor === true ? (
					<div className={classes.editor}>
						<Editor contents={content} getValue={getValue} />
						<div className={classes.container}>
							<button>Post</button>
							<button onClick={cancelButton}>Cancel</button>
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default Class;
