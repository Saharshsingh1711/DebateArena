const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const registrationRoutes = require("./routes/registrationRoutes");
const authRoutes = require("./routes/authRoutes"); 
const aiRoutes = require("./routes/aiRoutes");



const app = express();

connectDB();

const corsOptions = {
  // Allow localhost for dev, and allow the frontend URL if provided via Environment Variables. 
  // We use '*' as a fallback so testing doesn't break during the deployment phase if FRONTEND_URL isn't set yet.
  origin: process.env.FRONTEND_URL || "*",
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", registrationRoutes);
app.use("/api/auth", authRoutes); 
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.json({ message: "AI Debate Arena Backend chal raha hai!" });
});

module.exports = app;
