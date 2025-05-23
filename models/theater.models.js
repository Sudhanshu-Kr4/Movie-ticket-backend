const mongoose = require("mongoose");

const theaterSchema = new mongoose.Schema({
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  name: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  
}, { timestamps: true });

module.exports = mongoose.model('Theater', theaterSchema);