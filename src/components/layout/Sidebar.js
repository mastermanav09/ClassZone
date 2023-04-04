import React from "react";
import classes from "./Sidebar.module.scss";
const Sidebar = (props) => {
  return <div className={classes.container}>
    <div id="mySidebar" class={classes.sidebar}>
      <button href="" class={classes.closebtn} onClick={props.closeSideBar}>&times;</button>
      <a href="#">About</a>
    </div>
  </div>;
};

export default Sidebar;
