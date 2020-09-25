import { MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { COOKIE_NAME } from './constants';
// import { Post } from './entities/Post';
import microConfig from './mikro-orm.config';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import { MyContext } from './types';
// import { sendEmail } from './utils/sendEmail';  // use to generate new user/pwd from nodemailer

const main = async () => {
  // sendEmail('bob@bob.com', 'yo dude');
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: 'lax' // csrf setup - google this
        // secure: __prod__ // Cookie only works with https! careful
      },
      saveUninitialized: false,
      secret: 'kajsjdiasdjaksfj45678', // ToDo:setup-dotenv-etc
      resave: false
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false
    }),
    context: ({ req, res }): MyContext => ({
      em: orm.em,
      req: req as MyContext['req'],
      redis,
      res
    })
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4444, () => {
    console.log('Server started on localhost:4444');
  });
};

main().catch((err) => {
  console.error(err);
});
