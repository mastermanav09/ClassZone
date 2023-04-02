import React from "react";
import MainNavigation from "./MainNavigation";

const Layout = (props) => {
  return (
    <>
      <MainNavigation />
      <main>{props.children}</main>
    </>
  );
};

export default Layout;
