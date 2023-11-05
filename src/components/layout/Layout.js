import React from "react";
import MainNavigation from "./MainNavigation";
import classes from "./Layout.module.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { closeUIComponents } from "@/helper/closeOpenUIComponents";

const Layout = (props) => {
  return (
    <div onClick={() => closeUIComponents()}>
      <ToastContainer
        position="top-right"
        limit={2}
        autoClose={2000}
        hideProgressBar={false}
        className={classes["toast-container"]}
      />
      <MainNavigation />
      <main className={classes.main}>{props.children}</main>
    </div>
  );
};

export default React.memo(Layout);
