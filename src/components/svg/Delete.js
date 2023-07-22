import React from "react";
import { Tooltip } from "react-tooltip";

const Delete = (props) => {
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
        <svg fill="none" viewBox="0 0 24 24" id="Delete">
          <path
            fill="#db2323"
            d="M15 3a1 1 0 0 1 1 1h2a1 1 0 1 1 0 2H6a1 1 0 0 1 0-2h2a1 1 0 0 1 1-1h6Z"
            className="color000000 svgShape"
          ></path>
          <path
            style={{ fillRule: "evenodd", clipRule: "evenodd" }}
            fill="#db2323"
            d="M6 7h12v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7Zm3.5 2a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 1 0v-9a.5.5 0 0 0-.5-.5Zm5 0a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 1 0v-9a.5.5 0 0 0-.5-.5Z"
            className="color000000 svgShape"
          ></path>
        </svg>
      </a>
    </>
  );
};

export default Delete;
