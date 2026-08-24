import mongoose from 'mongoose';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const db = mongoose.connection;

export async function connectDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');
    return db;
  } catch (error) {
    console.warn('MongoDB unavailable. Continuing without a database connection.');
    console.warn(error);
    return db;
  }
}

db.on('error', console.error.bind(console, 'connection error:'));

export default db;
