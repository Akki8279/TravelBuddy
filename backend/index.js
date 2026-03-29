require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db");
const http = require("http"); // 🔥 NEW
const initializeSocket = require("./src/socket"); // 🔥 NEW

const app = express();
const server = http.createServer(app); // 🔥 NEW
const io = initializeSocket(server); // 🔥 NEW

const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173"], 
    credentials: true,
  })
);

app.use(express.json());

// ✅ Routes
app.use("/api/v1/auth", require("./src/routes/authRoutes"));
app.use("/api/v1/users", require("./src/routes/userRoutes"));
app.use("/api/v1/trips", require("./src/routes/tripRoutes"));
app.use("/api/v1/requests", require("./src/routes/requestRoutes"));
app.use("/api/v1/messages", require("./src/routes/messageRoutes")); // 🔥 NEW

// ❌ 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ❌ Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// ✅ Start server ONLY after DB connects
const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();