import React, { useState } from "react";
import classes from "./MainNavigation.module.scss";
import Sidebar from "./Sidebar";
import Plus from "@/svg/Plus";
import Hamburger from "@/svg/Hamburger";

const MainNavigation = () => {
  const [showSideBar, setShowSideBar] = useState(false);

  const toggleSidebar = () => {
    setShowSideBar((prev) => !prev);
  };

  return (
    <>
      {showSideBar && (
        <Sidebar toggleSidebar={toggleSidebar} showSideBar={showSideBar} />
      )}
      <div className={classes.wrapper}>
        <div className={classes.navbar} id="main">
          <div className={classes["container_one"]}>
            <div className={classes.sidebarBtn}>
              <Hamburger onClick={toggleSidebar} />
            </div>
            <div className={classes.logo}>Logo</div>
          </div>
          <div className={classes["container_two"]}>
            <div className={classes.addBtn}>
              <Plus />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainNavigation;
