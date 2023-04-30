import React, { useState } from "react";
import classes from "./AuthForm.module.scss";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Google from "../svg/Google";
import { useDispatch } from "react-redux";
import { signIn } from "next-auth/react";
import { login, signup } from "../../../utils/store/reducers/user";
import LoadingSpinner from "../progress/LoadingSpinner";
import { useRouter } from "next/router";

const AuthForm = ({ isRegister }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession;
  const router = useRouter();
  const dispatch = useDispatch();
  const submitHandler = async ({ name, email, password }) => {
    if (isRegister) {
      dispatch(signup({ name, email, password, setIsLoading, router }));
    } else {
      dispatch(login({ email, password, setIsLoading, router }));
    }
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const googleAuthHandler = () => {
    signIn("google");
  };

  return (
    <div className={classes.container}>
      <div className={classes.auth}>
        <form className={classes.form} onSubmit={handleSubmit(submitHandler)}>
          <div className={classes["hi_gif"]} />
          <div className={classes.welcomeMessage}>
            {!isRegister ? <h1>Welcome Back!</h1> : <h1>Welcome!</h1>}

            <div className={classes["typing_slider"]}>
              <p>Welcome to ClassZone, Our E-learning platform!</p>
              <p>We&apos;re excited to have you here and looking forward</p>
              <p>to help you achieve your learning goals.</p>
            </div>
          </div>

          {isRegister && <p>Name</p>}
          {isRegister && (
            <input
              type="text"
              placeholder="Type your Name"
              {...register("name", {
                required: "Please enter your Name.",
                minLength: {
                  value: 3,
                  message: "Name should be of at least 3 characters.",
                },
              })}
            />
          )}

          {errors.name && (
            <div className={classes["validation-text"]}>
              {errors.name.message}
            </div>
          )}

          <p>E-mail</p>
          <input
            type="email"
            placeholder="Type your Email"
            {...register("email", {
              required: "Please enter your email.",
              pattern: {
                value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i,
                message: "Please enter valid email.",
              },
            })}
          />

          {errors.email && (
            <div className={classes["validation-text"]}>
              {errors.email.message}
            </div>
          )}

          <p>Password</p>
          <input
            type="password"
            placeholder="Type your Password"
            {...register("password", {
              required: "Please enter valid password",
              minLength: {
                value: 8,
                message: "Password must be of at least 8 characters.",
              },
            })}
          />

          {errors.password && (
            <div className={classes["validation-text"]}>
              {errors.password.message}
            </div>
          )}

          <button type="submit" className={classes.submit}>
            {isLoading ? (
              <LoadingSpinner className={classes.spinner} />
            ) : isRegister ? (
              "Register"
            ) : (
              "Log in"
            )}
          </button>

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
                type="button"
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
