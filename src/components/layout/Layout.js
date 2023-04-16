import React from "react";
import MainNavigation from "./MainNavigation";

const Layout = (props) => {
  return (
    <>
      <MainNavigation />
      <main style={{ marginTop: "65px" }}>{props.children}</main>
    </>
  );
};

export default Layout;
