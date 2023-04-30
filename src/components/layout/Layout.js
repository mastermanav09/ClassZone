import React, { useEffect, useState } from "react";
import MainNavigation from "./MainNavigation";
import { useRouter } from "next/router";
import classes from "./Layout.module.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const Layout = (props) => {
  const [authorized, setauthorized] = useState(false);
  const router = useRouter();
  const pathName = router.pathname;

  useEffect(() => {
    const bodyWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    if (bodyWidth <= 980) {
      setauthorized(true);
    } else if (pathName === "/login" || pathName === "/register") {
      setauthorized(false);
    } else {
      setauthorized(true);
    }
  }, [pathName]);

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
