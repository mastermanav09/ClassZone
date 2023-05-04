import React from "react";
import Warning from "../svg/Warning";
import Head from "next/head";
import classes from "./UnauthorizedError.module.scss";

const UnauthorizedError = ({ message }) => {
  return (
    <>
      <Head>
        <title>Unauthorized!</title>
      </Head>
      <div className={classes.main}>
        <h1 className={classes.heading}>
          <Warning className={classes.warning} />
          Access Denied
        </h1>
        {message && <div className={classes["warning-message"]}>{message}</div>}
      </div>
    </>
  );
};

export default UnauthorizedError;
