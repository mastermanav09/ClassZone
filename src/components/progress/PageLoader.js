import React from "react";
import classes from "./PageLoader.module.scss";

const PageLoader = () => {
  return (
    <div className={classes["wrapper"]}>
      <div className={classes["loading-container"]}>
        <div className={classes["loading-text"]}>
          <span>L</span>
          <span>O</span>
          <span>A</span>
          <span>D</span>
          <span>I</span>
          <span>N</span>
          <span>G</span>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
