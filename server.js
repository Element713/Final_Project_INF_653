require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection failed:', err));

// Middlewares
app.use(express.json()); // Built-in body parser

// Static HTML landing page
app.use('/', express.static(path.join(__dirname, '/public')));

// API routes
const statesRoutes = require('./routes/states');
app.use('/states', statesRoutes);

// 404 Catch-all
app.all('*', (req, res) => {
    if (req.accepts('html')) {
        res.status(404).sendFile(path.join(__dirname, '/public/404.html'));
    } else if (req.accepts('json')) {
        res.status(404).json({ error: '404 Not Found' });
    } else {
        res.status(404).type('txt').send('404 Not Found');
    }
});

// Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));