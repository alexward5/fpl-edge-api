import pool from "../pg";
import type Player from "../types/Player";

const SCHEMA = "2020-21";

const resolvers = {
  Query: {
    players: async (parent: undefined, { ids }: { ids: [number] }) => {
      try {
        const { rows } = await pool.query(`
        SELECT * FROM "${SCHEMA}".player_metadata
        ${ids?.length ? `WHERE id IN (${ids.join(", ")})` : ""}
      `);

        return rows;
      } catch ({ message }) {
        console.log(`Error fetching players list: ${message}`);
        return [];
      }
    },
  },
  Player: {
    player_season_totals: async (parent: Player) => {
      try {
        const { rows } = await pool.query(`
        SELECT *
        FROM "${SCHEMA}".player_season_totals
        WHERE id = ${parent.id}
      `);

        return rows[0];
      } catch ({ message }) {
        console.log(`Error fetching player season totoals: ${message}`);
        return {};
      }
    },
    player_gameweek_data: async (
      parent: Player,
      {
        gameweekStart,
        gameweekEnd,
      }: { gameweekStart: number; gameweekEnd: number }
    ) => {
      try {
        const { rows } = await pool.query(`
        SELECT *
        FROM "${SCHEMA}".player_gameweek_data
        WHERE element = ${parent.id}
        ${gameweekStart ? `AND round >= ${gameweekStart}` : ""}
        ${gameweekEnd ? `AND round <= ${gameweekEnd}` : ""}
        ORDER BY round ASC
      `);

        return rows;
      } catch ({ message }) {
        console.log(`Error fetching player gameweek data: ${message}`);
        return [];
      }
    },
  },
};

export default resolvers;
