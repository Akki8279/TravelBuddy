require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./src/config/db');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", require("./src/routes/authRoutes"));
app.use("/api/v1/users", require("./src/routes/userRoutes"));
app.use("/api/v1/trips", require("./src/routes/tripRoutes"));
// app.use("/api/v1/requests", require("./src/routes/requestRoutes"));
// app.use("/api/v1/messages", require("./src/routes/messageRoutes"));


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})