import React from "react";
import Image from "next/image";
import ThreeDots from "../svg/ThreeDots";
import classes from "./PeopleUserCard.module.scss";
import { useSession } from "next-auth/react";
import LoadingSpinner from "../progress/LoadingSpinner";
import Modal from "react-responsive-modal";

const PeopleUserCard = ({
  classMember,
  teacher,
  fields,
  confirmRemove,
  confirmRemoveHandler,
  removeMemberHandler,
  isLoading,
}) => {
  const { data: session } = useSession();
  const { user } = session || {};

  return (
    <>
      {confirmRemove && (
        <Modal
          classNames={classes["react-responsive-modal-modal"]}
          center
          onClose={() => confirmRemoveHandler(false, null)}
          open={confirmRemove}
          animationDuration={200}
          styles={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.75)",
            },
            closeIcon: {
              fill: "#ff0000",
            },
            modal: {
              width: "90%",
              maxWidth: "35rem",
              borderRadius: "10px",
            },
          }}
        >
          <div className={classes["modal-content"]}>
            <div
              className={`${classes["modal-header"]} ${classes["flex-column"]}`}
            >
              <h4 className={classes["modal-title"]}>Are you sure ?</h4>
            </div>
            <div className={classes["modal-body"]}>
              <p>Do you really want to remove this member ?</p>
            </div>
            <div className={classes["modal-footer"]}>
              <button
                type="button"
                className={classes["cancel-button"]}
                data-dismiss="modal"
                onClick={() => confirmRemoveHandler(false, null)}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isLoading}
                className={classes["delete-button"]}
                onClick={removeMemberHandler}
              >
                {isLoading ? (
                  <LoadingSpinner className={classes.spinner} />
                ) : (
                  "Remove"
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

      <div className={classes.container}>
        <div className={classes.userinfo}>
          <Image
            alt="user-image"
            width={40}
            height={40}
            src={
              classMember?.credentials?.userImage ||
              "/images/profileImages/no-img.png"
            }
            className={classes.img}
          />
          <span>{classMember?.credentials?.name}</span>
        </div>
        {user?._id === teacher?._id && (
          <div className={classes.threeDots}>
            <ThreeDots fields={fields} data={classMember} />
          </div>
        )}
      </div>
      <hr className={classes.hr} />
    </>
  );
};

export default PeopleUserCard;
