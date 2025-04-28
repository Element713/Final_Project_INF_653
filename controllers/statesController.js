const State = require('../models/States');
const statesData = require('../data/statesData.json');

// Helper function to merge funfacts from MongoDB into static JSON
const mergeFunfacts = async (statesArray) => {
    const mongoStates = await State.find({}).exec();

    const mongoStateMap = {};
    mongoStates.forEach(state => {
        mongoStateMap[state.stateCode] = state.funfacts;
    });

    const mergedStates = statesArray.map(state => {
        const funfacts = mongoStateMap[state.code]; // Assuming stateData.json has a "code" field like "KS"
        if (funfacts) {
            return { ...state, funfacts };
        }
        return state;
    });

    return mergedStates;
};

// Controller function
const getAllStates = async (req, res) => {
    try {
        let statesArray = statesData;

        // handle ?contig=true or ?contig=false
        if (req.query.contig === 'true') {
            statesArray = statesArray.filter(state => state.code !== 'AK' && state.code !== 'HI');
        } else if (req.query.contig === 'false') {
            statesArray = statesArray.filter(state => state.code === 'AK' || state.code === 'HI');
        }

        const mergedStates = await mergeFunfacts(statesArray);

        res.json(mergedStates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAllStates
};