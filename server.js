const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const app = express();
require('dotenv').config();
const State = require('./models/State');
console.log('State model loaded:', State);

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json()); // Built-in body parser

// Static HTML landing page
app.use('/', express.static(path.join(__dirname, '/public')));

// API routes
const statesRoutes = require('./routes/states');
app.use('/states', statesRoutes);

// Route for root
app.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
  });

// 404 Catch-all
// Catch-all 404 route for anything else
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
      res.json({ error: '404 Not Found' });
    } else {
      res.type('txt').send('404 Not Found');
    }
  });

// Listen
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));