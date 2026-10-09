import mongoose from 'mongoose';
import { appConfig } from './app.config.js';

export async function connectDatabase() {
  if (!appConfig.mongoURI) {
    console.warn('MONGODB_URI is not configured; history and account persistence are unavailable.');
    return false;
  }
  await mongoose.connect(appConfig.mongoURI);
  console.log('Connected to MongoDB.');
  return true;
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}
