import React, { useState } from "react";
import { useRouter } from "next/router";
import classes from "./ClassNavDropdown.module.scss";
import Subject from "../svg/Subject";
import Assignment from "../svg/Assignment";
import Classmates from "../svg/Classmates";
import { registerForUIToggle } from "@/helper/closeOpenUIComponents";
import { NavLink } from "./NavLink";
import ClassMenu from "../svg/ClassMenu";

const ClassNavDropdown = ({ classId, backgroundColor }) => {
  const [showNavbarDropdown, setShowNavbarDropdown] = useState(false);
  const router = useRouter();
  registerForUIToggle(setShowNavbarDropdown);

  const handleClick = (event) => {
    event.stopPropagation();
    setShowNavbarDropdown(!showNavbarDropdown);
  };

  return (
    <>
      <div className={classes.options}>
        <ClassMenu
          handleClick={handleClick}
          backgroundColor={backgroundColor}
        />
      </div>
      {showNavbarDropdown && (
        <div className={classes.dropdown} open>
          <ul>
            <NavLink
              href={`/classes/${classId}`}
              className={classes.navlink}
              activeClass={classes.active}
              inactiveClass={classes.in}
              exact={true}
            >
              <li>
                <Subject />
                <p style={{ marginLeft: "10px" }}>Stream</p>
              </li>
            </NavLink>

            <NavLink
              href={`/classes/${classId}/classwork?bc=${encodeURIComponent(
                backgroundColor
              )}`}
              className={classes.navlink}
              activeClass={classes.active}
              inactiveClass={classes.in}
            >
              <li>
                <Assignment />
                <p style={{ marginLeft: "10px" }}>Classwork</p>
              </li>
            </NavLink>

            <NavLink
              href={`/classes/${classId}/people?bc=${encodeURIComponent(
                backgroundColor
              )}`}
              className={classes.navlink}
              activeClass={classes.active}
              inactiveClass={classes.in}
            >
              <li>
                <Classmates />
                <p style={{ marginLeft: "10px" }}>People</p>
              </li>
            </NavLink>
          </ul>
        </div>
      )}
    </>
  );
};

export default ClassNavDropdown;
