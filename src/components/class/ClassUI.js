import React, { useEffect, useState } from "react";
import classes from "./ClassUI.module.scss";
import {
  classActions,
  createNewAnnouncement,
} from "../../../utils/store/reducers/class";
import { useDispatch, useSelector } from "react-redux";
import EditorWrapper from "./EditorWrapper";
import Announcement from "./Announcement";
import ScrollToTop from "../svg/ScrollToTop";
import { toast } from "react-toastify";
import ThreeDots from "../svg/ThreeDots";

const ClassUI = ({ classDetails }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { _id, name, backgroundColor, teacher, batch } = classDetails;
  const { announcements = [] } = useSelector(
    (state) => state.class.currentClassDetails
  );

  const createAnnouncement = (id, content) => {
    const plainString = content.replace(/<[^>]+>/g, "");
    const updatedStr = plainString.split("&nbsp;").join("");

    if (updatedStr.trim().length === 0) {
      toast.info("Announcement should contain valid text!");
      toast.clearWaitingQueue();
      return false;
    }

    dispatch(createNewAnnouncement({ classId: id, content, setIsLoading }));
    return true;
  };

  useEffect(() => {
    dispatch(classActions.setCurrentClass(classDetails));
  }, [classDetails, dispatch]);

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
        <div className={classes["copy_code_container"]}>
          <div>
            <h3>Class Code</h3>
            <ThreeDots />
          </div>
          <p className={classes["class_code"]}>{_id}</p>
        </div>
        <div className={classes.announcementContainer}>
          <EditorWrapper
            id={_id}
            createAnnouncement={createAnnouncement}
            teacher={teacher}
            isLoading={isLoading}
            backgroundColor={backgroundColor}
          />
          {Array.isArray(announcements) && announcements.length !== 0 ? (
            announcements.map((announcement) => (
              <Announcement
                key={announcement._id}
                teacher={teacher}
                announcement={announcement}
              />
            ))
          ) : (
            <h3 className={classes["no_announcement_found_text"]}>
              No Announcements found!
            </h3>
          )}
        </div>
      </div>
      <ScrollToTop backgroundColor={backgroundColor} />
    </div>
  );
};

export default React.memo(ClassUI);
