import React, { useState } from "react";
import { useRouter } from "next/router";
import classes from "./ClassNavDropdown.module.scss";
import Subject from "../svg/Subject";
import Assignment from "../svg/Assignment";
import Classmates from "../svg/Classmates";
import { registerForUIToggle } from "@/helper/closeOpenUIComponents";
const NavDropdown = ({ _id, backgroundColor }) => {
  const [showNavbarDropdown, setShowNavbarDropdown] = useState(false);
  const router = useRouter();
  registerForUIToggle(setShowNavbarDropdown);

  const handleClick = (event) => {
    event.stopPropagation();
    setShowNavbarDropdown(!showNavbarDropdown);
  };

  return (
    <div>
      <div className={classes.options}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="Layer_1"
          data-name="Layer 1"
          width="30"
          height="30"
          viewBox="0 0 122.88 121.74"
          onClick={handleClick}
          style={{ fill: backgroundColor, cursor: "pointer" }}
        >
          <title>Options</title>
          <path d="M5,0H49.39a5,5,0,0,1,3.53,1.47A5,5,0,0,1,54.4,5V49.19a5,5,0,0,1-5,5H5a5,5,0,0,1-3.55-1.47l-.09-.11A5,5,0,0,1,0,49.19V5A5,5,0,0,1,5,0ZM73.49,67.53h44.37a5.05,5.05,0,0,1,5,5v44.17a5,5,0,0,1-5,5H73.49A5,5,0,0,1,70,120.27l-.09-.11a4.94,4.94,0,0,1-1.38-3.44V72.55A5,5,0,0,1,70,69l.1-.1a5,5,0,0,1,3.44-1.38ZM5,67.53H49.39A5,5,0,0,1,52.92,69a4.94,4.94,0,0,1,1.48,3.54v44.17a5,5,0,0,1-5,5H5a5,5,0,0,1-3.55-1.47l-.09-.11A5,5,0,0,1,0,116.72V72.55a5,5,0,0,1,5-5ZM73.49,0h44.37a5,5,0,0,1,5,5V49.19a5,5,0,0,1-5,5H73.49a5,5,0,0,1-5-5V5A5,5,0,0,1,70,1.47l.1-.09A5,5,0,0,1,73.49,0Z" />
        </svg>
      </div>
      {showNavbarDropdown ? (
        <div className={classes.dropdown} open>
          <ul>
            <li
              onClick={() =>
                router.push({
                  pathname: "/classes/[classId]",
                  query: { classId: _id, bc: backgroundColor },
                })
              }
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Subject />
                <p style={{ marginLeft: "10px" }}>Stream</p>
              </div>
            </li>
            <li
              onClick={() =>
                router.push({
                  pathname: router.pathname + `/classwork`,
                  query: { classId: _id, bc: backgroundColor },
                })
              }
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Assignment />
                <p style={{ marginLeft: "10px" }}>Classwork</p>
              </div>
            </li>
            <li
              onClick={() =>
                router.push({
                  pathname: router.pathname + `/people`,
                  query: { classId: _id, bc: backgroundColor },
                })
              }
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Classmates />
                <p style={{ marginLeft: "10px" }}>People</p>
              </div>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default NavDropdown;
