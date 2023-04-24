import React, { useState } from "react";
import classes from './AuthForm.module.scss'
import Link from "next/link";
const AuthForm = ({ Register }) => {
  return <div className={classes.login}>
    <div className={classes.container}></div>
    <div className={classes.welcomeMessage}>
      {(Register === false) ? <h1>Welcome Back!</h1> : <h1>Welcome!</h1>}
    </div>
    <div className={classes.form}>
      {(Register === true) ? <p>Name</p> : null}
      {(Register === true) ? <input type="text" placeholder="Type your Name" /> : null}
      <p>E-mail</p>
      <input type="email" placeholder="Type your Email" />
      <p>Password</p>
      <input type="password" placeholder="Type your Password" />
      {(Register === true) ? <input type="submit" value="Sign Up" className={classes.submit} /> :
        <input type="submit" value="Sign In" className={classes.submit} />}
      {(Register === false) ? <Link className={classes.link} href="/register"> Don't have an account yet Signup here</Link> :
        <Link className={classes.link} href="/login"> Have an account Signin here</Link>}
    </div>
  </div>
};

export default AuthForm;