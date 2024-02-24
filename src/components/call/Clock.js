import React from "react";
import Clock from "react-live-clock";

const ClockComponent = () => {
  return <Clock format={"lll"} ticking={true} timezone={"Asia/Kolkata"} />;
};

export default ClockComponent;
