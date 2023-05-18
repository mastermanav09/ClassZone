import React, { useRef } from "react";
import classes from "./Dashboard.module.scss";
import { Grid, AutoSizer } from "react-virtualized";
import ClassCard from "../class/ClassCard";
import LoadingSpinner from "../progress/LoadingSpinner";
const ITEM_WIDTH = 340;
const ITEM_HEIGHT = 320;
let WIDTH = 50;

const Dashboard = ({ userEnrolledClasses, userTeachingClasses }) => {
  function getMaxItemsAmountPerRow(width) {
    return Math.max(Math.floor(width / ITEM_WIDTH), 1);
  }

  function generateIndex(column, row, maxItemsPerRow) {
    return row * maxItemsPerRow + column;
  }

  function getRowsAmount(width, itemsAmount) {
    const maxItemsPerRow = getMaxItemsAmountPerRow(width);
    return Math.ceil(itemsAmount / maxItemsPerRow);
  }

  function cellRenderer1({ columnIndex, key, rowIndex, style }) {
    const maxItemsPerRow = getMaxItemsAmountPerRow(WIDTH);
    const idx = generateIndex(columnIndex, rowIndex, maxItemsPerRow);

    if (idx >= userTeachingClasses.length) {
      return;
    }

    return (
      <div key={key} style={{ ...style, marginRight: "20px" }}>
        <ClassCard
          key={userTeachingClasses[idx]._id}
          classDetails={userTeachingClasses[idx]}
        />
      </div>
    );
  }

  function cellRenderer({ columnIndex, key, rowIndex, style }) {
    const maxItemsPerRow = getMaxItemsAmountPerRow(WIDTH);
    const idx = generateIndex(columnIndex, rowIndex, maxItemsPerRow);

    if (idx >= userEnrolledClasses.length) {
      return;
    }

    return (
      <div key={key} style={{ ...style, marginRight: "20px" }}>
        <ClassCard
          key={userEnrolledClasses[idx]._id}
          classDetails={userEnrolledClasses[idx]}
        />
      </div>
    );
  }

  return (
    <>
      <div className={classes.dashboard}>
        <div className={classes.enrolledContainer}>
          <h3>Enrolled</h3>
          <hr />
          <div className={classes["dashboard__classContainer"]}>
            {!userEnrolledClasses ? (
              <LoadingSpinner className={classes.spinner} />
            ) : (
              <AutoSizer>
                {({ width, height }) => {
                  const rowCount = getRowsAmount(
                    width,
                    userEnrolledClasses.length
                  );
                  const maxItemsPerRow = getMaxItemsAmountPerRow(width);
                  WIDTH = width;
                  return (
                    <Grid
                      width={width}
                      height={height}
                      rowCount={rowCount}
                      columnWidth={ITEM_WIDTH}
                      rowHeight={ITEM_HEIGHT}
                      columnCount={maxItemsPerRow}
                      cellRenderer={cellRenderer}
                    />
                  );
                }}
              </AutoSizer>
            )}
          </div>
        </div>
        <div className={classes.teachingContainer}>
          <h3>Teaching</h3>
          <hr />
          <div className={classes["dashboard__classContainer"]}>
            {!userTeachingClasses ? (
              <LoadingSpinner className={classes.spinner} />
            ) : (
              <AutoSizer>
                {({ width, height }) => {
                  const rowCount = getRowsAmount(
                    width,
                    userTeachingClasses.length
                  );
                  const maxItemsPerRow = getMaxItemsAmountPerRow(width);
                  WIDTH = width;
                  return (
                    <Grid
                      width={width}
                      height={height}
                      rowCount={rowCount}
                      columnWidth={ITEM_WIDTH}
                      rowHeight={ITEM_HEIGHT}
                      columnCount={maxItemsPerRow}
                      cellRenderer={cellRenderer1}
                    />
                  );
                }}
              </AutoSizer>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
