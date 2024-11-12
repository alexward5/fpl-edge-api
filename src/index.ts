require("dotenv").config();
import createServer from "./apollo-server";
import { startStandaloneServer } from '@apollo/server/standalone';

const server = createServer();

startStandaloneServer(server).then(({ url }: { url: string }) => {
  console.log(`Server listening at ${url}`);
});
