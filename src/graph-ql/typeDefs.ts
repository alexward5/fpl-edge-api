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

  type PlayerGameweekData {
    position: String!
    xp: Float!
    assists: Int!
    bonus: Int!
    bps: Int!
    clean_sheets: Int!
    fixture: Int!
    goals_conceded: Int!
    goals_scored: Int!
    ict_index: Float!
    influence: Float!
    creativity: Float!
    threat: Float!
    kickoff_time: String!
    minutes: Int!
    opponent_team: Int!
    own_goals: Int!
    penalties_missed: Int!
    saves: Int!
    penalties_saved: Int!
    yellow_cards: Int!
    red_cards: Int!
    round: Int!
    selected: Int!
    team_a_score: String
    team_h_score: String!
    total_points: Int!
    value: Int!
    was_home: Boolean!
  }

  type Player {
    id: Int!
    first_name: String!
    second_name: String!
    player_season_totals: PlayerSeasonTotals!
    player_gameweek_data(
      gameweekStart: Int
      gameweekEnd: Int
    ): [PlayerGameweekData!]!
  }

  type Query {
    players(ids: [Int!]): [Player]!
  }
`;

export default typeDefs;
