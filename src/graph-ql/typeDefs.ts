import { gql } from "apollo-server";

const typeDefs = gql`
  type Player {
    id: Int
    first_name: String
    second_name: String
  }

  type Query {
    players: [Player]
  }
`;

export default typeDefs;
