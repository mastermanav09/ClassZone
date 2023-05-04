import React, { useState } from "react";
import classes from "./MainNavigation.module.scss";
import Sidebar from "./Sidebar";
import Plus from "@/components/svg/Plus";
import Hamburger from "@/components/svg/Hamburger";
import { useDispatch } from "react-redux";
import { createClass } from "../../../utils/store/reducers/class";

const MainNavigation = () => {
  const [showSideBar, setShowSideBar] = useState(false);
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    setShowSideBar((prev) => !prev);
  };

  const addClassHandler = () => {
    dispatch(
      createClass({
        classData: {
          className: "dadadada",
          subject: "dakdjald",
          batch: "daldkjalk",
        },
      })
    );
  };

  return (
    <>
      {showSideBar && (
        <Sidebar toggleSidebar={toggleSidebar} showSideBar={showSideBar} />
      )}
      <div className={classes.wrapper}>
        <div className={classes.navbar}>
          <div className={classes["container_one"]}>
            <div className={classes.sidebarBtn}>
              <Hamburger onClick={toggleSidebar} />
            </div>
            <div className={classes.logo}>Logo</div>
          </div>
          <div className={classes["container_two"]}>
            <div className={classes.addBtn} onClick={addClassHandler}>
              <Plus />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainNavigation;
