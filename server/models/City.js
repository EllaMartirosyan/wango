const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: String,
  parkingAreas: [
    {
      name: String,
      priceCalculation: {
        type: String,
        rates: [
          {
            from: String,
            to: String,
            price: Number
          }
        ]
      }
    }
  ]
});

module.exports = mongoose.model('City', citySchema);