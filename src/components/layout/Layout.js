import React, { useEffect, useState } from "react";
import MainNavigation from "./MainNavigation";
import { useRouter } from "next/router";
import classes from "./Layout.module.scss";

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
