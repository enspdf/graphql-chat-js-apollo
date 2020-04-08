import mongoose from "mongoose";
import express from "express";
import session from "express-session";
import redis from "redis";
import connectRedis from "connect-redis";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import {
  APP_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  SESS_NAME,
  SESS_SECRET,
  SESS_LIFETIME,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  PRODUCTION,
} from "./config";
import schemaDirectives from "./directives";

(async () => {
  try {
    await mongoose.connect(
      `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
      /*PRODUCTION
        ? `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
        : `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`,*/
      {
        useNewUrlParser: true,
      }
    );

    const app = express();

    app.disable("x-powered-by");

    const RedisStore = connectRedis(session);

    const store = new RedisStore({
      client: redis.createClient({
        host: REDIS_HOST,
        port: REDIS_PORT,
        password: REDIS_PASSWORD,
      }),
    });

    app.use(
      session({
        store,
        name: SESS_NAME,
        secret: SESS_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: Number(SESS_LIFETIME),
          sameSite: true,
          secure: PRODUCTION,
        },
      })
    );

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      schemaDirectives,
      playground: PRODUCTION
        ? false
        : {
            settings: {
              "request.credentials": "include",
            },
          },
      context: ({ req, res }) => ({ req, res }),
    });

    server.applyMiddleware({ app, cors: false });

    app.listen({ port: APP_PORT }, () =>
      console.log(`http://localhost:${APP_PORT}${server.graphqlPath}`)
    );
  } catch (e) {
    console.error(e);
  }
})();
