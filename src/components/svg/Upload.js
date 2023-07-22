import React from "react";
import { Tooltip } from "react-tooltip";

const Upload = (props) => {
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="upload">
          <path
            fill="#6563ff"
            d="m15.707 5.293-3-3a1 1 0 0 0-1.414 0l-3 3a1 1 0 0 0 1.414 1.414L11 5.414V17a1 1 0 0 0 2 0V5.414l1.293 1.293a1 1 0 0 0 1.414-1.414Z"
          ></path>
          <path
            fill="#b2b1ff"
            d="M18 9h-5v8a1 1 0 0 1-2 0V9H6a3.003 3.003 0 0 0-3 3v7a3.003 3.003 0 0 0 3 3h12a3.003 3.003 0 0 0 3-3v-7a3.003 3.003 0 0 0-3-3Z"
          ></path>
        </svg>
      </a>
    </>
  );
};

export default Upload;
