import React from "react";
import classes from "./Plus.module.scss";

const Plus = (props) => {
	return (
		<svg
			{...props}
			className={classes.plus}
			fill="none"
			viewBox="0 0 22 22"
			strokeWidth="2"
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 4.5v15m7.5-7.5h-15"
			/>
		</svg>
	);
};

export default Plus;
