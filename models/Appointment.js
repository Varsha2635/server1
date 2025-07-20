const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  doctorId: { type: String, required: true }, // or you can use ObjectId if you store doctor profiles
  datetime: { type: Date, required: true },
  status: { type: String, enum: ["pending", "confirmed"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
