import React, { useEffect, useState } from "react";
import MainNavigation from "./MainNavigation";
import classes from "./Layout.module.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { uiActions } from "../../../utils/store/reducers/ui";
import { useSession } from "next-auth/react";

const Layout = (props) => {
  const [showNavbar, setShowNavbar] = useState(false);
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const hasWindow = typeof window !== "undefined";

  const getWindowDimensions = useCallback(() => {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    return {
      width,
      height,
    };
  }, [hasWindow]);

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    if (hasWindow) {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [getWindowDimensions, hasWindow]);

  useEffect(() => {
    console.log(session);
    if (session) {
      setShowNavbar(true);
    } else if (windowDimensions.width <= 980) {
      setShowNavbar(true);
    } else {
      setShowNavbar(false);
    }
  }, [session, windowDimensions.width]);

  return (
    <>
      <ToastContainer
        position="top-right"
        limit={1}
        autoClose={2000}
        hideProgressBar={false}
        className={classes["toast-container"]}
      />
      {showNavbar && <MainNavigation />}
      <main
        className={showNavbar ? classes["main_showNavbar"] : classes["main"]}
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
