import pool from "../pg";
import type Player from "../types/Player";

const SCHEMA = "test_schema";

const resolvers = {
  Query: {
    players: async (parent: undefined, { ids }: { ids: [number] }) => {
      const { rows } = await pool.query(`
        SELECT * FROM "${SCHEMA}".player_metadata
        ${ids?.length ? `WHERE id IN (${ids.join(", ")})` : ""}
      `);

      return rows;
    },
  },
  Player: {
    player_season_totals: async (parent: Player) => {
      const { rows } = await pool.query(`
        SELECT *
        FROM "${SCHEMA}".player_season_totals
        WHERE id = ${parent.id}
      `);

      return rows[0];
    },
    player_gameweek_data: async (
      parent: Player,
      {
        gameweekStart,
        gameweekEnd,
      }: { gameweekStart: number; gameweekEnd: number },
    ) => {
      const { rows } = await pool.query(`
        SELECT *
        FROM "${SCHEMA}".player_gameweek_data
        WHERE element = ${parent.id}
        ${gameweekStart ? `AND round >= ${gameweekStart}` : ""}
        ${gameweekEnd ? `AND round <= ${gameweekEnd}` : ""}
        ORDER BY round ASC
      `);

      return rows;
    },
  },
};

export default resolvers;
