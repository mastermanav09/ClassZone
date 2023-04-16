import React from "react";

const RightArrow = (props) => {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 22 22"
      stroke-width="1.5"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
      />
    </svg>
  );
};

export default RightArrow;
