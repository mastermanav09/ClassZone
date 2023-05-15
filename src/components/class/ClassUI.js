import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import classes from "./ClassUI.module.scss";
import Image from "next/image";
import { createNewAnnouncement } from "../../../utils/store/reducers/class";
import { useDispatch } from "react-redux";

const ClassUI = ({ classDetails }) => {
  const [textEditor, setTextEditor] = useState(false);
  const [content, setContent] = useState("");
  const dispatch = useDispatch();
  const { _id, name, backgroundColor, teacher, batch } = classDetails;

  console.log(classDetails);

  const Editor = dynamic(() => import("./Editor"), { ssr: false });
  const getValue = (value) => {
    setContent(value);
  };

  const cancelButton = () => {
    setContent("");
    setTextEditor(false);
  };

  const createAnnouncement = () => {
    dispatch(createNewAnnouncement({ classId: _id, content }));
  };

  return (
    <div className={classes.class}>
      <div
        className={classes["class__nameBox"]}
        style={{ backgroundColor: backgroundColor }}
      >
        <div className={classes["class__name"]}>{name}</div>
        <div className={classes["class__batch"]}>{batch}</div>
      </div>
      <div className={classes.container}>
        <div className={classes["classes__upcoming"]}>
          <h4>Upcoming</h4>
          <p>Woohoo, no work due soon!</p>
          <div className={classes.viewAllContainer}>
            <Link href="" className={classes.viewAll}>
              View all
            </Link>
          </div>
        </div>
        {!textEditor && (
          <div className={classes["class__announce"]}>
            <Image
              width={60}
              height={60}
              src={teacher.credentials.userImage}
              alt="User image"
            />
            <input
              type="text"
              placeholder="Announce something to your class"
              onClick={() => setTextEditor(true)}
            />
          </div>
        )}
        {textEditor && (
          <div className={classes.editor}>
            <Editor contents={content} getValue={getValue} />
            <div className={classes.container}>
              <button onClick={createAnnouncement}>Post</button>
              <button onClick={cancelButton}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassUI;
