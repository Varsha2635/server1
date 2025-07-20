const Appointment = require("../models/Appointment");

// @route   POST /api/appointments/book
// @desc    Book an appointment
// @access  Private
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, datetime } = req.body;

    if (!doctorId || !datetime) {
      return res.status(400).json({ success: false, message: "Missing doctorId or datetime" });
    }

    const appointment = await Appointment.create({
      userId: req.user.id,
      doctorId,
      datetime,
    });

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Booking failed", error: error.message });
  }
};
