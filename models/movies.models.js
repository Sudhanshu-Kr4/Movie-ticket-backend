const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genre: { type: String, required: true },
  duration: { type: Number, required: true },
  poster : {type: String, required :true},
  showtimes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Showtime' }]
  
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);