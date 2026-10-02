import dotenv from 'dotenv'

dotenv.config()

export const env = {
  PORT: process.env.PORT || 8000,
  DATABASE_URL: process.env.DATABASE_URL ?? '',
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
