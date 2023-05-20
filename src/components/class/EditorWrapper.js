import React, { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import classes from "./Editor.module.scss";
import LoadingSpinner from "../progress/LoadingSpinner";

const Editor = dynamic(() => import("./Editor"), {
  ssr: false,
  loading: () => <LoadingSpinner className={classes.spinner_one} />,
});

const EditorWrapper = (props) => {
  const { teacher } = props;
  const [textEditor, setTextEditor] = useState(false);
  const [content, setContent] = useState("");

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
            <button
              onClick={() => {
                const isValid = props.createAnnouncement(props.id, content);
                if (isValid) {
                  setContent("");
                }
              }}
              disabled={props.isLoading}
            >
              {props.isLoading ? (
                <LoadingSpinner className={classes.spinner_two} />
              ) : (
                "Post"
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
