import React from "react";
import Shimmer from "./Shimmer";
import SkeletonElement from "./SkeletonElement";
import classes from "./Skeleton.module.scss";

const SkeletonScream = ({ theme }) => {
  const themeClass = theme || "light";

  return (
    <div className={`${classes["skeleton-wrapper"]} ${classes[themeClass]}`}>
      <div className={`${classes["skeleton-scream"]}`}>
        <div className={`${classes["sub-skeleton-scream"]}`}>
          <SkeletonElement type="text" />
          <SkeletonElement type="text" />
        </div>
      </div>
      <Shimmer />
    </div>
  );
};

export default SkeletonScream;
