import pool from "../pg";
import type Player from "../types/Player";

const resolvers = {
  Query: {
    players: async (parent: undefined, { ids }: { ids: [number] }) => {
      const { rows } = await pool.query(`
        SELECT * FROM "2020-21".player_metadata
        ${ids ? `WHERE id IN (${ids.join(", ")})` : ""}
      `);

      return rows;
    },
  },
  Player: {
    player_totals: async (parent: Player) => {
      const { rows } = await pool.query(`
        SELECT *
        FROM "2020-21".player_totals
        WHERE id = ${parent.id}
      `);

      return rows[0];
    },
  },
};

export default resolvers;
