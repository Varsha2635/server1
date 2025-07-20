const express = require("express");
const app = express();

// ✅ Import mongoose
const mongoose = require("mongoose");

// Load config from .env file
require("dotenv").config();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const dbConnect = require("./config/database");
dbConnect();

// Doctor Model
const Doctor = require("./models/Doctor");

// Auto-insert dummy doctors if not already present
async function seedDoctors() {
  try {
    const count = await Doctor.countDocuments();
    if (count === 0) {
      await Doctor.insertMany([
        {
          name: "Dr. Neha Mehta",
          specialization: "Cardiologist",
          location: "Apollo Hyderabad",
          phone: "9876543210",
          rating: 4.8
        },
        {
          name: "Dr. Raj Patel",
          specialization: "Heart Surgeon",
          location: "Fortis Mumbai",
          phone: "9991234567",
          rating: 4.6
        },
        {
          name: "Dr. Aisha Khan",
          specialization: "General Physician",
          location: "AIIMS Delhi",
          phone: "8888765432",
          rating: 4.7
        }
      ]);
      console.log("✅ Dummy doctors inserted into database.");
    }
  } catch (err) {
    console.error("❌ Error seeding doctors:", err);
  }
}

// Run seeding when DB is connected
mongoose.connection.once("open", () => {
  console.log("✅ MongoDB connected");
  seedDoctors();
});

// Middleware
const cors = require("cors");
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Routes
const userRoutes = require("./routes/user");
const appointmentRoutes = require("./routes/appointment");
const doctorRoutes = require("./routes/doctor");

app.use("/api/v1", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Hello VK!!");
});

// Start server
app.listen(PORT, () => {
  console.log(` Server started on http://localhost:${PORT}`);
});
