import { createTestClient } from "apollo-server-testing";
import createServer from "../apollo-server";

const server = createServer();

// TODO: FIX TYPES
function runTestCases(groupName: any, testCases: any) {
  const { query } = createTestClient(server);

  describe(`${groupName} resolvers`, () => {
    for (let testCase of testCases) {
      it(testCase.id, async () => {
        const res = await query({
          query: testCase.query,
          variables: testCase.variables || {},
        });
        expect(res).toMatchSnapshot();
      });
    }
  });
}

export default runTestCases;
