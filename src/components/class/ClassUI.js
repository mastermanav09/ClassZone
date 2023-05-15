import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import classes from "./ClassUI.module.scss";
import Image from "next/image";
import { createNewAnnouncement } from "../../../utils/store/reducers/class";
import { useDispatch } from "react-redux";

const ClassUI = ({ classId }) => {
  const [textEditor, setTextEditor] = useState(false);
  const [content, setContent] = useState("");
  const dispatch = useDispatch();

  const Editor = dynamic(() => import("./Editor"), { ssr: false });
  const getValue = (value) => {
    setContent(value);
  };
  const cancelButton = () => {
    setContent("");
    setTextEditor(false);
  };

  const createAnnouncement = () => {
    dispatch(
      createNewAnnouncement({ classId: "645ecdcc0cf138cc8100c3be", content })
    );
  };

  return (
    <div className={classes.class}>
      <div className={classes["class__nameBox"]}>
        <div className={classes["class__name"]}>NAME</div>
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
              src="/static/profileImages/user.jpg"
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
