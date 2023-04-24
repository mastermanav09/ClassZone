import React from "react";

const LeftArrow = (props) => {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 22 22"
      style={{ strokeWidth: "1.5" }}
      stroke="currentColor"
    >
      <path
        style={{ strokeLinecap: "round", strokeLinejoin: "round" }}
        d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
      />
    </svg>
  );
};

export default LeftArrow;
