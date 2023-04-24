import React from "react";
import DesignContainer from "./DesignContainer";
import AuthForm from "./AuthForm";
import classes from "./Auth.module.scss";

const Auth = (props) => {
  const { isRegister } = props;

  return (
    <div className={classes.wrapper}>
      <DesignContainer />
      <AuthForm isRegister={isRegister} />
    </div>
  );
};

export default Auth;
