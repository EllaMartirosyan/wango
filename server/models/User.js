const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  fullName: String,
  address: String,
  carPlate: String,
  parkingSessions: [
    {
      cityName: { type: String, required: true },
      parkingAreaName: { type: String, required: true },
      startTime: { type: Date, required: true },
      endTime: Date,
      price: Number
    }
  ]
});

module.exports = mongoose.model('User', userSchema);