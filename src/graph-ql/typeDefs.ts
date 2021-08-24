import { gql } from "apollo-server";

const typeDefs = gql`
  type PlayerSeasonTotals {
    goals_scored: Int!
    assists: Int!
    total_points: Int!
    minutes: Int!
    goals_conceded: Int!
    creativity: Float!
    influence: Float!
    threat: Float!
    bonus: Int!
    bps: Int!
    ict_index: Float!
    clean_sheets: Int!
    red_cards: Int!
    yellow_cards: Int!
    selected_by_percent: Float!
    now_cost: Int!
    element_type: String!
  }

  type Player {
    id: Int!
    first_name: String!
    second_name: String!
    player_season_totals: PlayerSeasonTotals!
  }

  type Query {
    players(ids: [Int!]): [Player]!
  }
`;

export default typeDefs;
