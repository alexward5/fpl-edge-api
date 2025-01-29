import pool from "../pg";
import type Player from "../types/Player";

const SCHEMA = "test_schema";

const resolvers = {
    Query: {
        players: async () => {
            const query = `
                SELECT * FROM "${SCHEMA}".v_player_data
            `;

            const { rows } = await pool.query(query);

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
            const query = `
                SELECT *
                FROM "${SCHEMA}".v_player_matchlog
                WHERE fpl_player_id = '${parent.fpl_player_id}'
                ${gameweekStart ? `AND round >= ${gameweekStart}` : ""}
                ${gameweekEnd ? `AND round <= ${gameweekEnd}` : ""}
                ORDER BY round ASC
            `;

            const { rows } = await pool.query(query);

            return rows;
        },
    },
};

export default resolvers;
