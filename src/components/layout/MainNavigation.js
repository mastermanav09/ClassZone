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
  const { ac, jc, id: classId } = query;
  const [joinClass, setJoinClass] = useState(jc === "true");
  const [addClass, setAddClass] = useState(ac === "true");
  const { data: session } = useSession();

  registerForUIToggle(setShowSideBar);
  registerForUIToggle(setShowNavbarDropdown);

  const toggleSidebar = (value) => {
    if (value) {
      setShowSideBar(value);
    } else {
      setShowSideBar((prev) => !prev);
    }
  };

  const handleAddClassClick = (value) => {
    setAddClass(value);
    setShowNavbarDropdown(false);

    if (ac && classId) {
      router.replace("/", undefined, { shallow: true });
    }
  };

  const handleJoinClassClick = (value) => {
    setJoinClass(value);
    setShowNavbarDropdown(false);

    if (jc && classId) {
      router.replace("/", undefined, { shallow: true });
    }
  };

  return (
    <>
      {showSideBar && (
        <Sidebar toggleSidebar={toggleSidebar} showSideBar={showSideBar} />
      )}

      {addClass && session?.user && (
        <AddClassForm
          toggleAddClassModal={() => handleAddClassClick(false)}
          showAddClassModal={addClass}
          pathname={pathname}
        />
      )}
      {joinClass && session?.user && (
        <JoinClassForm
          toggleJoinClassModal={() => handleJoinClassClick(false)}
          showJoinClassModal={joinClass}
          pathname={pathname}
          classId={classId}
        />
      )}
      <div className={classes.wrapper}>
        <div className={classes.navbar}>
          <div className={classes["container_one"]}>
            <div
              className={classes.sidebarBtn}
              onClick={(event) => {
                event.stopPropagation();
                toggleSidebar();
              }}
            >
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
                      <li onClick={() => handleJoinClassClick(true)}>
                        Join class
                      </li>

                      {/* <Link href={`/?jc=true`}></Link> */}

                      <li onClick={() => handleAddClassClick(true)}>
                        Create class
                      </li>

                      {/* <Link href={`/?ac=true`}></Link> */}
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
