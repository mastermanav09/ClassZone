import "react-responsive-modal/styles.css";
import React, { useState } from "react";
import classes from "./AssignmentCard.module.scss";
import Upload from "../svg/Upload";
import { Modal } from "react-responsive-modal";

const AssignmentCard = (props) => {
  const { assignment } = props;
  const [openContentModal, setOpenContentModal] = useState(false);

  return (
    <>
      {openContentModal && (
        <Modal
          classNames={classes["react-responsive-modal-modal"]}
          onClose={() => setOpenContentModal(false)}
          center
          open={openContentModal}
          animationDuration={200}
          styles={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.75)",
            },

            closeIcon: {
              fill: "#ff0000",
              marginLeft: "10px",
            },

            modal: {
              maxHeight: "35rem",
              width: "90%",
              maxWidth: "35rem",
              borderRadius: "10px",
              padding: "1.2rem 1.2rem 0 1.2rem",
            },
          }}
        >
          <div className={classes["assignment-body"]}>
            <div className={classes["assignment-content"]}>
              <div className={classes["assignment-title"]}>
                <span>Title : </span>
                <div>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Numquam mollitia eaque optio provident? Sequi, eum maxime vero
                  qui a, beatae quod id eos rem nostrum perferendis! Qui error
                  dolorum quo, dicta fugiat eius omnis corrupti at debitis amet
                  perferendis, vero alias expedita sequi reprehenderit dolor
                  incidunt fugit doloremque voluptatibus commodi natus obcaecati
                  rem eaque accusantium? Dolore totam tenetur consequuntur
                  consequatur, nostrum, ad reiciendis nihil aut pariatur
                  explicabo doloremque. Odio voluptas vitae deserunt temporibus,
                  veniam reiciendis atque dolorem provident recusandae tenetur
                  ut, ipsum possimus repudiandae, aut iure excepturi voluptatem
                  repellat cumque omnis ratione debitis exercitationem adipisci
                  assumenda? Et dicta ducimus veniam!
                </div>
              </div>

              <div className={classes["assignment-description"]}>
                <span>Description : </span>
                <div>
                  {" "}
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Numquam mollitia eaque optio provident? Sequi, eum maxime vero
                  qui a, beatae quod id eos rem nostrum perferendis! Qui error
                  dolorum quo, dicta fugiat eius omnis corrupti at debitis amet
                  perferendis, vero alias expedita sequi reprehenderit dolor
                  incidunt fugit doloremque voluptatibus commodi natus obcaecati
                  rem eaque accusantium? Dolore totam tenetur consequuntur
                  consequatur, nostrum, ad reiciendis nihil aut pariatur
                  explicabo doloremque. Odio voluptas vitae deserunt temporibus,
                  veniam reiciendis atque dolorem provident recusandae tenetur
                  ut, ipsum possimus repudiandae, aut iure excepturi voluptatem
                  repellat cumque omnis ratione debitis exercitationem adipisci
                  assumenda? Et dicta ducimus veniam!
                </div>
              </div>
            </div>
          </div>
          <div className={classes["assignment-actions"]}>
            <button className={classes["modal-upload-btn"]}>Upload</button>
          </div>
        </Modal>
      )}

      <div className={classes.container}>
        <div
          className={classes["assignment-card-body"]}
          onClick={() => setOpenContentModal(true)}
        >
          <div>{assignment.title}</div>
        </div>
        {/* <div className={classes.vl}></div> */}
        <div className={classes.upload}>
          <Upload />
        </div>
      </div>
    </>
  );
};

export default AssignmentCard;
