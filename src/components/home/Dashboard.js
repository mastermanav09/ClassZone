import React from "react";
import classes from "./Dashboard.module.scss";
import ClassCard from "../class/ClassCard";

const Dashboard = ({ userEnrolledClasses, userTeachingClasses }) => {
  return (
    <>
      <div className={classes["dashboard__classContainer"]}>
        <h2>Enrolled Classes</h2>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {userEnrolledClasses?.map((enrolledClass) => (
            <ClassCard key={enrolledClass._id} classDetails={enrolledClass} />
          ))}
        </div>
      </div>

      <div className={classes["dashboard__classContainer"]}>
        <h2>Teaching Classes</h2>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {userTeachingClasses?.map((TeachingClass) => (
            <ClassCard key={TeachingClass._id} classDetails={TeachingClass} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
