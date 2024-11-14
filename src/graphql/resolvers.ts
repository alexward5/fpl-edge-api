import pool from "../pg";
import type Player from "../types/Player";

const SCHEMA = "test_schema";

const resolvers = {
    Query: {
        players: async (parent: undefined) => {
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
                FROM "${SCHEMA}".fbref_player_matchlog
                WHERE fbref_player_id = '${parent.fbref_player_id}'
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
