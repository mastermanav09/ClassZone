import React from "react";
import classes from "./Dashboard.module.scss";
import Card from "../class/Card";

const Dashboard = () => {
  return (
    <div className={classes["dashboard__classContainer"]}>
      <Card classId={1} />
      <Card classId={2} />
    </div>
  );
};

export default Dashboard;
