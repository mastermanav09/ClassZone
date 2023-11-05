import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import classes from "./ThreeDots.module.scss";
import {
  closeUIComponents,
  registerForUIToggle,
} from "@/helper/closeOpenUIComponents";

const ThreeDots = ({ fields, data }) => {
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [dropdownCurrPos, setDropdownCurrPos] = useState("bottom-right");
  const dropdownRef = useRef(null);
  registerForUIToggle(setToggleDropdown);

  const hasWindow = typeof window !== "undefined";
  const getWindowDimensions = useCallback(() => {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    return {
      width,
      height,
    };
  }, [hasWindow]);

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  let rightBorder =
    dropdownRef?.current?.offsetParent?.offsetLeft +
    dropdownRef?.current?.clientWidth;

  let bottomBorder =
    dropdownRef?.current?.offsetTop + dropdownRef?.current?.offsetHeight;

  useEffect(() => {
    if (hasWindow) {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [getWindowDimensions, hasWindow]);

  useLayoutEffect(() => {
    rightBorder =
      dropdownRef?.current?.offsetParent?.offsetLeft +
      dropdownRef?.current?.clientWidth;

    bottomBorder =
      dropdownRef?.current?.offsetTop + dropdownRef?.current?.offsetHeight;

    let pos = dropdownRef?.current?.getBoundingClientRect();

    if (windowDimensions.height - pos?.bottom < 10) {
      setDropdownCurrPos("top-left");
    } else if (windowDimensions.width - rightBorder < 10) {
      setDropdownCurrPos("bottom-left");
    } else {
      setDropdownCurrPos("bottom-right");
    }
  }, [toggleDropdown, windowDimensions.width, windowDimensions.height]);

  const dropdownHandler = (event) => {
    if (!toggleDropdown) {
      closeUIComponents();
    }

    event.stopPropagation();

    if (
      dropdownRef?.current?.offsetParent?.offsetTop +
        dropdownRef?.current?.clientHeight >
      windowDimensions.height
    ) {
      setDropdownCurrPos("top-left");
    } else if (windowDimensions.width - rightBorder < 10) {
      setDropdownCurrPos("bottom-left");
    } else {
      setDropdownCurrPos("bottom-right");
    }
    setToggleDropdown((prev) => !prev);
  };

  return (
    <>
      <div className={classes.dropdown}>
        <svg
          viewBox="0 0 24 24"
          className={[
            classes["three_dots"],
            toggleDropdown ? classes["three_dots_open"] : "",
          ].join(" ")}
          onClick={dropdownHandler}
        >
          <path
            style={{ strokeLinecap: "round", strokeLinejoin: "round" }}
            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
          />
        </svg>
        {toggleDropdown && (
          <div
            className={[
              classes["dropdown-content"],
              classes[dropdownCurrPos],
            ].join(" ")}
            ref={dropdownRef}
          >
            {Array.isArray(fields) &&
              fields?.map((field, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (
                      data &&
                      data.constructor.name === "Object" &&
                      field.param
                    ) {
                      return field.action(data[field.param]);
                    }

                    return field.action();
                  }}
                >
                  {field.text}
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export default React.memo(ThreeDots);
