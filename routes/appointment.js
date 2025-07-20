const express = require("express");
const router = express.Router();
const { bookAppointment } = require("../controllers/Appointment");
const { authenticateUser } = require("../middleware/auth");

router.post("/book", authenticateUser, bookAppointment);

module.exports = router;
