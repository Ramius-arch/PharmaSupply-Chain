const mongoose = require('mongoose');

// Function to connect to MongoDB database with pooling and retry logic
const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.MONGODB_URI;

  if (isProduction && !process.env.MONGODB_URI) {
    console.error('CRITICAL: MONGODB_URI not found in production environment.');
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pharmasupply';

  // Resilient connection pooling options for production MongoDB Atlas/Neon/etc.
  const options = {
    maxPoolSize: 10,
    minPoolSize: 2,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 15000, // Wait up to 15s to discover DB server
    heartbeatFrequencyMS: 10000
  };

  let retries = 5;
  while (retries > 0) {
    try {
      await mongoose.connect(uri, options);
      console.log('Connected to MongoDB successfully!');
      break;
    } catch (error) {
      retries -= 1;
      console.error(`MongoDB connection failed. Retries left: ${retries}. Error:`, error.message);
      
      if (retries === 0) {
        console.error('CRITICAL: Could not establish connection to MongoDB after multiple retries. Exiting...');
        process.exit(1);
      }
      
      // Exponential backoff delay (e.g. 1s, 2s, 4s, 8s...)
      const delay = Math.pow(2, 5 - retries) * 1000;
      console.log(`Retrying MongoDB connection in ${delay / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

module.exports = connectDB;