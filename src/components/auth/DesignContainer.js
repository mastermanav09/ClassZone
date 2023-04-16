import React, { useState } from "react";
import classes from "./DesignContainer.module.scss";
import Image from "next/image";
import LeftArrow from "../svg/LeftArrow";
import RightArrow from "../svg/RightArrow";

const textContent = [
  {
    heading: "Welcome to the future of online learning.",
    text: "Our LMS is the fastest, simplest, and most effective way to teach and learn.",
  },

  {
    heading: "Ready to revolutionize your education?",
    text: "Our LMS is the ultimate tool for students, teachers, and anyone who wants to improve their skills.",
  },

  {
    heading: "Looking for an LMS that's fast, user-friendly, and effective?",
    text: "Look no further than our one-line solution. Our LMS is the ultimate tool for modern learning.",
  },

  {
    heading: "Tired of complicated, bloated learning management systems?",
    text: "Our LMS is the streamlined solution you've been looking for.",
  },
];

const DesignContainer = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const slideLeft = () => {
    setSelectedIndex(
      (prev) => (prev - 1 + textContent.length) % textContent.length
    );
  };
  const slideRight = () => {
    setSelectedIndex((prev) => (prev + 1) % textContent.length);
  };

  return (
    <div className={classes.container}>
      <div className={classes["background_shadow"]} />

      <div className={classes.box}>
        <div className={classes.emoticons}>
          <div>
            <Image
              width={100}
              height={100}
              layout="responsive"
              src="/open_book.png"
              alt="pen book"
            />
          </div>
          <div>
            <Image
              width={130}
              height={130}
              layout="responsive"
              src="/grinning_face.png"
              alt="grinning face"
            />
          </div>
          <div>
            <Image
              width={100}
              height={100}
              layout="responsive"
              src="/writing_hand.png"
              alt="writing hand"
            />
          </div>
        </div>

        <div className={classes["slider"]}>
          <div className={classes["content"]}>
            <h2 className={classes["content_heading"]}>
              {textContent[selectedIndex].heading}
            </h2>
            <p className={classes["content_text"]}>
              {textContent[selectedIndex].text}
            </p>
          </div>

          <div className={classes["action_btns"]}>
            <button onClick={slideLeft}>
              <LeftArrow className={classes.arrow} />
            </button>
            <button onClick={slideRight}>
              <RightArrow className={classes.arrow} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignContainer;