import React, { useState } from "react";
import classes from "./ClassUI.module.scss";
import {
  getClass,
  manageAnnouncement,
  getStudentRemainingAssignmentsStatus,
} from "../../../utils/store/reducers/class";
import { useDispatch, useSelector } from "react-redux";
import EditorWrapper from "./EditorWrapper";
import Announcement from "./Announcement";
import ScrollToTop from "../svg/ScrollToTop";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import ThreeDots from "../svg/ThreeDots";
import PageLoader from "../progress/PageLoader";
import { validateAnnouncement } from "../../../utils/validators/validateAnnouncement";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { notifyAndUpdate } from "@/helper/toastNotifyAndUpdate";
import { INFO } from "../../../utils/constants";
import ClassNavDropdown from "./ClassNavDropdown";
import { useEffect } from "react";
import Alert from "../svg/Alert";
import SkeletonScream from "../ui/skeletons/SkeletonScream";

const ClassUI = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [textEditor, setTextEditor] = useState(false);
  const [content, setContent] = useState("");
  const [isEditAnnouncement, setIsEditAnnouncement] = useState(null);
  const [studentRemainingAssignmentCount, setStudentRemainingAssignmentCount] =
    useState(null);
  const [
    studentRemainingAssignmentCountLoader,
    setStudentRemainingAssignmentCountLoader,
  ] = useState(false);

  const { data: session } = useSession();
  const { user } = session || {};

  const router = useRouter();
  const { classId } = router.query;

  const announcements = useSelector(
    (state) => state.class.currentClassDetails.announcements || []
  );
  const pinnedAnnouncements = useSelector(
    (state) => state.class.currentClassDetails.pinnedAnnouncements || []
  );
  const _id = useSelector((state) => state.class.currentClassDetails._id);
  const name = useSelector((state) => state.class.currentClassDetails.name);
  const backgroundColor = useSelector(
    (state) => state.class.currentClassDetails.backgroundColor
  );
  const teacher = useSelector(
    (state) => state.class.currentClassDetails.teacher
  );
  const batch = useSelector((state) => state.class.currentClassDetails.batch);

  useEffect(() => {
    dispatch(
      getStudentRemainingAssignmentsStatus({
        router,
        classId,
        setStudentRemainingAssignmentCount,
        setStudentRemainingAssignmentCountLoader,
      })
    );
  }, [classId, dispatch, router]);

  useEffect(() => {
    if (classId) {
      dispatch(getClass({ router, classId }));
    }
  }, [_id, classId, dispatch, router]);

  const manageAnnouncementHandler = (classId, content) => {
    if (!validateAnnouncement(content)) {
      notifyAndUpdate(
        INFO + "1",
        "info",
        "Announcement should contain valid text!",
        toast,
        null
      );
      return;
    }

    dispatch(
      manageAnnouncement({
        classId,
        content,
        setIsLoading,
        setTextEditor,
        announcementId: isEditAnnouncement?.id,
        isPinned: isEditAnnouncement?.isPinned,
      })
    );

    setContent("");
    setIsEditAnnouncement(null);
  };

  const editAnnouncementHandler = (text, announcementId, isPinned) => {
    setTextEditor(true);
    setIsEditAnnouncement({ id: announcementId, isPinned });
    setContent(text);

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  };

  const generateClassInviteLink = () => {
    const joinLink =
      process.env.NEXT_PUBLIC_NEXTAUTH_URL +
      `/login?redirect=/&jc=true&id=${_id}`;
    navigator.clipboard.writeText(joinLink);
    notifyAndUpdate(
      INFO + "3",
      "info",
      "Class invite link copied",
      toast,
      null
    );
  };

  const copyCodeHandler = () => {
    navigator.clipboard.writeText(_id);
    notifyAndUpdate(INFO + "2", "info", "Class code copied", toast, null);
  };

  const classCodefields = [
    {
      text: "Copy class code",
      action: copyCodeHandler,
    },

    {
      text: "Copy class invite link",
      action: generateClassInviteLink,
    },
  ];

  if (_id !== classId) {
    return <PageLoader />;
  }

  return (
    <>
      <ClassNavDropdown classId={classId} backgroundColor={backgroundColor} />
      <div className={classes.class}>
        <div
          className={classes["class__nameBox"]}
          style={{ backgroundColor: backgroundColor }}
        >
          <div className={classes["class__name"]}>{name}</div>
          <div className={classes["class__batch"]}>{batch}</div>
        </div>
        <div className={classes.container}>
          {user?._id === teacher?._id ? (
            <div className={classes["copy_code_container"]}>
              <div>
                <h3>Class Code</h3>
                <ThreeDots fields={classCodefields} />
              </div>
              <p className={classes["class_code"]}>{_id}</p>
            </div>
          ) : (
            <>
              <div className={classes["classes__upcoming"]}>
                <h4>Upcoming</h4>

                {studentRemainingAssignmentCountLoader ? (
                  <SkeletonScream />
                ) : (
                  <>
                    {studentRemainingAssignmentCount === 0 ? (
                      <p className={classes["completed"]}>
                        Woohoo, no work due soon!
                      </p>
                    ) : (
                      <>
                        <p className={classes["remaining"]}>
                          <span>{studentRemainingAssignmentCount}</span>
                          Assignments remaining
                          <div className={classes["assignments_alert"]}>
                            <Alert />
                          </div>
                        </p>
                        <div className={classes.viewAllContainer}>
                          <Link
                            href={{
                              pathname: `/classes/${classId}/classwork`,
                              query: { bc: backgroundColor },
                            }}
                            style={{ color: backgroundColor }}
                            className={classes.viewAll}
                          >
                            View all
                          </Link>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          <div className={classes.announcementContainer}>
            {user?._id === teacher?._id && (
              <EditorWrapper
                classId={_id}
                textEditor={textEditor}
                setTextEditor={setTextEditor}
                isEditAnnouncement={isEditAnnouncement}
                content={content}
                setContent={setContent}
                manageAnnouncementHandler={manageAnnouncementHandler}
                teacher={teacher}
                isLoading={isLoading}
                backgroundColor={backgroundColor}
              />
            )}

            {pinnedAnnouncements?.length !== 0 && (
              <>
                {pinnedAnnouncements.map((announcement) => (
                  <Announcement
                    classId={_id}
                    key={announcement._id}
                    teacher={teacher}
                    user={user}
                    announcement={announcement}
                    backgroundColor={backgroundColor}
                    editAnnouncementHandler={editAnnouncementHandler}
                  />
                ))}
              </>
            )}
            {announcements?.length !== 0 &&
              announcements.map((announcement) => (
                <Announcement
                  classId={_id}
                  user={user}
                  key={announcement._id}
                  teacher={teacher}
                  announcement={announcement}
                  editAnnouncementHandler={editAnnouncementHandler}
                />
              ))}
            {pinnedAnnouncements?.length === 0 &&
              announcements?.length === 0 && (
                <h3 className={classes["no_announcement_found_text"]}>
                  No Announcements found!
                </h3>
              )}
          </div>
        </div>
        <ScrollToTop backgroundColor={backgroundColor} />
      </div>
    </>
  );
};

export default ClassUI;
