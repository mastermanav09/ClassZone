import React, { useEffect, useState, useRef } from "react";
import Peer from "simple-peer";
import { io } from "socket.io-client";
import { Sidebar } from "react-pro-sidebar";
import Image from "next/image";
import { CopyToClipboard } from "react-copy-to-clipboard";
import classes from "./Call.module.scss";
import Microphone from "../svg/Microphone";
import MuteMicrophone from "../svg/MuteMicrophone";
import Video from "../svg/Video";
import Chat from "../svg/Chat";
import EndCall from "../svg/EndCall";
import ChatItem from "./ChatItem";
import OffVideo from "../svg/OffVideo";
import { notifyAndUpdate } from "@/helper/toastNotifyAndUpdate";
import { ERROR_TOAST } from "../../../utils/constants";
import { toast } from "react-toastify";
import ReactPlayer from "react-player";
import JoinToast from "./JoinToast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import moment from "moment";
import LiveClockUpdate from "@/helper/LiveClock";

const colors = [
  "#0a9689",
  "#2c6fbb",
  "#4e2374",
  "#CC313D",
  "#7A2048",
  "#008d7d",
];

const selectedColor = colors[Math.floor(Math.random() * colors.length)];

const Call = () => {
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [isAudioOff, setIsAudioOff] = useState(true);
  const [yourID, setYourID] = useState("");
  const [socket, setSocket] = useState(null);
  // const [users, setUsers] = useState({});
  const [idToCall, setIdToCall] = useState();
  const [myStream, setMyStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const userVideo = useRef(null);
  const userAudio = useRef(null);
  const [chatPanel, setChatPanel] = useState(false);
  const partnerVideo = useRef(null);
  const partnerAudio = useRef(null);
  const connectionRef = useRef(null);
  const chatMessageInput = useRef(null);
  const [callEnded, setCallEnded] = useState(false);
  const [callerName, setCallerName] = useState("");
  const [callerImage, setCallerImage] = useState("");
  const [myName, setMyName] = useState("");
  const [myImage, setMyImage] = useState("");
  const { data: session } = useSession();
  const [linkCopied, setLinkCopied] = useState(false);
  const router = useRouter();
  const [chatMessages, setChatMessages] = useState([]);
  const messagePanelScrollRef = useRef();

  useEffect(() => {
    const socket = io.connect(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL);

    socket.on("yourID", (id) => {
      setYourID(id);
    });

    socket.on("allUsers", (users) => {
      setUsers(users);
    });

    socket.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerName(data.name);
      setCallerImage(data.image);
      setCallerSignal(data.signal);
    });

    socket.on("callEnded", () => {
      setCallEnded(true);
      setReceivingCall(false);
      setCallAccepted(false);
      router.replace("/");
    });

    socket.on("sendChatMessage", (data) => {
      setChatMessages((prev) => [
        ...prev,
        {
          name: data.name,
          message: data.message,
          time: data.time,
        },
      ]);
    });

    setSocket(socket);

    return () => {
      connectionRef?.current?.destroy();
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (linkCopied) {
      setTimeout(() => {
        setLinkCopied(false);
      }, 5000);
    }
  }, [linkCopied]);

  useEffect(() => {
    setMyName(session?.user.name);
    setMyImage(session?.user.image);
  }, [session]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setMyStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }

        if (userAudio.current) {
          userAudio.current.srcObject = stream;
        }

        const videoTrack = stream
          ?.getTracks()
          .find((track) => track.kind === "video");
        if (videoTrack) {
          videoTrack.enabled = false;
        }

        const audioTrack = stream
          ?.getTracks()
          .find((track) => track.kind === "audio");
        if (audioTrack) {
          audioTrack.enabled = false;
        }
      })
      .catch((error) =>
        notifyAndUpdate(
          ERROR_TOAST,
          "error",
          "Can't access the media device.",
          toast,
          null
        )
      );
  }, []);

  function callPeer(id) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: myStream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        name: myName,
        image: myImage,
        from: yourID,
      });
    });

    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }

      if (partnerAudio.current) {
        partnerAudio.current.srcObject = stream;
      }
    });

    socket.on("callAccepted", ({ signal }) => {
      setCallAccepted(true);

      try {
        peer.signal(signal);
      } catch (error) {
        // notifyAndUpdate(
        //   ERROR_TOAST,
        //   "error",
        //   "Meeting link is expired, please create a new link",
        //   toast,
        //   null
        // );
      }
    });

    connectionRef.current = peer;
  }

  function admitUserHandler() {
    setCallAccepted(true);
    setCallEnded(false);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: myStream,
    });
    peer.on("signal", (data) => {
      socket.emit("acceptCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }

      if (partnerAudio.current) {
        partnerAudio.current.srcObject = stream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  }

  const rejectUserHandler = () => {
    setReceivingCall(false);
    setCallAccepted(false);
  };

  const videoHandler = () => {
    setIsVideoOff((prev) => !prev);

    const videoTrack = myStream
      ?.getTracks()
      .find((track) => track.kind === "video");
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
    }
  };

  const audioHandler = () => {
    setIsAudioOff((prev) => !prev);
    const audioTrack = myStream
      ?.getTracks()
      .find((track) => track.kind === "audio");
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
    }
    if (userAudio.current) {
      userAudio.current.srcObject = myStream;
    }
  };

  let UserVideo;
  if (myStream) {
    UserVideo = (
      <ReactPlayer url={myStream} muted playing width="100%" height="100%" />
    );
  }

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = <video playsInline muted ref={partnerVideo} autoPlay />;
  }

  const sidebarHandler = () => {
    setChatPanel((prev) => !prev);
  };

  const leaveCall = () => {
    setCallEnded(true);
    setReceivingCall(false);
    setCallAccepted(false);

    socket.emit("callEnded", {
      to: [yourID, idToCall, caller],
    });

    router.replace("/");
  };

  const firstInitial = myName?.split(" ")[0]?.charAt(0);
  const secondInitial = myName?.split(" ")[1]?.charAt(0) || "";

  const sendMessageHandler = () => {
    const text = chatMessageInput.current?.value;

    if (!text || text.trim().length == 0) {
      return;
    }
    const newMessage = {
      name: myName,
      message: text,
      time: moment().format("h:mm a"),
    };

    socket.emit("sendChatMessage", {
      ...newMessage,
      to: caller ? caller : idToCall,
    });

    setChatMessages((prev) => [...prev, newMessage]);
    if (chatMessageInput) {
      chatMessageInput.current.value = "";
    }
  };

  messagePanelScrollRef?.current?.scrollTo({
    behavior: "smooth",
    top: messagePanelScrollRef.current.scrollHeight,
  });

  return (
    <>
      <JoinToast
        showToast={receivingCall && !callAccepted}
        callerImage={callerImage}
        callerName={callerName}
        rejectUserHandler={rejectUserHandler}
        admitUserHandler={admitUserHandler}
      />

      <div className={classes["wrapper"]}>
        <div className={classes["upper-section"]}>
          <div className={classes["call-container"]}>
            <div className={classes["person"]}>
              {isAudioOff && (
                <div className={classes["mic"]}>
                  <MuteMicrophone />
                </div>
              )}
              <audio ref={userAudio} autoPlay playsInline />
              {myStream && !isVideoOff ? (
                <>{UserVideo}</>
              ) : (
                <>
                  <div
                    className={classes["symbol"]}
                    style={{
                      background: selectedColor,
                    }}
                  >
                    <span className={classes["text"]}>
                      {!firstInitial && !secondInitial
                        ? ""
                        : firstInitial + secondInitial}
                    </span>
                  </div>
                  <div className={classes["name"]}>{myName}</div>
                </>
              )}
            </div>

            {callAccepted && (
              <div className={classes["person"]}>
                {/* {isMuted ? (
                <div className={classes["mic"]}>
                  <MuteMicrophone />
                </div>
              ) : (
              )} */}
                <audio ref={partnerAudio} autoPlay playsInline />
                {callAccepted ? (
                  <>{PartnerVideo}</>
                ) : (
                  <>
                    <div
                      className={classes["symbol"]}
                      style={{ background: "#e1546b" }}
                    >
                      <span className={classes["text"]}>U</span>
                    </div>
                    <div className={classes["name"]}>User</div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className={classes.chatPanel}></div>
        </div>

        <div
          className={[classes["bg-dark-gray"], classes["lower-section"]].join(
            " "
          )}
        >
          <div className={classes["meeting-details"]}>
            {!callAccepted && (
              <div className={classes.joinRoom}>
                <input
                  id="filled-basic"
                  label="ID to call"
                  type="text"
                  placeholder="Enter Room Id"
                  className={`${classes.joinInput}`}
                  value={idToCall}
                  onChange={(e) => setIdToCall(e.target.value)}
                />

                <button
                  className={`${classes.joinButton}`}
                  onClick={() => callPeer(idToCall)}
                >
                  Join
                </button>
              </div>
            )}

            <div className={classes["meeting-name"]}>
              <span> Classzone | </span>
              <LiveClockUpdate />
            </div>
          </div>

          <div
            className={[classes["controls"], classes["meeting-controls"]].join(
              " "
            )}
          >
            {isAudioOff ? (
              <div
                className={[classes["bg-red"], classes.icon].join(" ")}
                onClick={audioHandler}
              >
                <div className={classes.microphone}>
                  <MuteMicrophone />
                </div>
              </div>
            ) : (
              <div
                className={[classes["bg-gray"], classes.icon].join(" ")}
                onClick={audioHandler}
              >
                <div className={classes.microphone}>
                  <Microphone />
                </div>
              </div>
            )}

            {isVideoOff ? (
              <div
                className={[classes["bg-red"], classes.icon].join(" ")}
                onClick={videoHandler}
              >
                <div className={classes.video}>
                  <OffVideo />
                </div>
              </div>
            ) : (
              <div
                className={[classes["bg-gray"], classes.icon].join(" ")}
                onClick={videoHandler}
              >
                <div className={classes.video}>
                  <Video />
                </div>
              </div>
            )}

            <div
              className={[
                classes["bg-gray"],
                classes.icon,
                chatPanel ? classes.activeChatPanel : "",
              ].join(" ")}
              onClick={sidebarHandler}
            >
              <div className={classes.chat}>
                <Chat />
              </div>
            </div>

            {callAccepted && !callEnded && (
              <div
                className={[classes["bg-red"], classes.endCall].join(" ")}
                onClick={leaveCall}
              >
                <EndCall />
              </div>
            )}
          </div>
          {!callAccepted && (
            <div className={classes["create-meeting"]}>
              <CopyToClipboard
                text={yourID}
                style={{
                  marginBottom: "2rem",
                  backgroundColor:
                    linkCopied === true ? "green" : "rgb(54, 54, 231)",
                }}
              >
                <button onClick={() => setLinkCopied(true)}>
                  {!linkCopied
                    ? " Copy Room Id"
                    : "Great! Now you can share it with someone. 🤩"}
                </button>
              </CopyToClipboard>
            </div>
          )}
        </div>

        <div
          style={{
            height: "100%",
            position: "fixed",
            background: "white",
            zIndex: 200,
            color: "black",
          }}
        >
          <Sidebar
            collapsed={false}
            width="350px"
            transitionDuration={300}
            rtl={true}
            onBackdropClick={() => setChatPanel(false)}
            toggled={chatPanel}
            breakPoint="all"
            backgroundColor="white"
            color="black"
          >
            <div className={classes["chat-panel"]}>
              <div className={classes["heading"]}>
                Chat Panel
                <Image src="/logo.png" width={40} height={40} alt="logo" />
              </div>
              <div className={classes.hr} />
              <div
                className={classes["message-box"]}
                ref={messagePanelScrollRef}
              >
                {chatMessages.map((message, index) => (
                  <div key={index}>
                    <ChatItem message={message} />
                  </div>
                ))}
                <div style={{ height: "5rem" }}></div>
              </div>

              <div className={classes["message-input"]}>
                <textarea
                  ref={chatMessageInput}
                  placeholder="Type your message here..."
                />
                <button onClick={sendMessageHandler}>Send</button>
              </div>
            </div>
          </Sidebar>
        </div>
      </div>
    </>
  );
};

export default Call;
