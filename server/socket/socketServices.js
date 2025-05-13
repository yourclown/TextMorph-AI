// socket.js
const { Server: IOServer } = require("socket.io");

// Keep an in-memory map of userId → socketId
const onlineUsers = {};

// This function sets up Socket.IO on the given HTTP server
function initSocket(server, corsOptions) {
  const io = new IOServer(server, { cors: corsOptions });

  io.on("connection", socket => {
    console.log("⚡ Socket connected:", socket.id);

    socket.on("register-user", userId => {
      onlineUsers[userId] = socket.id;
      console.log(`Registered ${userId} → ${socket.id}`);
    });

    socket.on("disconnect", () => {
      for (let uid in onlineUsers) {
        if (onlineUsers[uid] === socket.id) {
          delete onlineUsers[uid];
          break;
        }
      }
      console.log("⚡ Socket disconnected:", socket.id);
    });
  });

  return { io, onlineUsers };
}

module.exports = { initSocket, onlineUsers };
