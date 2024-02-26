const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

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

httpServer.listen(process.env.PORT || 3001, () => {
  console.log("Server listening on port 3001");
});
