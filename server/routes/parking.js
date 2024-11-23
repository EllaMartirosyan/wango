const express = require('express');
const User = require('../models/User');
const City = require('../models/City');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { email, fullName, address, carPlate } = req.body;
  const user = new User({ email, fullName, address, carPlate });
  await user.save();
  res.status(201).send(user);
});

// Login
router.post('/login', async (req, res) => {
  const { email, carPlate } = req.body;
  const user = await User.findOne({ email, carPlate });
  if (!user) return res.status(404).send('User not found');
  res.send(user);
});

// Get All Cities
router.get('/cities', async (req, res) => {
  try {
    const cities = await City.find();
    res.send(cities);
  } catch (error) {
    res.status(500).send('Error retrieving cities.');
  }
});

// Start Parking
router.post('/start-parking', async (req, res) => {
  const { email, cityName, parkingAreaName } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send('User not found');

  const startTime = new Date();
  user.parkingSessions.push({ cityName, parkingAreaName, startTime });
  await user.save();
  res.send({ message: 'Parking started', startTime });
});

// Stop Parking
router.post('/stop-parking', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.parkingSessions.length === 0) return res.status(404).send('No active parking session.');

  const lastSession = user.parkingSessions[user.parkingSessions.length - 1];
  lastSession.endTime = new Date();

  // Fetch the city and find the relevant parking area
  const city = await City.findOne({ name: lastSession.cityName }).lean();
  if (!city) return res.status(404).send('City not found.');

  // Find the parking area within the city's parkingAreas
  const parkingArea = city.parkingAreas.find(area => area.name === lastSession.parkingAreaName);
  if (!parkingArea) return res.status(404).send('Parking area not found.');

  const priceCalculation = parkingArea.priceCalculation;
  if (!priceCalculation) return res.status(404).send('Price rates not found.');

  // Calculate price based on the logic in priceCalculation
  const price = calculatePrice(priceCalculation, lastSession.startTime, lastSession.endTime);

  lastSession.price = price;
  await user.save();
  res.send({ message: 'Parking stopped', price });
});

// Get All Parking for User
router.get('/parking', async (req, res) => {
  const { email } = req.query;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send('User not found');
  res.send(user.parkingSessions);
});

// Price Calculation Logic
function calculatePrice(priceCalculation, startTime, endTime) {
  let price = 0;
  const totalDuration = (endTime - startTime) / (1000 * 60 * 60); // total duration in hours

  switch (priceCalculation.type) {
    case 'hourly':
      price = totalDuration * priceCalculation.rates[0].price; // Assuming only one rate for hourly
      break;

    case 'time-based':
      const startHour = startTime.getHours();
      const endHour = endTime.getHours();
      const startMinutes = startTime.getMinutes();
      const endMinutes = endTime.getMinutes();

      // Calculate total price based on rates
      priceCalculation.rates.forEach(rate => {
        let rateStart = parseTime(rate.from);
        let rateEnd = parseTime(rate.to);
        let currentStart = Math.max(rateStart, startHour * 60 + startMinutes);
        let currentEnd = Math.min(rateEnd, endHour * 60 + endMinutes);

        if (currentStart < currentEnd) {
          const duration = (currentEnd - currentStart) / 60; // duration in hours
          price += duration * rate.price;
        }
      });
      break;

    default:
      throw new Error('Invalid pricing type');
  }
  
  return price;
}

// Helper function to convert time strings to minutes
function parseTime(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes; // Convert to total minutes
}

module.exports = router;