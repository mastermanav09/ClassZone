import React, { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import classes from "./Editor.module.scss";
import LoadingSpinner from "../progress/LoadingSpinner";
import no_img from "../../../public/images/profileImages/no-img.png";

const Editor = dynamic(() => import("./Editor"), {
  ssr: false,
  loading: () => <LoadingSpinner className={classes.spinner_one} />,
});

const EditorWrapper = ({
  manageAnnouncementHandler,
  classId,
  isLoading,
  isEditAnnouncement,
  teacher,
  textEditor,
  setTextEditor,
  content,
  setContent,
}) => {
  const announcementHandler = () => {
    manageAnnouncementHandler(classId, content);
  };

  const cancelButton = () => {
    setContent("");
    setTextEditor(false);
  };

  const getValue = (value) => {
    setContent(value);
  };

  return (
    <>
      {!textEditor && (
        <div className={classes["class__announce"]}>
          {teacher ? (
            <Image
              width={60}
              height={60}
              src={teacher?.credentials.userImage}
              alt="User image"
            />
          ) : (
            <Image width={60} height={60} src={no_img} alt="User image" />
          )}
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
          <div className={classes["actions"]}>
            <button onClick={announcementHandler} disabled={isLoading}>
              {isLoading ? (
                <LoadingSpinner className={classes.spinner_two} />
              ) : (
                <>{isEditAnnouncement ? "Update" : "Post"}</>
              )}
            </button>
            <button onClick={cancelButton}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(EditorWrapper);
