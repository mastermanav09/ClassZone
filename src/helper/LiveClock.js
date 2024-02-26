import React, { useEffect, useState } from "react";

const LiveClockUpdate = () => {
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    setInterval(() => {
      setClock(new Date());
    }, 1000);
  }, []);

  return <>{clock.toLocaleTimeString()}</>;
};

export default LiveClockUpdate;
