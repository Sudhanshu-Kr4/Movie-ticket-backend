const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  seatsAvailable: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Number, required: true },
  showtime : { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
  
  
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);