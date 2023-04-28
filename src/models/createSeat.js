const mongoose = require('mongoose')
const Schema = mongoose.Schema

const seatSchema = new Schema({
  seatNumber: { type: Number, required: true },
  rowNumber: { type: Number, required: true },
  isAvailable: { type: Boolean, required: true }
});

const Seat = mongoose.model('Seat', seatSchema)

module.exports = Seat
