const express = require("express");
const router = express.Router();

const { sendOTP, signup, login } = require("../controllers/Auth");

console.log("reached inside routes");

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

const { authenticateUser } = require("../middleware/auth");

// Optionally protected route
router.get("/profile", authenticateUser, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
    message: "Access granted to protected route",
  });
});

module.exports = router;
