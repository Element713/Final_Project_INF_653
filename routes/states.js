// routes/states.js
const express = require('express');
const router = express.Router();
const statesController = require('../controllers/statesController');

router.route('/')
    .get(statesController.getAllStates);

// You'll add more routes here later like /:state, /:state/funfact, etc.

const express = require('express');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'models', 'statesData.json');

let statesData = [];

try {
    const jsonString = fs.readFileSync(filePath, 'utf-8');
    statesData = JSON.parse(jsonString);
} catch (err) {
    console.error("An error occurred reading statesData:", err);
}

// Example route that sends all states data
router.get('/', (req, res) => {
    res.json(statesData);
});


router.post('/:state/funfact', statesController.addFunFact);

const express = require('express');
const statesController = require('../controllers/statesController');

// Other GET routes...
router.get('/:state/funfact', statesController.getRandomFunFact);
router.patch('/:state/funfact', statesController.updateFunFact);
router.delete('/:state/funfact', statesController.deleteFunFact);

router.get('/', statesController.getAllStates);
router.get('/:state', statesController.getState);
router.get('/:state/funfact', statesController.getFunFact);
router.get('/:state/capital', statesController.getCapital);
router.get('/:state/nickname', statesController.getNickname);
router.get('/:state/population', statesController.getPopulation);
router.get('/:state/admission', statesController.getAdmission);

router.post('/:state/funfact', statesController.addFunFact);
router.patch('/:state/funfact', statesController.updateFunFact);
router.delete('/:state/funfact', statesController.deleteFunFact);

module.exports = router;
