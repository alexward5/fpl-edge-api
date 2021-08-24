import { gql } from "apollo-server";

const typeDefs = gql`
  type Player {
    id: Int
    name: String
  }

  type Query {
    players: [Player]
  }
`;

export default typeDefs;
