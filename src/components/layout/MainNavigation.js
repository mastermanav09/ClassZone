import React, { useState } from "react";
import classes from "./MainNavigation.module.scss";
import Sidebar from "./Sidebar";
import Plus from "@/components/svg/Plus";
import Hamburger from "@/components/svg/Hamburger";
import { useDispatch, useSelector } from "react-redux";
import AddClassForm from "../class/AddClassForm";
import JoinClassForm from "../class/JoinClassForm";
import { uiActions } from "../../../utils/store/reducers/ui";

const MainNavigation = () => {
  const [showSideBar, setShowSideBar] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showJoinClassModal, setShowJoinClassModal] = useState(false);
  const dispatch = useDispatch();
  const { navbarClassDropDown } = useSelector((state) => state.ui);

  const toggleSidebar = () => {
    setShowSideBar((prev) => !prev);
  };

  const toggleDropdown = () => {
    dispatch(uiActions.toggleNavbarClassDropdown());
  };

  const handleAddClassClick = () => {
    setShowAddClassModal(true);
    toggleDropdown();
  };

  const handleJoinClassClick = () => {
    setShowJoinClassModal(true);
    toggleDropdown();
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
          <div className={classes["container_two"]} onClick={toggleDropdown}>
            <div className={classes.addBtn}>
              <Plus />
              {navbarClassDropDown ? (
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

export default MainNavigation;
