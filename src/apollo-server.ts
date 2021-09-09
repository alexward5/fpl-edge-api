import { ApolloServer } from "apollo-server";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";

const createServer = (): any => {
  return new ApolloServer({ typeDefs, resolvers });
};

export default createServer;
