import React, { useState } from "react";
import * as FaIcons from "react-icons/fa"
import classes from "./MainNavigation.module.scss";
import Sidebar from "./Sidebar";

const MainNavigation = () => {
  const [sideBar, setSideBar] = useState(0);
  let iconStyles = { color: "black", fontSize: "25px" };
  return <div className={classes.container}>
    <div className={classes.navbar} id="main">
      <div className={classes.container1}>
        <div className={classes.sidebarBtn}>
          <FaIcons.FaBars style={iconStyles} onClick={() => setSideBar(1)} />
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
      (sideBar === 1) ? (
        <div id="mySidebar" class={classes.sidebar}>
          <button href="" class={classes.closebtn} onClick={() => setSideBar(0)}>&times;</button>
          <a href="#">About</a>
        </div>
      ) : <p></p>
    }
  </div>
};

export default MainNavigation;
