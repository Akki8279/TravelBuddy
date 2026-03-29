const { Server } = require("socket.io");
const Message = require("./models/messageModel");

// Active user tracking: mapping MongoDB User _id to Socket.IO socket.id
const onlineUsers = new Map();

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    // When client authenticates via frontend React state, register them
    socket.on("register_user", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`👤 User Registered: ${userId} -> Socket: ${socket.id}`);
    });

    // Handle real-time messaging
    socket.on("send_message", async (data) => {
      const { senderId, receiverId, text } = data;

      try {
        // 1. Immediately persist to MongoDB so history is never lost
        const newMessage = await Message.create({
          sender: senderId,
          receiver: receiverId,
          text: text,
        });

        // 2. Discover if receiver is actively online
        const receiverSocketId = onlineUsers.get(receiverId);

        if (receiverSocketId) {
          // Send to recipient
          io.to(receiverSocketId).emit("receive_message", newMessage);
        }

        // 3. We ALSO bounce the message back to the sender so their UI easily updates 
        // across multiple browser tabs natively
        const senderSocketId = onlineUsers.get(senderId);
        if (senderSocketId && senderSocketId !== socket.id) {
            io.to(senderSocketId).emit("receive_message", newMessage);
        }

      } catch (err) {
        console.error("Socket Message Saving Error:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
      // Find and delete user map entry
      for (const [userId, sId] of onlineUsers.entries()) {
        if (sId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });
  });

  return io;
};

module.exports = initializeSocket;
