import React from "react";
import classesDashboard from "./Dashboard.module.scss";
import classesClassCard from "../class/ClassCard.module.scss";
import ClassCard from "../class/ClassCard";
import LoadingSpinner from "../progress/LoadingSpinner";
import { DndProvider } from "react-dnd-multi-backend";
import { useDispatch } from "react-redux";
import { dragAndDropClasses } from "../../../utils/store/reducers/class";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { usePreview } from "react-dnd-preview";
import Image from "next/image";

const MyPreview = () => {
  const preview = usePreview();
  if (!preview.display) {
    return null;
  }
  const { item, style } = preview;
  const { teacher, backgroundColor, name } = item;

  return (
    <>
      <div
        className={classesClassCard.classCard}
        style={{ ...style, zIndex: 100 }}
      >
        <div
          className={classesClassCard["classCard__upper"]}
          style={{ backgroundColor: backgroundColor }}
        >
          <div className={classesClassCard["classCard_desc"]}>
            <div className={classesClassCard["classCard__className"]}>
              {name}
            </div>
            {teacher?.credentials.name && (
              <div className={classesClassCard["classCard__creatorName"]}>
                {teacher?.credentials.name}
              </div>
            )}
          </div>
          {teacher?.credentials.userImage && (
            <Image
              width={60}
              height={60}
              src={teacher?.credentials.userImage}
              alt="user_img"
              className={classesClassCard["classCard__creatorPhoto"]}
            />
          )}
        </div>
        <div className={classesClassCard["classCard__middle"]}></div>
        <div className={classesClassCard["classCard__lower"]}></div>
      </div>
    </>
  );
};

const Dashboard = ({ userEnrolledClasses, userTeachingClasses }) => {
  const dispatch = useDispatch();

  const moveClassCardEnrolled = (fromIndex, toIndex, classId) => {
    dispatch(
      dragAndDropClasses({
        fromIndex,
        toIndex,
        type: "CLASS_CARD_ENROLLED",
        classId,
      })
    );
  };

  const moveClassCardTeaching = (fromIndex, toIndex, classId) => {
    dispatch(
      dragAndDropClasses({
        fromIndex,
        toIndex,
        type: "CLASS_CARD_TEACHING",
        classId,
      })
    );
  };

  return (
    <>
      <div className={classesDashboard.dashboard}>
        <div className={classesDashboard.enrolledContainer}>
          <div className={classesDashboard.title}>
            <h3>Enrolled</h3>
          </div>
          <hr />

          <div>
            <DndProvider options={HTML5toTouch}>
              <MyPreview />
              <div className={classesDashboard["dashboard__classContainer"]}>
                {!userEnrolledClasses ? (
                  <LoadingSpinner className={classesDashboard.spinner} />
                ) : (
                  <>
                    {userEnrolledClasses.map((enrolledClass, index) => (
                      <ClassCard
                        type="CLASS_CARD_ENROLLED"
                        key={enrolledClass.classDetails._id}
                        index={index}
                        classDetails={enrolledClass.classDetails}
                        moveClassCard={moveClassCardEnrolled}
                      />
                    ))}
                  </>
                )}
              </div>
            </DndProvider>
          </div>
        </div>

        <div className={classesDashboard.teachingContainer}>
          <div className={classesDashboard.title}>
            <h3>Teaching</h3>
          </div>
          <hr />

          <div>
            <DndProvider options={HTML5toTouch}>
              <MyPreview />
              <div className={classesDashboard["dashboard__classContainer"]}>
                {!userTeachingClasses ? (
                  <LoadingSpinner className={classesDashboard.spinner} />
                ) : (
                  <>
                    {userTeachingClasses.map((teachingClass, index) => (
                      <ClassCard
                        type="CLASS_CARD_TEACHING"
                        index={index}
                        key={teachingClass.classDetails._id}
                        classDetails={teachingClass.classDetails}
                        moveClassCard={moveClassCardTeaching}
                      />
                    ))}
                  </>
                )}
              </div>
            </DndProvider>
          </div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
