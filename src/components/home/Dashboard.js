import React, { useRef } from "react";
import classes from "./Dashboard.module.scss";
import { Grid, AutoSizer } from "react-virtualized";
import ClassCard from "../class/ClassCard";
import LoadingSpinner from "../progress/LoadingSpinner";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import { classActions } from "../../../utils/store/reducers/class";
import { usePreview } from "react-dnd-preview";
import dynamic from "next/dynamic";
const ITEM_WIDTH = 340;
const ITEM_HEIGHT = 320;
let WIDTH = 50;

const Dashboard = ({ userEnrolledClasses, userTeachingClasses }) => {
  const dispatch = useDispatch();
  // const [{ isOverEnrolled }, dropEnrolled] = useDrop(() => ({
  //   accept: "CLASS_CARD",
  //   drop: moveClassCardEnrolled,
  // }));

  // const [{ isOverTeaching }, dropTeaching] = useDrop(() => ({
  //   accept: "CLASS_CARD",
  //   drop: moveClassCardTeaching,
  // }));

  // function getMaxItemsAmountPerRow(width) {
  //   return Math.max(Math.floor(width / ITEM_WIDTH), 1);
  // }

  // function generateIndex(column, row, maxItemsPerRow) {
  //   return row * maxItemsPerRow + column;
  // }

  // function getRowsAmount(width, itemsAmount) {
  //   const maxItemsPerRow = getMaxItemsAmountPerRow(width);
  //   return Math.ceil(itemsAmount / maxItemsPerRow);
  // }

  // function cellRenderer1({ columnIndex, key, rowIndex, style }) {
  //   const maxItemsPerRow = getMaxItemsAmountPerRow(WIDTH);
  //   const idx = generateIndex(columnIndex, rowIndex, maxItemsPerRow);

  //   if (idx >= userTeachingClasses.length) {
  //     return;
  //   }

  //   return (
  //     <div key={key} style={{ ...style, marginRight: "20px" }}>
  //       <ClassCard
  //         key={userTeachingClasses[idx]._id}
  //         classDetails={userTeachingClasses[idx]}
  //       />
  //     </div>
  //   );
  // }

  // function cellRenderer({ columnIndex, key, rowIndex, style }) {
  //   const maxItemsPerRow = getMaxItemsAmountPerRow(WIDTH);
  //   const idx = generateIndex(columnIndex, rowIndex, maxItemsPerRow);

  //   if (idx >= userEnrolledClasses.length) {
  //     return;
  //   }

  //   return (
  //     <div key={key} style={{ ...style, marginRight: "20px" }}>
  //       <ClassCard
  //         key={userEnrolledClasses[idx]._id}
  //         classDetails={userEnrolledClasses[idx]}
  //       />
  //     </div>
  //   );
  // }

  const moveClassCardEnrolled = (fromIndex, toIndex) => {
    dispatch(classActions.dragAndDropEnrolledClasses({ fromIndex, toIndex }));
  };

  const moveClassCardTeaching = (fromIndex, toIndex) => {
    dispatch(classActions.dragAndDropTeachingClasses({ fromIndex, toIndex }));
  };

  return (
    <>
      <div className={classes.dashboard}>
        <div className={classes.enrolledContainer}>
          <div className={classes.title}>
            <h3>Enrolled</h3>
          </div>
          <hr />

          <DndProvider backend={HTML5Backend}>
            <div
              className={classes["dashboard__classContainer"]}
              // ref={dropEnrolled}
            >
              {!userEnrolledClasses ? (
                <LoadingSpinner className={classes.spinner} />
              ) : (
                <>
                  {userEnrolledClasses.map((enrolledClass, index) => (
                    <ClassCard
                      key={enrolledClass._id}
                      index={index}
                      classDetails={enrolledClass}
                      moveClassCard={moveClassCardEnrolled}
                    />
                  ))}
                </>
              )}
            </div>
          </DndProvider>
        </div>

        <div className={classes.teachingContainer}>
          <div className={classes.title}>
            <h3>Teaching</h3>
          </div>
          <hr />

          <DndProvider backend={HTML5Backend}>
            <div
              className={classes["dashboard__classContainer"]}
              // ref={dropTeaching}
            >
              {!userTeachingClasses ? (
                <LoadingSpinner className={classes.spinner} />
              ) : (
                <>
                  {userTeachingClasses.map((teachingClass, index) => (
                    <ClassCard
                      index={index}
                      key={teachingClass._id}
                      classDetails={teachingClass}
                      moveClassCard={moveClassCardTeaching}
                    />
                  ))}
                </>
              )}
            </div>
          </DndProvider>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
