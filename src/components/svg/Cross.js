import React from "react";
import classes from "./Cross.module.scss";

const Cross = (props) => {
  return (
    <svg
      {...props}
      className={classes.cross}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};

export default Cross;
