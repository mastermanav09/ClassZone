import React, { useState } from "react";
import classes from "./MainNavigation.module.scss";
import Sidebar from "./Sidebar";
import Plus from "@/components/svg/Plus";
import Hamburger from "@/components/svg/Hamburger";
import { useDispatch } from "react-redux";
import { createClass } from "../../../utils/store/reducers/class";
import AddClassForm from "./AddClassForm";
import JoinClassForm from "./JoinClassForm";

const MainNavigation = () => {
  const [showSideBar, setShowSideBar] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showJoinClassModal, setShowJoinClassModal] = useState(false);
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    setShowSideBar((prev) => !prev);
  };

  //   const addClassHandler = () => {
  //     dispatch(
  //       createClass({
  //         classData: {
  //           className: "dadadada",
  //           subject: "dakdjald",
  //           batch: "daldkjalk",
  //         },
  //       })
  //     );
  //   };

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

  const addClassModal = () => {
    setShowAddClassModal(false);
  };

  const joinClassModal = () => {
    setShowJoinClassModal(false);
  };

  return (
    <>
      {showSideBar && (
        <Sidebar toggleSidebar={toggleSidebar} showSideBar={showSideBar} />
      )}
      {showAddClassModal && (
        <AddClassForm
          addClassModal={addClassModal}
          showAddClassModal={showAddClassModal}
        />
      )}
      {showJoinClassModal && (
        <JoinClassForm
          joinClassModal={joinClassModal}
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
            <div className={classes.addBtn} onClick={addClassHandler}>
              <Plus />
            </div>
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
