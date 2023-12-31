const mongoose = require('mongoose');

// Connection URI
const uri = 'mongodb+srv://Buxture:12345@buxter.lo3rrvl.mongodb.net/buxture-test';

// Connect to the MongoDB server
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

// Close the MongoDB connection when no longer needed
const closeMongoDBConnection = async () => {
  try {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error;
  }
};

// Export the functions
module.exports = {
  connectToMongoDB,
  closeMongoDBConnection,
};
