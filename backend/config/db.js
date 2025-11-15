const mongoose = require('mongoose');

// Cache the Mongoose connection and promise over serverless function invocations.
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('FATAL ERROR: MONGO_URI is not defined.');
    throw new Error('FATAL ERROR: MONGO_URI is not defined in your environment variables.');
  }

  // If we have a cached connection, return it.
  if (cached.conn) {
    console.log('Using cached MongoDB connection.');
    return cached.conn;
  }

  // If there's no promise, create one.
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable Mongoose's buffering.
      serverSelectionTimeoutMS: 5000, // Fail fast if connection is not established in 5s
    };
    
    console.log('Attempting to create new MongoDB connection...');
    cached.promise = mongoose.connect(mongoURI, opts).then((mongooseInstance) => {
      console.log('MongoDB connection established successfully.');
      return mongooseInstance;
    });
  }

  // Await the promise to resolve, which will give us the connection.
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // If the connection fails, nullify the promise so a new attempt can be made.
    cached.promise = null;
    console.error('MongoDB connection promise failed:', e); // Log the specific connection error
    throw e;
  }
  
  return cached.conn;
};

module.exports = { connectDB };