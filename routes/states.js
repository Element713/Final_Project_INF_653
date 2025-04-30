const express = require('express'); 
const router = express.Router();
const fs = require('fs');
const path = require('path');
const statesController = require('../controllers/statesController');

const State = require('../models/State');

const filePath = path.join(__dirname, '..', 'models', 'statesData.json');
let statesData = [];

try {
    const jsonString = fs.readFileSync(filePath, 'utf-8');
    statesData = JSON.parse(jsonString);
} catch (err) {
    console.error("An error occurred reading statesData:", err);
}

// Route that sends all states data
router.get('/', (req, res) => {
    res.json(statesData);
});

// Fun fact routes
router.get('/:state/funfact', statesController.getRandomFunFact);
router.post('/:state/funfact', statesController.addFunFact);
router.patch('/:state/funfact', statesController.updateFunFact);
router.delete('/:state/funfact', statesController.deleteFunFact);

// Other state info routes
router.get('/:state/capital', statesController.getCapital);
router.get('/:state/nickname', statesController.getNickname);
router.get('/:state/population', statesController.getPopulation);
router.get('/:state/admission', statesController.getAdmission);

// General state lookup (must come LAST)
router.get('/:state', async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const stateFromFile = statesData.find(s => s.code === stateCode);

    if (!stateFromFile) {
        return res.status(404).json({ error: 'State not found' });
    }

    try {
        const stateFromDB = await State.findOne({ stateCode });
        const combinedState = {
            ...stateFromFile,
            funfacts: stateFromDB?.funfacts || []
        };
        res.json(combinedState);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;