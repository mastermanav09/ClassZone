import { Server } from "socket.io";

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket Already Setup");
    res.end();
    return;
  }
  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", async (socket) => {
    socket.emit("yourID", socket.id);

    socket.on("disconnect", () => {
      socket.broadcast.emit("Call ended");
    });

    socket.on("callUser", (data) => {
      io.to(data.userToCall).emit("hey", {
        signal: data.signalData,
        from: data.from,
        name: data.name,
        image: data.image,
      });
    });

    socket.on("callEnded", (data) => {
      const set = new Set([...data.to]);
      const socketIds = Array.from(set);

      for (let socketId of socketIds) {
        io.to(socketId).emit("callEnded");
      }
    });

    socket.on("sendChatMessage", (data) => {
      io.to(data.to).emit("sendChatMessage", data);
    });

    socket.on("acceptCall", (data) => {
      io.to(data.to).emit("callAccepted", data);
    });
  });

  console.log("Setting Up Socket.io");
  res.end();
}
