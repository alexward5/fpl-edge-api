import pool from "../pg";

const resolvers = {
  Query: {
    players: async () => {
      const { rows } = await pool.query(`
        SELECT * FROM "2020-21".player_metadata
        WHERE first_name = 'David'
      `);

      return rows;
    },
  },
};

export default resolvers;
