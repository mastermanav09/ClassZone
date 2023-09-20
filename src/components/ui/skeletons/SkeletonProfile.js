import React from "react";
import classes from "./Skeleton.module.scss";
import SkeletonElement from "./SkeletonElement";
import Shimmer from "./Shimmer";

const SkeletonProfile = ({ theme }) => {
  const themeClass = theme || "light";
  return (
    <div className={`${classes["skeleton-wrapper"]} ${classes[themeClass]}`}>
      <div className={`${classes["skeleton-profile"]}`}>
        <SkeletonElement type="avatar" />
        <br />
        <SkeletonElement type="title" />
        <SkeletonElement type="text" />
        <SkeletonElement type="text" />
        <SkeletonElement type="text" />
      </div>
      <Shimmer />
    </div>
  );
};

export default SkeletonProfile;
