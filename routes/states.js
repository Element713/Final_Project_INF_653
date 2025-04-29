const express = require('express');
const router = express.Router();  // Declare the router once
const fs = require('fs');
const path = require('path');
const statesController = require('../controllers/statesController');  // Import your controller

// File path to read the JSON data (assuming statesData.json is in the models folder)
const filePath = path.join(__dirname, '..', 'models', 'statesData.json');
let statesData = [];

try {
    const jsonString = fs.readFileSync(filePath, 'utf-8');
    statesData = JSON.parse(jsonString);
} catch (err) {
    console.error("An error occurred reading statesData:", err);
}

// Example route that sends all states data from the JSON file
router.get('/', (req, res) => {
    res.json(statesData);
});

// Route to fetch a specific state by state code (assuming data is coming from MongoDB)
router.get('/:state', async (req, res) => {
    try {
        const state = await State.findOne({ stateCode: req.params.state.toUpperCase() });
        if (!state) {
            return res.status(404).json({ error: 'State not found' });
        }
        res.json(state);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fun fact routes that use the statesController functions
router.get('/:state/funfact', statesController.getRandomFunFact);  // Get random fun fact for a state
router.post('/:state/funfact', statesController.addFunFact);  // Add a fun fact for a state
router.patch('/:state/funfact', statesController.updateFunFact);  // Update a fun fact for a state
router.delete('/:state/funfact', statesController.deleteFunFact);  // Delete a fun fact for a state

// Other state-related routes (capital, nickname, population, etc.)
router.get('/:state/capital', statesController.getCapital);  // Get capital for state
router.get('/:state/nickname', statesController.getNickname);  // Get nickname for state
router.get('/:state/population', statesController.getPopulation);  // Get population for state
router.get('/:state/admission', statesController.getAdmission);  // Get admission date for state

module.exports = router;
// This router can be used in your main server file to handle requests related to states
// Example usage in server.js:
// const statesRoutes = require('./routes/states');
// app.use('/states', statesRoutes);
// This will allow you to access the routes defined in this file under the /states path