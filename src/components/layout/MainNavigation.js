import React, { useState } from "react";
import classes from "./MainNavigation.module.scss";
import Sidebar from "./Sidebar";
import Plus from "@/components/svg/Plus";
import Hamburger from "@/components/svg/Hamburger";
import AddClassForm from "../class/AddClassForm";
import JoinClassForm from "../class/JoinClassForm";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  closeUIComponents,
  registerForUIToggle,
} from "@/helper/closeOpenUIComponents";

const MainNavigation = () => {
  const [showSideBar, setShowSideBar] = useState(false);
  const [showNavbarDropdown, setShowNavbarDropdown] = useState(false);
  const router = useRouter();
  const { pathname, query } = router;
  const { addClass, joinClass, id: classId } = query;
  const { data: session } = useSession();

  registerForUIToggle(setShowSideBar);
  registerForUIToggle(setShowNavbarDropdown);

  const toggleSidebar = () => {
    setShowSideBar((prev) => !prev);
  };

  const handleAddClassClick = () => {
    setShowNavbarDropdown(false);
  };

  const handleJoinClassClick = () => {
    setShowNavbarDropdown(false);
  };

  return (
    <>
      {showSideBar && (
        <Sidebar toggleSidebar={toggleSidebar} showSideBar={showSideBar} />
      )}
      {addClass === "true" && session?.user && (
        <AddClassForm
          toggleAddClassModal={() => router.replace("/")}
          showAddClassModal={addClass}
          pathname={pathname}
        />
      )}
      {joinClass === "true" && session?.user && (
        <JoinClassForm
          toggleJoinClassModal={() => router.replace("/")}
          showJoinClassModal={joinClass}
          pathname={pathname}
          classId={classId}
        />
      )}
      <div className={classes.wrapper}>
        <div className={classes.navbar}>
          <div className={classes["container_one"]}>
            <div className={classes.sidebarBtn} onClick={toggleSidebar}>
              <Hamburger />
            </div>
            <div className={classes.logo}>
              <Link href="/">
                <Image src="/logo.png" width={40} height={40} alt="logo" />
              </Link>
              <div className={classes["logo_text"]}>
                <Image
                  src="/logo_text.png"
                  width={115}
                  height={35}
                  alt="logo"
                />
              </div>
            </div>
          </div>

          {pathname === "/" && (
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
                      <Link href={`/?joinClass=true`}>
                        <li onClick={handleJoinClassClick}>Join class</li>
                      </Link>
                      <Link href={`/?addClass=true`}>
                        <li onClick={handleAddClassClick}>Create class</li>
                      </Link>
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(MainNavigation);
