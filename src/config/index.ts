import dotenv from 'dotenv-flow';
dotenv.config();

// do not expose environment variables directly; add sensible defaults here
export const config = {
  isProduction: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT ?? 4000),
  mongoDbConnectionString:
    process.env.MONGODB_CONNECTION_STRING ?? 'mongodb://127.0.0.1/my_database',
  getPrivateKey: () => 'abcd123', // this is just an example
};
