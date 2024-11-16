const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const parkingRoutes = require('./routes/parking');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/wangoDB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', parkingRoutes);

// Start the server (only when not testing)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app; // Export the app for testing