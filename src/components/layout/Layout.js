import React from "react";
import MainNavigation from "./MainNavigation";
import classes from "./Layout.module.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { useDispatch } from "react-redux";
import { uiActions } from "../../../utils/store/reducers/ui";

const Layout = (props) => {
  const dispatch = useDispatch();

  return (
    <>
      <ToastContainer
        position="top-right"
        limit={1}
        autoClose={2000}
        hideProgressBar={false}
        className={classes["toast-container"]}
      />
      <MainNavigation />
      <main
        className={classes.main}
        onClick={() =>
          dispatch(uiActions.toggleNavbarClassDropdown({ status: false }))
        }
      >
        {props.children}
      </main>
    </>
  );
};

export default Layout;
