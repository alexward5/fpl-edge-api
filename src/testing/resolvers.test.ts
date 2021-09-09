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
];

runTestCases("Players", testCases);
