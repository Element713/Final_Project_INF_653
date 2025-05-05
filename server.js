const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const app = express();
require('dotenv').config();
const State = require('./models/State');
console.log('State model loaded:', State);
const cors = require('cors');
app.use(cors());
// Connect to MongoDB
connectDB();
console.log("Server running")
// Middlewares
app.use(express.json()); // Built-in body parser


// API routes
const statesRoutes = require('./routes/states');
app.use('/states', statesRoutes);

// Route for root
app.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
  });

  // Static HTML landing page

app.use(express.static(path.join(__dirname, 'public')));

// Listen
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//404 handler catchall
app.all('*', (req, res) => {
  if (req.accepts('html')) {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.status(404).json({ error: '404 Not Found' });
  } else {
    res.status(404).type('txt').send('404 Not Found');
  }
});