import React from "react";
import classes from "./Sidebar.module.scss";
import Cross from "@/components/svg/Cross";
import Link from "next/link";
import { signOut } from "next-auth/react";
import Image from "next/image";
import logo from "../../../public/logo.png";
import logo_text from "../../../public/logo_text.png";

const Sidebar = (props) => {
  const { toggleSidebar, showSideBar } = props;

  const logoutHandler = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div
      className={[
        classes.sidebar,
        showSideBar ? classes.open : classes.close,
      ].join(" ")}
      onClick={(event) => event.stopPropagation()}
    >
      <div className={classes.header}>
        <Link href="/" onClick={() => toggleSidebar(false)}>
          <Image src={logo} width={60} height={60} alt="logo" />
        </Link>
        <Image src={logo_text} width={130} height={40} alt="logo" />
      </div>
      <div className={classes["list-section"]}>
        <ul className={classes["list"]}>
          <Link href={`/`} onClick={() => toggleSidebar(false)}>
            <li className={classes["list-item"]}>
              <div>Home</div>
            </li>
          </Link>

          <Link href={`/about`} onClick={() => toggleSidebar(false)}>
            <li className={classes["list-item"]}>
              <div>About</div>
            </li>
          </Link>

          <Link href={`/contactus`} onClick={() => toggleSidebar(false)}>
            <li className={classes["list-item"]}>
              <div>Contact Us</div>
            </li>
          </Link>
        </ul>

        <div
          className={classes["logout"]}
          onClick={() => {
            toggleSidebar(false);
            logoutHandler();
          }}
        >
          <li className={classes["list-item"]}>
            <div>Logout</div>
          </li>
        </div>
      </div>
      <label
        htmlFor="menu-control"
        className={classes["sidebar__close"]}
        onClick={() => toggleSidebar(false)}
      >
        <Cross />
      </label>
    </div>
  );
};

export default Sidebar;
