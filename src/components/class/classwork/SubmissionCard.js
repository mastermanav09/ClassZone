import React, { useState } from "react";
import classes from "./SubmissionCard.module.scss";
import { FileIcon, defaultStyles } from "react-file-icon";
import PrivateComment from "@/components/svg/PrivateComment";
import Image from "next/image";
import { getFileExtension } from "@/helper/fileExtensionHelper";
import moment from "moment";

const SubmissionCard = (props) => {
  const [commentHover, setCommentHover] = useState(false);
  const { submission } = props;
  const { user } = submission || {};

  const submittedFileExtension = getFileExtension(
    submission?.submittedFilePath
  );

  const submissionDate = submission?.submittedOn
    ? moment(submission?.submittedOn).format("ll")
    : null;

  let name = user?.credentials?.name;
  if (name?.length > 50) {
    name = name.substring(0, 50) + "...";
  }

  const handleCommentHover = () => {
    setCommentHover(!commentHover);
  };

  const downloadFileHandler = () => {
    window.open(submission?.submittedFilePath, "_blank");
  };

  return (
    <div className={classes.box}>
      <div
        className={[
          classes["hover-box"],
          commentHover ? classes["hover-box--hovered"] : "",
        ].join(" ")}
      >
        <div className={classes.comment}>{submission?.comment}</div>
      </div>
      <div className={classes.top}>
        {submission?.comment && (
          <span id={classes.star} onClick={handleCommentHover}>
            <PrivateComment
              tooltipContent="Private comment"
              tooltipId="private-comment"
            />
          </span>
        )}

        <div className={classes.profile}>
          <Image
            width={80}
            height={80}
            src={user?.credentials.userImage}
            alt="pen book"
          />
        </div>
        <h1 className={classes.name}>{name}</h1>
      </div>
      <div className={classes.bottom}>
        <div className={classes["file-icon"]}>
          {submission?.submittedFilePath && (
            <div
              className={classes["download-file"]}
              onClick={downloadFileHandler}
            >
              <FileIcon
                extension={submittedFileExtension}
                {...defaultStyles[submittedFileExtension]}
              />
            </div>
          )}
        </div>
        {submission?.submittedOn && (
          <div className={classes["submittedOn-date"]}>
            Submitted On <b>{submissionDate}</b>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionCard;
