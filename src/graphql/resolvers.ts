import pool from "../pg";
import type Player from "../types/Player";

const SCHEMA = "test_schema";

const resolvers = {
    Query: {
        players: async (parent: undefined) => {
            const { rows } = await pool.query(`
                SELECT * FROM "${SCHEMA}".v_player_data
            `);

            return rows;
        },
    },
    Player: {
        player_gameweek_data: async (
            parent: Player,
            {
                gameweekStart,
                gameweekEnd,
            }: { gameweekStart: number; gameweekEnd: number }
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
