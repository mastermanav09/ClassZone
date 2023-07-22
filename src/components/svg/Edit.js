import React from "react";
import { Tooltip } from "react-tooltip";

const Edit = (props) => {
  const { tooltipContent, tooltipId } = props;

  return (
    <>
      <Tooltip
        delayShow={600}
        content={tooltipContent}
        anchorSelect={`#${tooltipId}`}
        place="bottom"
        closeOnScroll={true}
        closeOnResize={true}
      />
      <a
        id={tooltipId}
        style={{
          display: "block",
        }}
      >
        <svg viewBox="0 0 24 24" id="Edit">
          <path
            d="M5,18H9.24a1,1,0,0,0,.71-.29l6.92-6.93h0L19.71,8a1,1,0,0,0,0-1.42L15.47,2.29a1,1,0,0,0-1.42,0L11.23,5.12h0L4.29,12.05a1,1,0,0,0-.29.71V17A1,1,0,0,0,5,18ZM14.76,4.41l2.83,2.83L16.17,8.66,13.34,5.83ZM6,13.17l5.93-5.93,2.83,2.83L8.83,16H6ZM21,20H3a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Z"
            fill="#34a853"
            className="color000000 svgShape"
          ></path>
        </svg>
      </a>
    </>
  );
};

export default Edit;
