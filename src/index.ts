require("dotenv").config();
import createServer from './apollo-server';

const server = createServer();

server.listen().then(({ url }) => {
  console.log(`Server listening at ${url}`);
});
