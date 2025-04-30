// Dependencies
const fs = require('fs');
const path = require('path');
const State = require('../models/State');

const dataPath = path.join(__dirname, '..', 'models', 'statesData.json');
const allStatesData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
const statesData = require('../models/statesData.json');

// Utility to get static state data
const getStateData = (code) => allStatesData.find(s => s.code === code.toUpperCase());
const findStateData = (code) => statesData.find(s => s.code.toUpperCase() === code.toUpperCase());

/* ===============================
   GET HANDLERS
=============================== */

// GET all states (with optional contig filter)
exports.getAllStates = async (req, res) => {
  try {
    const states = await State.find();
    const contigQuery = req.query.contig;

    let filteredStates = states;

    if (contigQuery === 'true') {
      filteredStates = states.filter(state => state.stateCode !== 'AK' && state.stateCode !== 'HI');
    } else if (contigQuery === 'false') {
      filteredStates = states.filter(state => state.stateCode === 'AK' || state.stateCode === 'HI');
    }

    res.json(filteredStates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET a single state
exports.getState = async (req, res) => {
  try {
    const state = await State.findOne({ stateCode: req.params.state.toUpperCase() });
    if (!state) return res.status(404).json({ error: 'State not found' });
    res.json(state);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET random fun fact
exports.getRandomFunFact = async (req, res) => {
  try {
    const state = await State.findOne({ stateCode: req.params.state.toUpperCase() });
    if (!state || !state.funfacts?.length) {
      return res.status(404).json({ message: `No Fun Facts found for ${getStateData(req.params.state)?.state || 'this state'}` });
    }
    const randomFact = state.funfacts[Math.floor(Math.random() * state.funfacts.length)];
    res.json({ funfact: randomFact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

// POST funfacts
exports.addFunFact = async (req, res) => {
  const { funfacts } = req.body;

  if (!funfacts) return res.status(400).json({ message: 'State fun facts value required' });
  if (!Array.isArray(funfacts)) return res.status(400).json({ message: 'State fun facts value must be an array' });

  try {
    const state = await State.findOne({ stateCode: req.params.state.toUpperCase() });
    if (!state) return res.status(404).json({ message: 'State not found' });

    state.funfacts = [...(state.funfacts || []), ...funfacts];
    await state.save();
    res.json(state);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ===============================
   PATCH HANDLERS
=============================== */

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

/* ===============================
   DELETE HANDLERS
=============================== */

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