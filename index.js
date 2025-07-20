// const express = require("express");
// const app = express();

// const serverless = require('serverless-http');

// // ✅ Import mongoose
// const mongoose = require("mongoose");

// // Load config from .env file
// require("dotenv").config();
// const PORT = process.env.PORT || 5000;

// // Connect to MongoDB
// const dbConnect = require("./config/database");
// dbConnect();

// // Doctor Model
// const Doctor = require("./models/Doctor");

// // Auto-insert dummy doctors if not already present
// async function seedDoctors() {
//   try {
//     const count = await Doctor.countDocuments();
//     if (count === 0) {
//       await Doctor.insertMany([
//         {
//           name: "Dr. Neha Mehta",
//           specialization: "Cardiologist",
//           location: "Apollo Hyderabad",
//           phone: "9876543210",
//           rating: 4.8
//         },
//         {
//           name: "Dr. Raj Patel",
//           specialization: "Heart Surgeon",
//           location: "Fortis Mumbai",
//           phone: "9991234567",
//           rating: 4.6
//         },
//         {
//           name: "Dr. Aisha Khan",
//           specialization: "General Physician",
//           location: "AIIMS Delhi",
//           phone: "8888765432",
//           rating: 4.7
//         }
//       ]);
//       console.log("✅ Dummy doctors inserted into database.");
//     }
//   } catch (err) {
//     console.error("❌ Error seeding doctors:", err);
//   }
// }

// // Run seeding when DB is connected
// mongoose.connection.once("open", () => {
//   console.log("✅ MongoDB connected");
//   seedDoctors();
// });

// // Middleware
// const cors = require("cors");
// app.use(cors({
//   origin: "https://resilient-bienenstitch-4f77d0.netlify.app",
//   credentials: true
// }));
// app.use(express.json());
// const cookieParser = require("cookie-parser");
// app.use(cookieParser());

// // Routes
// const userRoutes = require("./routes/user");
// const appointmentRoutes = require("./routes/appointment");
// const doctorRoutes = require("./routes/doctor");

// app.use("/api/v1", userRoutes);
// app.use("/api/appointments", appointmentRoutes);
// app.use("/api/doctors", doctorRoutes);

// // Health check
// app.get("/", (req, res) => {
//   res.send("Hello VK!!");
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(` Server started on http://localhost:${PORT}`);
// });


// module.exports.handler = serverless(app);


const express = require("express");

const app = express();

const serverless = require('serverless-http');

const mongoose = require("mongoose");

const cors = require("cors"); // Keep this here for CORS configuration

const cookieParser = require("cookie-parser"); // Keep this here



// Load config from .env file FIRST

require("dotenv").config();

const PORT = process.env.PORT || 5000;



// Connect to MongoDB

const dbConnect = require("./config/database"); // Assuming this function connects to DB

dbConnect(); // Call the function to connect



// Doctor Model (ensure this path is correct if it's not directly in models)

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

          Aphone: "9991234567",

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

// It's good that you're waiting for the connection to be open.

mongoose.connection.once("open", () => {

  console.log("✅ MongoDB connected successfully."); // More descriptive message

  seedDoctors();

});



// If there's an error after initial connection (e.g., connection lost)

mongoose.connection.on("error", (err) => {

  console.error("❌ MongoDB connection error:", err);

  // Optionally, implement retry logic or exit process if critical

});





// --- Middleware Configuration ---



// CORS Middleware

// It's good to define allowed origins from environment variables for flexibility.

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS ?

                       process.env.CORS_ALLOWED_ORIGINS.split(',') :

                       ['https://resilient-bienenstitch-4f77d0.netlify.app']; // Default if env var is not set



const corsOptions = {

  origin: function (origin, callback) {

    // Allow requests with no origin (like mobile apps, curl requests, or same-origin)

    // or if the origin is in our allowed list.

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {

      callback(null, true);

    } else {

      callback(new Error('Not allowed by CORS'));

    }

  },

  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Explicitly list allowed methods

  credentials: true, // Crucial for sending cookies/auth headers

  optionsSuccessStatus: 204 // For preflight requests

};



app.use(cors(corsOptions)); // Apply CORS middleware with specific options



// Body Parsers

app.use(express.json()); // For parsing application/json requests

app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded



// Cookie Parser

app.use(cookieParser());



// --- Route Imports and Usage ---

const userRoutes = require("./routes/user");

const appointmentRoutes = require("./routes/appointment");

const doctorRoutes = require("./routes/doctor");



app.use("/api/v1", userRoutes); // Typically, authentication routes go under a /auth or /user prefix

app.use("/api/appointments", appointmentRoutes);

app.use("/api/doctors", doctorRoutes);



// --- Health Check / Root Route ---

app.get("/", (req, res) => {

  res.send("Hello VK!! Your API is running."); // More descriptive

});



// --- Error Handling Middleware (Recommended) ---

// This catches errors from your routes and middleware, including CORS errors

app.use((err, req, res, next) => {

  console.error(err.stack); // Log the error stack for debugging



  if (err.message === 'Not allowed by CORS') {

    return res.status(403).json({

      success: false,

      message: 'Access denied: Not allowed by CORS policy.',

      error: err.message

    });

  }



  // Generic error for unhandled exceptions

  res.status(500).json({

    success: false,

    message: "Internal Server Error",

    error: err.message

  });

});



// --- Start Server (for local development) ---

app.listen(PORT, () => {

  console.log(✅ Server started successfully on http://localhost:${PORT});

});



// --- Serverless Handler Export ---

// This is for deployment to serverless platforms (like AWS Lambda via Serverless Framework)

module.exports.handler = serverless(app);
