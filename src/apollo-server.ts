import { ApolloServer } from 'apollo-server';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { create } from 'ts-node';

const createServer = () => {
  return new ApolloServer({ typeDefs, resolvers });
};

export default createServer;