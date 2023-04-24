import React from "react";
import classes from "./Dashboard.module.scss";
import Card from "./Card";
import MainNavigation from "./MainNavigation";
const Dashboard = () => {
  return (
    <>
      <div className={classes.dashboard}>
        <div className={classes["dashboard__classContainer"]}>
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
