import createServer from "../apollo-server";
import pool from "../pg";
import type ResolverTestCase from "../types/ResolverTestCase";

const server = createServer();

async function runTestCases(groupName: string, testCases: ResolverTestCase[]) {
  // Test resolver functions using queries defined in resolvers.tests.ts
  // The response from each query is compared to the existing snapshot
  describe(`${groupName} resolvers`, () => {
    testCases.forEach((testCase) => {
      it(testCase.id, async () => {
        const res = await server.executeOperation({
          query: testCase.query,
          variables: testCase.variables || {},
        });
        expect(res).toMatchSnapshot();
      });
    });
  });

  // Cleanup
  afterAll(() => {
    pool.end();
  });
}

export default runTestCases;
