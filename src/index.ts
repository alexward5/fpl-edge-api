require("dotenv").config();
import { ApolloServer } from "apollo-server";
import typeDefs from "./graph-ql/typeDefs";
import resolvers from "./graph-ql/resolvers";

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server listening at ${url}`);
});
