// middleware/handleError.js
const handleError = (err, req, res, next) => {
    console.error('💥 Error:', err.stack);
    res.status(err.status || 500).json({ error: err.message || 'Server Error' });
  };
  
  module.exports = handleError;