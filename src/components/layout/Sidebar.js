import React from "react";
import classes from "./Sidebar.module.scss";
import Cross from "@/components/svg/Cross";
import Link from "next/link";
import { signOut } from "next-auth/react";

const Sidebar = (props) => {
  const { toggleSidebar, showSideBar } = props;

  const logoutHandler = () => {
    signOut();
  };

  return (
    <div
      className={[
        classes.sidebar,
        showSideBar ? classes.open : classes.close,
      ].join(" ")}
    >
      <div className={classes.header}></div>
      <div className={classes["list-section"]}>
        <ul className={classes["list"]}>
          <Link href={`/`}>
            <li className={classes["list-item"]}>
              <div> Home</div>
            </li>
          </Link>

          <Link href={`/about`}>
            <li className={classes["list-item"]}>
              <div>About</div>
            </li>
          </Link>

          <Link href={`/contactus`}>
            <li className={classes["list-item"]}>
              <div>Contact Us</div>
            </li>
          </Link>
        </ul>

        <div className={classes["logout"]} onClick={logoutHandler}>
          <li className={classes["list-item"]}>
            <div>Logout</div>
          </li>
        </div>
      </div>

      <label
        htmlFor="menu-control"
        className={classes["sidebar__close"]}
        onClick={toggleSidebar}
      >
        <Cross />
      </label>
    </div>
  );
};

export default Sidebar;
