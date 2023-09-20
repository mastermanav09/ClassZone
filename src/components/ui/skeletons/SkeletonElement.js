import classes from "./Skeleton.module.scss";
import React from "react";

const SkeletonElement = ({ type }) => {
  return <div className={`${classes.skeleton} ${classes[type]}`}></div>;
};

export default SkeletonElement;
