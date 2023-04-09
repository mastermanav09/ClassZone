import React, { useState } from "react";
import * as FaIcons from "react-icons/fa"
import classes from "./MainNavigation.module.scss";
import Sidebar from "./Sidebar";

const MainNavigation = () => {
  const [showSideBar, setShowSideBar] = useState(false);
  function closeSideBar() {
    setShowSideBar(false);
  }
  let iconStyles = { color: "black", fontSize: "25px" };
  return <div className={classes.container}>
    <div className={classes.navbar} id="main">
      <div className={classes.container1}>
        <div className={classes.sidebarBtn}>
          <FaIcons.FaBars style={iconStyles} onClick={() => setShowSideBar(true)} />
        </div>
        <div className={classes.logo}> Logo</div>
      </div>
      <div className={classes.container2}>
        <div className={classes.addBtn}>
          <FaIcons.FaPlus style={iconStyles} />
        </div>
      </div>
    </div>
    {
      (showSideBar === true) ? <Sidebar closeSideBar={closeSideBar} /> : <p></p>
    }
  </div>
};

export default MainNavigation;
