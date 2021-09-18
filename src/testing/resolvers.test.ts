require("dotenv").config();
import runTestCases from "./test-runner";

const testCases = [
  {
    id: "getPlayersMetadata",
    query: `
      query {
        players {
          id
          first_name
          second_name
        }
      }
    `,
  },
  {
    id: "getPlayersById",
    query: `
      query ($ids: [Int!]) {
        players (ids: $ids) {
          id
          first_name
          second_name
        }
      }
    `,
    variables: {
      ids: [1, 2, 3],
    },
  },
  {
    id: "getPlayersSeasonTotals",
    query: `
      query ($ids: [Int!]) {
        players (ids: $ids) {
          player_season_totals {
            goals_scored
            assists
            total_points
            minutes
            goals_conceded
            creativity
            influence
            threat
            bonus
            bps
            ict_index
            clean_sheets
            red_cards
            yellow_cards
            selected_by_percent
            now_cost
            element_type
          }
        }
      }
    `,
    variables: {
      ids: [1, 2, 3],
    },
  },
  {
    id: "getPlayersGameweekData",
    query: `
      query ($ids: [Int!]) {
        players (ids: $ids) {
          player_gameweek_data {
            position
            xp
            assists
            bonus
            bps
            clean_sheets
            fixture
            goals_conceded
            goals_scored
            ict_index
            influence
            creativity
            threat
            kickoff_time
            minutes
            opponent_team
            own_goals
            penalties_missed
            saves
            penalties_saved
            yellow_cards
            red_cards
            round
            selected
            team_a_score
            team_h_score
            total_points
            value
            was_home
          }
        }
      }
    `,
    variables: {
      ids: [1, 2, 3],
    },
  },
];

runTestCases("PlayerData", testCases);
