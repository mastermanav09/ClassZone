import React, { useState } from "react";
import classes from "./MainNavigation.module.scss";
import Sidebar from "./Sidebar";
import Plus from "@/components/svg/Plus";
import Hamburger from "@/components/svg/Hamburger";
import AddClassForm from "../class/AddClassForm";
import JoinClassForm from "../class/JoinClassForm";
import Image from "next/image";
import Link from "next/link";
import {
  closeUIComponents,
  registerForUIToggle,
} from "@/helper/closeOpenUIComponents";

const MainNavigation = () => {
  const [showSideBar, setShowSideBar] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showJoinClassModal, setShowJoinClassModal] = useState(false);
  const [showNavbarDropdown, setShowNavbarDropdown] = useState(false);
  registerForUIToggle(setShowSideBar);
  registerForUIToggle(setShowNavbarDropdown);

  const toggleSidebar = () => {
    setShowSideBar((prev) => !prev);
  };

  const handleAddClassClick = () => {
    setShowAddClassModal(true);
    setShowNavbarDropdown(false);
  };

  const handleJoinClassClick = () => {
    setShowJoinClassModal(true);
    setShowNavbarDropdown(false);
  };

  const toggleAddClassModal = () => {
    setShowAddClassModal(false);
  };

  const toggleJoinClassModal = () => {
    setShowJoinClassModal(false);
  };

  return (
    <>
      {showSideBar && (
        <Sidebar toggleSidebar={toggleSidebar} showSideBar={showSideBar} />
      )}
      {showAddClassModal && (
        <AddClassForm
          toggleAddClassModal={toggleAddClassModal}
          showAddClassModal={showAddClassModal}
        />
      )}
      {showJoinClassModal && (
        <JoinClassForm
          toggleJoinClassModal={toggleJoinClassModal}
          showJoinClassModal={showJoinClassModal}
        />
      )}
      <div className={classes.wrapper}>
        <div className={classes.navbar}>
          <div className={classes["container_one"]}>
            <div className={classes.sidebarBtn}>
              <Hamburger onClick={toggleSidebar} />
            </div>
            <div className={classes.logo}>
              <Link href="/">
                <Image src="/logo.png" width={40} height={40} alt="logo" />
              </Link>
              <Image src="/logo_text.png" width={115} height={35} alt="logo" />
            </div>
          </div>
          <div
            className={classes["container_two"]}
            onClick={() => {
              closeUIComponents();
              setShowNavbarDropdown(true);
            }}
          >
            <div className={classes.addBtn}>
              <Plus />
              {showNavbarDropdown ? (
                <div
                  className={classes.dropdown}
                  onClick={(event) => event.stopPropagation()}
                >
                  <ul>
                    <li onClick={handleJoinClassClick}>Join class</li>
                    <li onClick={handleAddClassClick}>Create class</li>
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(MainNavigation);
