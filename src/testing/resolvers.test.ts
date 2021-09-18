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
    id: "getPlayerSeasonTotals",
    query: `
      query ($ids: [Int!]) {
        players (ids: $ids) {
          id
          first_name
          second_name
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
];

runTestCases("PlayerData", testCases);
