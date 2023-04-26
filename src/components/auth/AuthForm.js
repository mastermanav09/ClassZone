import React from "react";
import classes from "./AuthForm.module.scss";
import Link from "next/link";
import Google from "../svg/Google";

import { signIn } from "next-auth/react";

const AuthForm = ({ isRegister }) => {
  const googleAuthHandler = () => {
    signIn();
  };

  return (
    <div className={classes.container}>
      <div className={classes.auth}>
        <form className={classes.form}>
          <div className={classes["hi_gif"]} />
          <div className={classes.welcomeMessage}>
            {!isRegister ? <h1>Welcome Back!</h1> : <h1>Welcome!</h1>}

            <div className={classes["typing_slider"]}>
              <p>Welcome to ClassZone, Our E-learning platform!</p>
              <p>We&apos;re excited to have you here and looking forward</p>
              <p>to help you achieve your learning goals.</p>
            </div>
          </div>

          {isRegister ? <p>Name</p> : null}
          {isRegister ? (
            <input type="text" placeholder="Type your Name" />
          ) : null}
          <p>E-mail</p>
          <input type="email" placeholder="Type your Email" />
          <p>Password</p>
          <input type="password" placeholder="Type your Password" />

          <input
            type="submit"
            value={isRegister ? "Register" : "Log in"}
            className={classes.submit}
          />

          {!isRegister ? (
            <Link className={classes.link} href="/register">
              {" "}
              <span> Don&apos;t have an account </span>{" "}
              <span> Register here</span>
            </Link>
          ) : (
            <Link className={classes.link} href="/login">
              {" "}
              <span>Already have an account</span> <span>Signin here</span>
            </Link>
          )}

          <div className={classes.striped}>
            <span className={`${classes["striped-line"]}`}></span>
            <span className={`${classes["striped-text"]}`}>Or</span>
            <span className={`${classes["striped-line"]}`}></span>
          </div>
          <div className={classes.method}>
            <div className={`${classes["method-control"]}`}>
              <button
                onClick={googleAuthHandler}
                className={`${classes["method-action"]}`}
              >
                <Google />
                <span>Sign in with Google</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
