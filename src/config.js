import dotenv from "dotenv";
dotenv.config();

export const {
  APP_PORT = 4000,
  NODE_ENV = "development",
  DB_USERNAME = "",
  DB_PASSWORD = "",
  DB_HOST = "localhost",
  DB_PORT = 27017,
  DB_NAME = "chat",
  SESS_NAME = "sid",
  SESS_SECRET = "53CRE7",
  SESS_LIFETIME = 7200000,
  REDIS_HOST = "localhost",
  REDIS_PORT = 6379,
  REDIS_PASSWORD = "",
} = process.env;

export const PRODUCTION = NODE_ENV === "production";
