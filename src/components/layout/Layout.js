import React from "react";
import MainNavigation from "./MainNavigation";
const Layout = (props) => {
  return (
    <>
      <main>{props.children}</main>
    </>
  );
};

export default Layout;
