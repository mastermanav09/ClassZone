import "react-responsive-modal/styles.css";
import React, { useState } from "react";
import classes from "./AssignmentCard.module.scss";
import Upload from "../svg/Upload";
import { Modal } from "react-responsive-modal";
import Edit from "../svg/Edit";
import Delete from "../svg/Delete";

const AssignmentCard = (props) => {
  const { assignment, confirmDeleteHandler, teacher, user } = props;
  const [openContentModal, setOpenContentModal] = useState(false);
  const [openUploadFileModal, setOpenUploadFileModal] = useState(false);
  const [isNewFileSelected, setIsNewFileSelected] = useState(false);
  const [file, setFile] = useState(null);
  const { _id } = assignment;

  const fileHandler = (event) => {
    if (event.target?.files.length > 0) {
      setFile(event.target.files[0]);
      setIsNewFileSelected(true);
    }
  };

  const openUploadFileModalHandler = () => {
    setOpenUploadFileModal(true);
  };

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
              maxWidth: "55rem",
              borderRadius: "10px",
              padding: "1rem 1rem 0 1rem",
            },
          }}
        >
          <div className={classes["assignment-modal-body"]}>
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
            {/* {(user?._id && user?._id !== teacher?.credentials._id) ||
              (user?.email && user?.email !== teacher?.credentials.email && (
                <></>
              ))} */}

            <button
              className={classes["modal-upload-btn"]}
              onClick={openUploadFileModalHandler}
            >
              Upload
            </button>
          </div>
        </Modal>
      )}

      {openUploadFileModal && (
        <Modal
          classNames={classes["react-responsive-modal-modal"]}
          onClose={() => {
            setOpenUploadFileModal(false);
            setFile(null);
            setIsNewFileSelected(false);
          }}
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
              minHeight: "25rem",
              width: "90%",
              maxWidth: "35rem",
              borderRadius: "10px",
            },
          }}
        >
          <div className={classes["upload-assignment-modal-body"]}>
            <div className={classes["upload-assignment-info"]}>
              <div>
                <span className={classes["info-title"]}>
                  Assignment Title :{" "}
                </span>
                <span className={classes["info-description"]}>
                  Physics Assignmendwauiduwa daiduwai odu wadiu waiduawdu
                  awiduwa diwaud woaudiwaudawi duwadi woaudwioduaiodwau doit
                </span>
              </div>
              <div>
                <span className={classes["info-title"]}>Submitting to : </span>
                <span>
                  {/* <Image /> */}{" "}
                  <span className={classes["info-description"]}>
                    Manav Naharwal doiwahd hwadia udaiodua diawud waidua diwau
                    dioawudaw idwaud iwaoduawdo iwuio udwadwa dwad wadwa9d
                    waudwa9 duwa09duaw0duwad 09wa
                  </span>
                </span>
              </div>
            </div>

            <div className={classes["upload-assignment-main"]}>
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <div
                  className={classes["remove-file-text"]}
                  onClick={() => {
                    setIsNewFileSelected(false);
                    setFile(null);
                  }}
                >
                  <span>Remove file</span>
                </div>

                {file && (
                  <span className={classes["uploadedFile-name"]}>
                    {file.name
                      .substring(0, 15)
                      .replaceAll(file.type.split("/")[1], "") +
                      "..." +
                      " ." +
                      file.type.split("/")[1]}
                  </span>
                )}
              </div>

              <div>
                <label
                  className={[
                    classes["file-input-box"],
                    isNewFileSelected
                      ? classes["selected"]
                      : classes["not-selected"],
                  ].join(" ")}
                >
                  <i className="fas fa-cloud-upload-alt fa-3x"></i>
                  <input
                    type="file"
                    className={classes["hidden"]}
                    onChange={fileHandler}
                  />
                  <div className={classes["file_select_text"]}>
                    {isNewFileSelected ? (
                      <span>File Selected</span>
                    ) : (
                      <span>Select File</span>
                    )}
                  </div>
                </label>
              </div>

              <div className={classes["upload-assignment-btn"]}>
                <button>Upload File</button>
              </div>
            </div>

            {/* <div>
              <label
                className={[
                  classes["file-input-box"],
                  isNewFileSelected
                    ? classes["selected"]
                    : classes["not-selected"],
                ].join(" ")}
              >
                <i className="fas fa-cloud-upload-alt fa-3x"></i>
                <input
                  type="file"
                  className={classes["hidden"]}
                  onChange={fileHandler}
                />
                <div className={classes["file_select_text"]}>
                  {isNewFileSelected ? (
                    <span>File Selected</span>
                  ) : (
                    <span>Select File</span>
                  )}
                </div>
              </label>
            </div>

            <div>
              <Upload tooltipContent="Upload" tooltipId="upload-assignment" />
            </div> */}
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
        <div className={classes.actions}>
          {(user?._id && user?._id === teacher?.credentials._id) ||
            (user?.email && user?.email === teacher?.credentials.email ? (
              <>
                <span>
                  <Edit tooltipContent="Edit" tooltipId="edit-assignment" />
                </span>
                <span onClick={() => confirmDeleteHandler(_id)}>
                  <Delete
                    tooltipContent="Delete"
                    tooltipId="delete-assignment"
                  />
                </span>
              </>
            ) : (
              <span>
                <Upload tooltipContent="Upload" tooltipId="upload-assignment" />
              </span>
            ))}
        </div>
      </div>
    </>
  );
};

export default AssignmentCard;
