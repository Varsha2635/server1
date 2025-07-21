const express = require("express");
const app = express();

const serverless = require('serverless-http');

// ✅ Import mongoose
const mongoose = require("mongoose");

// Load config from .env file
require("dotenv").config();

console.log("-Hi, it reached here-");
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
// const allowedOrigins = [
//     'https://resilient-bienenstitch-4f77d0.netlify.app'
// ];

// const corsOptions = {
//     origin: function (origin, callback) {
//         if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//     optionsSuccessStatus: 200
// };

app.use(cors());

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

// Port configuration
const PORT = process.env.PORT || 5000;

// Start server for local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(` Server started on http://localhost:${PORT}`);
    });
}

// Start server
app.listen(PORT, () => {
  console.log(` Server started on http://localhost:${PORT}`);
});


module.exports.handler = serverless(app);
