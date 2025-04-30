const State = require('../models/State');

// Controller to fetch all states from MongoDB
exports.getAllStates = async (req, res) => {
    try {
        const states = await State.find();  // Fetch all states
        res.json(states);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Controller to fetch a single state by state code
exports.getState = async (req, res) => {
    try {
        const state = await State.findOne({ stateCode: req.params.state.toUpperCase() });
        if (!state) {
            return res.status(404).json({ error: 'State not found' });
        }
        res.json(state);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Controller to fetch a random fun fact for a state
exports.getRandomFunFact = async (req, res) => {
    try {
        const state = await State.findOne({ stateCode: req.params.state.toUpperCase() });
        if (!state || !state.funfacts || state.funfacts.length === 0) {
            return res.status(404).json({ error: 'No fun facts found for this state' });
        }
        const randomFact = state.funfacts[Math.floor(Math.random() * state.funfacts.length)];
        res.json({ state: req.params.state, funfact: randomFact });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Controller to add a fun fact for a state
exports.addFunFact = async (req, res) => {
    const { funfacts } = req.body;  // Array of fun facts

    if (!funfacts || !Array.isArray(funfacts)) {
        return res.status(400).json({ error: 'Fun facts must be provided as an array' });
    }

    try {
        const state = await State.findOne({ stateCode: req.params.state.toUpperCase() });
        if (!state) {
            return res.status(404).json({ error: 'State not found' });
        }

        state.funfacts = [...state.funfacts, ...funfacts];  // Add new fun facts
        await state.save();
        res.json(state);  // Return updated state with fun facts
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Controller to update a specific fun fact for a state
exports.updateFunFact = async (req, res) => {
    const { index, funfact } = req.body;  // index of funfact to replace and the new fun fact

    if (!index || !funfact) {
        return res.status(400).json({ error: 'Index and fun fact are required' });
    }

    try {
        const state = await State.findOne({ stateCode: req.params.state.toUpperCase() });
        if (!state) {
            return res.status(404).json({ error: 'State not found' });
        }

        if (index < 1 || index > state.funfacts.length) {
            return res.status(400).json({ error: 'Invalid fun fact index' });
        }

        state.funfacts[index - 1] = funfact;  // Update the fun fact (1-based index)
        await state.save();
        res.json(state);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Controller to delete a fun fact from a state
exports.deleteFunFact = async (req, res) => {
    const { index } = req.body;  // index of fun fact to delete

    if (!index) {
        return res.status(400).json({ error: 'Index is required' });
    }

    try {
        const state = await State.findOne({ stateCode: req.params.state.toUpperCase() });
        if (!state) {
            return res.status(404).json({ error: 'State not found' });
        }

        if (index < 1 || index > state.funfacts.length) {
            return res.status(400).json({ error: 'Invalid fun fact index' });
        }

        state.funfacts.splice(index - 1, 1);  // Remove fun fact (1-based index)
        await state.save();
        res.json(state);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Basic hardcoded state info fallback (since not all info is in MongoDB)
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'models', 'statesData.json');
const allStatesData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Utility to get a state's base data
function getStateData(code) {
    return allStatesData.find(s => s.code === code.toUpperCase());
}

exports.getCapital = (req, res) => {
    const state = getStateData(req.params.state);
    if (!state) return res.status(404).json({ error: 'State not found' });
    res.json({ state: state.state, capital: state.capital });
};

exports.getNickname = (req, res) => {
    const state = getStateData(req.params.state);
    if (!state) return res.status(404).json({ error: 'State not found' });
    res.json({ state: state.state, nickname: state.nickname });
};

exports.getPopulation = (req, res) => {
    const state = getStateData(req.params.state);
    if (!state) return res.status(404).json({ error: 'State not found' });
    res.json({ state: state.state, population: state.population.toLocaleString() });
};

exports.getAdmission = (req, res) => {
    const state = getStateData(req.params.state);
    if (!state) return res.status(404).json({ error: 'State not found' });
    res.json({ state: state.state, admitted: state.admission_date });
};
