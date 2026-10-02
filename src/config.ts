import dotenv from 'dotenv'

dotenv.config()

export const env = {
  PORT: process.env.PORT || 8000,
  // MONGODB_URI is set by the Vercel MongoDB Atlas integration; DATABASE_URL is used locally/Docker.
  DATABASE_URL: process.env.MONGODB_URI || process.env.DATABASE_URL || '',
  // Overrides the database in the URI path (e.g. Atlas integration URIs have none).
  DATABASE_NAME: process.env.DATABASE_NAME || undefined,
  TOKEN_SECRET: process.env.TOKEN_SECRET ?? '',
  ALLOW_CORS: process.env.ALLOW_CORS,
  NODE_ENV: process.env.NODE_ENV,
  CLOUD_NAME: process.env.CLOUD_NAME,
  CLOUD_API_KEY: process.env.CLOUD_API_KEY,
  CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
  EMAIL: process.env.EMAIL,
  MAILING_ID: process.env.MAILING_ID,
  MAILING_REFRESH: process.env.MAILING_REFRESH,
  MAILING_SECRET: process.env.MAILING_SECRET,
}
