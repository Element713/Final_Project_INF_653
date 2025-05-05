const express = require('express'); 
const router = express.Router();
const statesController = require('../controllers/statesController');
const path = require('path');


// State Info Routes

  // GET all states
  router.get('/', statesController.getAllStates);



// Fun Fact Routes


router.get('/:state/funfact', statesController.getRandomFunFact);
router.post('/:state/funfact', statesController.addFunFact);
router.patch('/:state/funfact', statesController.updateFunFact);
router.delete('/:state/funfact', statesController.deleteFunFact);


// Specific info Routes


router.get('/:state/capital', statesController.getCapital);
router.get('/:state/nickname', statesController.getNickname);
router.get('/:state/population', statesController.getPopulation);
router.get('/:state/admission', statesController.getAdmission);


// Get Full State Data
router.get('/:state', statesController.getState);

  
console.log("Router loaded") // Log successful connection

module.exports = router;