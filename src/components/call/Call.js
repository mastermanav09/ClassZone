import React, { useEffect, useState, useRef } from "react";
import Peer from "simple-peer";
import { io } from "socket.io-client";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import Image from "next/image";
import { CopyToClipboard } from "react-copy-to-clipboard";
import classes from "./Call.module.scss";
import Microphone from "../svg/Microphone";
import MuteMicrophone from "../svg/MuteMicrophone";
import ClockComponent from "./Clock";
import Video from "../svg/Video";
import Chat from "../svg/Chat";
import EndCall from "../svg/EndCall";
import ChatItem from "./ChatItem";
import OffVideo from "../svg/OffVideo";

const Call = () => {
  const [socket, setSocket] = useState(null);
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [chatPanel, setChatPanel] = useState(false);
  const [update, setUpdate] = useState(1);
  const myVideo = useRef(null);
  const myAudio = useRef(null);

  const userVideo = useRef(null);
  const userAudio = useRef(null);
  const connectionRef = useRef(null);

  useEffect(() => {
    const socket = io.connect(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL);
    setSocket(socket);

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("me", (id) => {
        setMe(id);
      });

      socket.on("callUser", (data) => {
        setCaller(data.from);
        setCallerSignal(data.signal);
        setName(data.name);
        setReceivingCall(true);
      });

      // socket.on("videoStateChanged", ({ userId, videoState }) => {
      //   console.log("changed video state", userId, videoState);
      //   // Find the user's video element and update its stream
      //   if (userId !== me && videoState && stream) {
      //     // if (peerVideo) {
      //     userVideo.current.srcObject = stream;
      //     // }
      //   }
      // });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("videoStateChanged", (data) => {
        console.log("getting valled");
        console.log(data);
        if (userVideo.current) {
          userVideo.current.srcObject = data.stream;
        }
      });
    }
  }, [socket]);

  useEffect(() => {
    // if (!isVideoOff) {

    // if (!isVideoOff) {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((stream) => {
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      });

    if (stream && isVideoOff) {
      stream.getVideoTracks()[0].enabled = isVideoOff;
    }
    // }
    // }
    // else {
    //   stream?.getTracks().forEach((track) => {
    //     if (track.readyState == "live" && track.kind === "video") {
    //       track.enabled = !isVideoOff;
    //     }
    //   });

    //   // setUpdate((prev) => prev + 1);
    // }

    // if (!isMuted) {
    // navigator.mediaDevices
    //   .getUserMedia({
    //     audio: true,
    //   })
    //   .then((stream) => {
    //     setStream(stream);
    //     if (myAudio.current) {
    //       myAudio.current.srcObject = stream;
    //     }
    //   });
    // }
    // else {
    //   stream?.getTracks().forEach((track) => {
    //     if (track.readyState == "live" && track.kind === "audio") {
    //       track.enabled = !isMuted;
    //     }
    //   });

    //   // setUpdate((prev) => prev + 1);
    // }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isVideoOff]);

  // useEffect(() => {
  //   setUpdate((prev) => prev + 1);
  // }, [stream]);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", {
        signal: data,
        to: caller,
      });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  const sidebarHandler = () => {
    setChatPanel((prev) => !prev);
  };

  const muteHandler = () => {
    setIsMuted((prev) => !prev);
  };

  const videoHandler = () => {
    setIsVideoOff((prev) => !prev);
    // console.log(stream.getVideoTracks());
    // console.log(stream.getTracks());

    // if (stream) {
    stream.getVideoTracks()[0].enabled = !isVideoOff;
    if (myVideo.current) {
      myVideo.current.srcObject = stream;
    }

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      // console.log("Dadadaiojdowijdaopdj");
      socket.emit("videoStateChanged", {
        to: idToCall,
        signal: data,
      });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    socket.on("videoStateChanged", (data) => {
      peer.signal(data.signal);
      // if (userVideo.current) {
      //   userVideo.current.srcObject = data.stream;
      // }
    });

    // });
    // socket.emit("videoStateChanged", { stream: stream, to: idToCall });
    // peer.on("stream", (stream) => {
    // });

    // console.log(stream.getVideoTracks()[0].enabled);
    // }
    // socket.emit("videoStateChanged", {
    //   userId: me,
    //   videoState: newVideoState,
    //   to: idToCall,
    // });
  };

  console.log(myVideo, userVideo);
  return (
    <>
      {/* <h1 style={{ textAlign: "center", color: "white" }}>ClassZone</h1> */}

      {/* <div className={classes.container}>
        <div className={classes["video-container"]}>
          <div className={classes.video}>
            {stream && (
              <video autoPlay muted={isMuted} id="player" playsInline ref={myVideo} />
            )}
          </div>

          <div className={classes.video}>
            {callAccepted && !callEnded ? (
              <video autoPlay id="player" playsInline ref={userVideo}></video>
            ) : null}
          </div>
        </div> */}

      <div className={classes["wrapper"]}>
        <div className="myId">
          <input
            id="filled-basic"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
            <button

            //   startIcon={<AssignmentIcon fontSize="large" />}
            >
              Copy ID
            </button>
          </CopyToClipboard>

          <input
            id="filled-basic"
            label="ID to call"
            value={idToCall}
            onChange={(e) => setIdToCall(e.target.value)}
          />
          <div className="call-button">
            {callAccepted && !callEnded ? (
              <button onClick={leaveCall}>End Call</button>
            ) : (
              <button aria-label="call" onClick={() => callUser(idToCall)}>
                <Image src="/phone.png" width={40} height={40} alt="call" />
              </button>
            )}
            {idToCall}
          </div>
        </div>
        <div>
          {receivingCall && !callAccepted ? (
            <div className="caller">
              <h1>{name} is calling...</h1>
              <button onClick={answerCall}>Answer</button>
            </div>
          ) : null}
        </div>
        <div className={classes["upper-section"]}>
          <div className={classes["call-container"]}>
            <div className={classes["person"]}>
              {isMuted ? (
                <div className={classes["mic"]}>
                  <MuteMicrophone />
                </div>
              ) : (
                <audio ref={myAudio} autoPlay playsInline />
              )}
              {stream && !isVideoOff ? (
                <video
                  autoPlay
                  muted={true}
                  id="player"
                  playsInline
                  ref={myVideo}
                />
              ) : (
                <>
                  <div className={classes["symbol"]}>
                    <span className={classes["text"]}>A</span>
                  </div>
                  <div className={classes["name"]}>Manav Naharwal</div>
                </>
              )}
            </div>

            <div className={classes["person"]}>
              {/* {isMuted ? (
                <div className={classes["mic"]}>
                  <MuteMicrophone />
                </div>
              ) : ( */}
              <audio ref={userAudio} autoPlay playsInline />
              {/* )} */}
              {callAccepted && !callEnded ? (
                <video autoPlay id="player" playsInline ref={userVideo}></video>
              ) : (
                <>
                  <div className={classes["symbol"]}>
                    <span className={classes["text"]}>A</span>
                  </div>
                  <div className={classes["name"]}>Manav Naharwal</div>
                </>
              )}
            </div>
          </div>

          <div className={classes.chatPanel}></div>
        </div>

        <div
          className={[classes["bg-dark-gray"], classes["lower-section"]].join(
            " "
          )}
        >
          <div className={classes["meeting-name"]}>
            <span> Classzone | </span>
            <ClockComponent />
          </div>

          <div
            className={[classes["controls"], classes["meeting-controls"]].join(
              " "
            )}
          >
            {isMuted ? (
              <div
                className={[classes["bg-red"], classes.icon].join(" ")}
                onClick={muteHandler}
              >
                <div className={classes.microphone}>
                  <MuteMicrophone />
                </div>
              </div>
            ) : (
              <div
                className={[classes["bg-gray"], classes.icon].join(" ")}
                onClick={muteHandler}
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

            <div className={[classes["bg-red"], classes.endCall].join(" ")}>
              <EndCall />
            </div>
          </div>

          <div className={classes["chat-icon"]}></div>
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

              <div className={classes["message-box"]}>
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />

                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
                <ChatItem />
              </div>
            </div>
          </Sidebar>
        </div>
      </div>
    </>
  );
};

export default Call;
