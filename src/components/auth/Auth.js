import React from "react";
import DesignContainer from "./DesignContainer";
import AuthForm from "./AuthForm";
import classes from "./Auth.module.scss";

const Auth = (props) => {
  const { isRegister, redirect, joinClass, classId } = props;

  return (
    <div className={classes.wrapper}>
      <DesignContainer />
      <AuthForm
        isRegister={isRegister}
        redirect={redirect}
        joinClass={joinClass}
        classId={classId}
      />
    </div>
  );
};

export default Auth;
