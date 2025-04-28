const updateFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const { index, funfact } = req.body;

    // 1. Validate state code
    const validState = statesData.find(state => state.code === stateCode);
    if (!validState) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    // 2. Validate body
    if (!index) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }

    if (!funfact) {
        return res.status(400).json({ message: 'State fun fact value required' });
    }

    try {
        const mongoState = await State.findOne({ stateCode: stateCode }).exec();

        if (!mongoState || !mongoState.funfacts || mongoState.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${validState.state}` });
        }

        const adjustedIndex = index - 1; // because arrays are 0-based

        if (adjustedIndex < 0 || adjustedIndex >= mongoState.funfacts.length) {
            return res.status(400).json({ message: `No Fun Fact found at that index for ${validState.state}` });
        }

        // 3. Update the fun fact at the index
        mongoState.funfacts[adjustedIndex] = funfact;

        await mongoState.save();
        res.json(mongoState);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    addFunFact,
    updateFunFact
};
const deleteFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const { index } = req.body;

    // 1. Validate state code
    const validState = statesData.find(state => state.code === stateCode);
    if (!validState) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    // 2. Validate body
    if (!index) {
        return res.status(400).json({ message: 'State fun fact index value required' });
    }

    try {
        const mongoState = await State.findOne({ stateCode: stateCode }).exec();

        if (!mongoState || !mongoState.funfacts || mongoState.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${validState.state}` });
        }

        const adjustedIndex = index - 1; // because arrays are 0-based

        if (adjustedIndex < 0 || adjustedIndex >= mongoState.funfacts.length) {
            return res.status(400).json({ message: `No Fun Fact found at that index for ${validState.state}` });
        }

        // 3. Remove the fun fact
        mongoState.funfacts.splice(adjustedIndex, 1);

        await mongoState.save();
        res.json(mongoState);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
// GET all states (with optional contiguous filter)
const getAllStates = async (req, res) => {
    const contig = req.query.contig;

    let statesList = statesData;

    if (contig === 'true') {
        statesList = statesList.filter(state => state.code !== 'AK' && state.code !== 'HI');
    } else if (contig === 'false') {
        statesList = statesList.filter(state => state.code === 'AK' || state.code === 'HI');
    }

    try {
        const mongoStates = await State.find();
        const mergedStates = statesList.map(state => {
            const mongoState = mongoStates.find(ms => ms.stateCode === state.code);
            return mongoState
                ? { ...state, funfacts: mongoState.funfacts }
                : state;
        });

        res.json(mergedStates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// GET single state
const getState = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const validState = statesData.find(state => state.code === stateCode);

    if (!validState) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    try {
        const mongoState = await State.findOne({ stateCode: stateCode }).exec();
        const result = mongoState
            ? { ...validState, funfacts: mongoState.funfacts }
            : validState;

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// GET random fun fact
const getFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const validState = statesData.find(state => state.code === stateCode);

    if (!validState) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    try {
        const mongoState = await State.findOne({ stateCode: stateCode }).exec();
        if (!mongoState || !mongoState.funfacts || mongoState.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${validState.state}` });
        }

        const randomFact = mongoState.funfacts[Math.floor(Math.random() * mongoState.funfacts.length)];
        res.json({ funfact: randomFact });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// GET capital
const getCapital = (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const validState = statesData.find(state => state.code === stateCode);

    if (!validState) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    res.json({ state: validState.state, capital: validState.capital_city });
};

// GET nickname
const getNickname = (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const validState = statesData.find(state => state.code === stateCode);

    if (!validState) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    res.json({ state: validState.state, nickname: validState.nickname });
};

// GET population
const getPopulation = (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const validState = statesData.find(state => state.code === stateCode);

    if (!validState) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    res.json({ state: validState.state, population: validState.population });
};

// GET admission date
const getAdmission = (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const validState = statesData.find(state => state.code === stateCode);

    if (!validState) {
        return res.status(404).json({ message: 'Invalid state abbreviation parameter' });
    }

    res.json({ state: validState.state, admitted: validState.admission_date });
};