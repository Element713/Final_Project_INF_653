// Dependencies
const fs = require('fs');
const path = require('path');
const State = require('../models/State');

const dataPath = path.join(__dirname, '..', 'models', 'statesData.json');
const allStatesData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
const statesData = require('../models/statesData.json');

//  static state data
const getStateData = (code) => allStatesData.find(s => s.code === code.toUpperCase());
const findStateData = (code) => statesData.find(s => s.code.toUpperCase() === code.toUpperCase());


   //GET HANDLERS

exports.getAllStates = async (req, res) => {
  const contigQuery = req.query.contig;
  let filteredStates = [...statesData];

  if (contigQuery === 'true') {
    filteredStates = filteredStates.filter(state => state.code !== 'AK' && state.code !== 'HI');
  } else if (contigQuery === 'false') {
    filteredStates = filteredStates.filter(state => state.code === 'AK' || state.code === 'HI');
  }

  // Load from Mongo
  const mongoStates = await State.find();
  const funFactsMap = {};
  mongoStates.forEach(s => {
    funFactsMap[s.stateCode] = s.funfacts;
  });

  // Merge funfacts into each state
  const result = filteredStates.map(state => {
    return {
      ...state,
      ...(funFactsMap[state.code] ? { funfacts: funFactsMap[state.code] } : {})
    };
  });

  res.json(result);
};

// GET - single state
exports.getState = async (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const staticData = getStateData(stateCode);

  if (!staticData) {
    return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
  }

  try {
    const mongoState = await State.findOne({ stateCode });
    const result = {
      ...staticData,
      ...(mongoState?.funfacts?.length ? { funfacts: mongoState.funfacts } : {})
    };
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET - random fun fact
exports.getRandomFunFact = async (req, res) => {
  const stateCode = req.params.state.toUpperCase();

  const staticData = getStateData(stateCode);
  if (!staticData) {
    return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  }

  try {
    const state = await State.findOne({ stateCode });

    if (!state || !state.funfacts?.length) {
      return res.status(404).json({ message: `No Fun Facts found for ${staticData.state}` });
    }

    const randomFact = state.funfacts[Math.floor(Math.random() * state.funfacts.length)];
    res.json({ funfact: randomFact });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET capital
exports.getCapital = (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const state = getStateData(stateCode);

  if (!state) {
    return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  }

  res.json({
    state: state.state,
    capital: state.capital_city
  });
};


// GET nickname
exports.getNickname = (req, res) => {
  const state = getStateData(req.params.state);
  if (!state) return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
  res.json({ state: state.state, nickname: state.nickname });
};

// GET population
exports.getPopulation = (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const state = getStateData(stateCode);

  if (!state) {
    return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  }

  res.json({
    state: state.state,
    population: state.population.toLocaleString()
  });
};

// GET admission
exports.getAdmission = (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const state = getStateData(stateCode);

  if (!state) {
    return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  }

  res.json({
    state: state.state,
    admitted: state.admission_date
  });
};

//POST HANDLERS


// POST funfacts
exports.addFunFact = async (req, res) => {
  console.log('🛬 POST /:state/funfact hit');
  console.log('Body:', req.body);
  console.log('Param state:', req.params.state);

  const { funfacts } = req.body;
  const stateCode = req.params.state.toUpperCase();

  if (!funfacts) return res.status(400).json({ message: 'State fun facts value required' });
  if (!Array.isArray(funfacts)) return res.status(400).json({ message: 'State fun facts value must be an array' });

  try {
    let state = await State.findOne({ stateCode });

    if (state) {
      state.funfacts = [...(state.funfacts || []), ...funfacts];
    } else {
      state = new State({ stateCode, funfacts });
    }

    await state.save();
    res.json(state);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//PATCH HANDLERS


// PATCH funfact
exports.updateFunFact = async (req, res) => {
  const { index, funfact } = req.body;

  if (!index) return res.status(400).json({ message: 'State fun fact index value required' });
  if (!funfact) return res.status(400).json({ message: 'State fun fact value required' });

  try {
    const state = await State.findOne({ stateCode: req.params.state.toUpperCase() });
    if (!state || !state.funfacts?.length) {
      return res.status(404).json({ message: `No Fun Facts found for ${getStateData(req.params.state)?.state || 'this state'}` });
    }

    if (index < 1 || index > state.funfacts.length) {
      return res.status(400).json({ message: `No Fun Fact found at that index for ${getStateData(req.params.state)?.state}` });
    }

    state.funfacts[index - 1] = funfact;
    await state.save();
    res.json(state);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


   //DELETE HANDLERS


// DELETE funfact
exports.deleteFunFact = async (req, res) => {
  const { index } = req.body;

  if (!index) return res.status(400).json({ message: 'State fun fact index value required' });

  try {
    const state = await State.findOne({ stateCode: req.params.state.toUpperCase() });
    if (!state || !state.funfacts?.length) {
      return res.status(404).json({ message: `No Fun Facts found for ${getStateData(req.params.state)?.state || 'this state'}` });
    }

    if (index < 1 || index > state.funfacts.length) {
      return res.status(400).json({ message: `No Fun Fact found at that index for ${getStateData(req.params.state)?.state}` });
    }

    state.funfacts.splice(index - 1, 1);
    await state.save();
    res.json(state);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};