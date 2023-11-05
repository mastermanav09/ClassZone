import React from "react";
import classes from "./ClassCard.module.scss";
import { useRouter } from "next/router";
import Image from "next/image";
import { useDrag, useDrop } from "react-dnd";

const ClassCard = ({ classDetails, index, moveClassCard, type }) => {
  const router = useRouter();
  const { _id, name: className, teacher, backgroundColor } = classDetails;

  const [{ isDragging }, drag] = useDrag({
    type: type,
    item: {
      _id,
      index,
      name: className,
      teacher,
      backgroundColor,
      type,
      moveClassCard,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: type,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveClassCard(draggedItem.index, index, draggedItem._id);
        draggedItem.index = index;
      }
    },

    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  return (
    <div
      className={classes.classCard}
      style={{
        cursor: "pointer",
        position: "relative",
        opacity: 1,
      }}
      onClick={() =>
        router.push({
          pathname: "/classes/[classId]",
          query: { classId: _id },
        })
      }
      ref={(node) => {
        drag(drop(node));
      }}
    >
      {isDragging && (
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "10px",
            overflow: "hidden",
            background: "#f1f3f4",
          }}
        />
      )}

      <div
        className={classes["classCard__upper"]}
        style={{ backgroundColor: backgroundColor }}
      >
        <div className={classes["classCard_desc"]}>
          <div className={classes["classCard__className"]}>{className}</div>
          {teacher?.credentials.name && (
            <div className={classes["classCard__creatorName"]}>
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
            className={classes["classCard__creatorPhoto"]}
          />
        )}
      </div>
      <div className={classes["classCard__middle"]}></div>
      <div className={classes["classCard__lower"]}></div>
    </div>
  );
};

export default ClassCard;
