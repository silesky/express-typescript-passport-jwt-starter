import mongoose from 'mongoose';

export const mongooseConnect = async (connectionString: string) => {
  return mongoose.connect(connectionString, {
    // throw error quickly if mongo cannot connect
    connectTimeoutMS: 500,
    serverSelectionTimeoutMS: 500,
    socketTimeoutMS: 500,
  });
};
