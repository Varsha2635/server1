const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  location: { type: String, required: true },
  phone: { type: String, required: true },
  rating: { type: Number, default: 4.5 }
}, { timestamps: true });

module.exports = mongoose.model("Doctor", doctorSchema);
