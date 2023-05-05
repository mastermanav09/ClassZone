import React, { useState } from "react";
import classes from "./MainNavigation.module.scss";
import Sidebar from "./Sidebar";
import Plus from "@/components/svg/Plus";
import Hamburger from "@/components/svg/Hamburger";
import { useDispatch } from "react-redux";
import { createClass } from "../../../utils/store/reducers/class";
import AddClassForm from "../class/AddClassForm";
import JoinClassForm from "../class/JoinClassForm";

const MainNavigation = () => {
  const [showSideBar, setShowSideBar] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showJoinClassModal, setShowJoinClassModal] = useState(false);
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    setShowSideBar((prev) => !prev);
  };

  const handleAddClassClick = () => {
    setShowAddClassModal(true);
    setShowDropdown(false);
  };

  const handleJoinClassClick = () => {
    setShowJoinClassModal(true);
    setShowDropdown(false);
  };

  const dropdown = () => {
    setShowDropdown((prev) => !prev);
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
            <div className={classes.logo}>Logo</div>
          </div>
          <div className={classes["container_two"]}>
            <div className={classes.addBtn}>
              <Plus onClick={dropdown} />
              {showDropdown === true ? (
                <div className={classes.dropdown}>
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

export default MainNavigation;
