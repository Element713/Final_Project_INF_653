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



module.exports = router;

const express = require('express');
const router = express.Router();
const statesController = require('../controllers/statesController');

// Other GET routes...
router.get('/:state/funfact', statesController.getRandomFunFact);

module.exports = router;