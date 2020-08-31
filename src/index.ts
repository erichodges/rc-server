import { MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';
// import { Post } from './entities/Post';
import microConfig from './mikro-orm.config';
import { HelloResolver } from './resolvers/hello';

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false
    })
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4444, () => {
    console.log('Server started on localhost:4000');
  });

  // const post = orm.em.create(Post, { title: 'test post' });
  // await orm.em.persistAndFlush(post);
};

main().catch((err) => {
  console.error(err);
});
