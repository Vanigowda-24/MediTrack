const express = require("express")
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const medicineRoutes = require("./routes/medicineRoutes");
const authRoutes = require("./routes/authRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
console.log("MONGO_URI exists;", !!process.env.MONGO_URI);

const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/medicines", medicineRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);   

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error);
    });

// Test route
app.get("/", (req, res) => {
    res.send("Medicine Tracker Backend is Running!");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});