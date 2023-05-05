import React, { useEffect, useState } from "react";
import MainNavigation from "./MainNavigation";
import { useRouter } from "next/router";
import classes from "./Layout.module.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { useCallback } from "react";

const Layout = (props) => {
  const [authorized, setauthorized] = useState(false);
  const router = useRouter();
  const pathName = router.pathname;

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
    if (windowDimensions.width <= 980) {
      setauthorized(true);
    } else if (pathName === "/login" || pathName === "/register") {
      setauthorized(false);
    } else {
      setauthorized(true);
    }
  }, [pathName, windowDimensions]);

  return (
    <>
      <ToastContainer
        position="top-right"
        limit={1}
        autoClose={2000}
        hideProgressBar={false}
        className={classes["toast-container"]}
      />
      {authorized && <MainNavigation />}
      <main
        className={authorized ? classes[`main.authorized`] : classes["main"]}
      >
        {props.children}
      </main>
    </>
  );
};

export default Layout;
