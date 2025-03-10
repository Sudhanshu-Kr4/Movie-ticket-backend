const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
  startTime: { type: Date, required: true },
  seatsAvailable: { type: Number, required: true },
  price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Showtime', showtimeSchema);

