// Dependencies
const path = require('path');
const fs = require('fs');

const dataPath = path.join(__dirname, '..', 'models', 'statesData.json');
const statesData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Utility to get state by code
const getStateData = (code) => statesData.find(s => s.code.toUpperCase() === code.toUpperCase());

/* ===============================
   GET HANDLERS
=============================== */

// GET all states (with optional contig filter)
exports.getAllStates = (req, res) => {
  const contigQuery = req.query.contig;
  let filteredStates = [...statesData];

  if (contigQuery === 'true') {
    filteredStates = filteredStates.filter(state => state.code !== 'AK' && state.code !== 'HI');
  } else if (contigQuery === 'false') {
    filteredStates = filteredStates.filter(state => state.code === 'AK' || state.code === 'HI');
  }

  res.json(filteredStates);
};

// GET a single state
exports.getState = (req, res) => {
  const state = getStateData(req.params.state);
  if (!state) return res.status(404).json({ error: 'State not found' });
  res.json(state);
};

// GET random fun fact
exports.getRandomFunFact = (req, res) => {
  const state = getStateData(req.params.state);
  if (!state || !state.funfacts || state.funfacts.length === 0) {
    return res.status(404).json({ message: `No Fun Facts found for ${state?.state || 'this state'}` });
  }
  const randomFact = state.funfacts[Math.floor(Math.random() * state.funfacts.length)];
  res.json({ funfact: randomFact });
};

// GET capital
exports.getCapital = (req, res) => {
  const state = getStateData(req.params.state);
  if (!state) return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
  res.json({ state: state.state, capital: state.capital });
};

// GET nickname
exports.getNickname = (req, res) => {
  const state = getStateData(req.params.state);
  if (!state) return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
  res.json({ state: state.state, nickname: state.nickname });
};

// GET population
exports.getPopulation = (req, res) => {
  const state = getStateData(req.params.state);
  if (!state) return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
  res.json({ state: state.state, population: state.population.toLocaleString() });
};

// GET admission
exports.getAdmission = (req, res) => {
  const state = getStateData(req.params.state);
  if (!state) return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
  res.json({ state: state.state, admitted: state.admission_date });
};

/* ===============================
   POST HANDLERS
=============================== */

// POST funfacts (TEMPORARY: modifies in-memory only)
exports.addFunFact = (req, res) => {
  const { funfacts } = req.body;
  const state = getStateData(req.params.state);

  if (!funfacts) return res.status(400).json({ message: 'State fun facts value required' });
  if (!Array.isArray(funfacts)) return res.status(400).json({ message: 'State fun facts value must be an array' });
  if (!state) return res.status(404).json({ message: 'State not found' });

  state.funfacts = [...(state.funfacts || []), ...funfacts];
  res.json(state);
};

/* ===============================
   PATCH HANDLERS
=============================== */

// PATCH funfact (in-memory only)
exports.updateFunFact = (req, res) => {
  const { index, funfact } = req.body;
  const state = getStateData(req.params.state);

  if (!index) return res.status(400).json({ message: 'State fun fact index value required' });
  if (!funfact) return res.status(400).json({ message: 'State fun fact value required' });
  if (!state || !state.funfacts?.length) {
    return res.status(404).json({ message: `No Fun Facts found for ${state?.state || 'this state'}` });
  }
  if (index < 1 || index > state.funfacts.length) {
    return res.status(400).json({ message: `No Fun Fact found at that index for ${state.state}` });
  }

  state.funfacts[index - 1] = funfact;
  res.json(state);
};

/* ===============================
   DELETE HANDLERS
=============================== */

// DELETE funfact (in-memory only)
exports.deleteFunFact = (req, res) => {
  const { index } = req.body;
  const state = getStateData(req.params.state);

  if (!index) return res.status(400).json({ message: 'State fun fact index value required' });
  if (!state || !state.funfacts?.length) {
    return res.status(404).json({ message: `No Fun Facts found for ${state?.state || 'this state'}` });
  }
  if (index < 1 || index > state.funfacts.length) {
    return res.status(400).json({ message: `No Fun Fact found at that index for ${state.state}` });
  }

  state.funfacts.splice(index - 1, 1);
  res.json(state);
};