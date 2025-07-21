const express = require("express");
const router = express.Router();
const cors= require("cors");
const { sendOTP, signup, login } = require("../controllers/Auth");
const { authenticateUser } = require("../middleware/auth");
const app=express();
app.use(cors());

// Routes
router.options('/send-otp', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'https://resilient-bienenstitch-4f77d0.netlify.app');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
});
router.post("/send-otp", sendOTP);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

// Optionally protected route
router.get("/profile", authenticateUser, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
    message: "Access granted to protected route",
  });
});

module.exports = router;
