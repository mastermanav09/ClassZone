import React from "react";
import classes from "./Skeleton.module.scss";

const Shimmer = () => {
  return (
    <div className={`${classes["shimmer-wrapper"]}`}>
      <div className={`${classes["shimmer"]}`}></div>;
    </div>
  );
};

export default Shimmer;
