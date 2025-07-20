const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");

// GET /api/doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find().select("-__v").limit(20);
    res.json({ success: true, doctors });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load doctors" });
  }
});

module.exports = router;
