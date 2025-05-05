const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected'); // Log successful connection
    } catch (err) {
        console.error('MongoDB connection error:', err); // Log connection error
        process.exit(1); 
    }
};

module.exports = connectDB;