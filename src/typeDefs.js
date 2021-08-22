const { gql } = require("apollo-server");

const typeDefs = gql`
  type Player {
    id: Int
    name: String
  }

  type Query {
    players: [Player]
  }
`;

module.exports = typeDefs;
