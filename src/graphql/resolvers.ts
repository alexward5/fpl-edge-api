import pool from "../pg";
import type Player from "../types/Player";
// import type Team from "../types/Team";

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
        teams: async () => {
            const query = `
                SELECT * FROM "${SCHEMA}".v_team_matchlog
            `;

            const { rows } = await pool.query(query);

            const returnedRows: any = [];

            rows.forEach((row) => {
                const teamIndex = returnedRows.findIndex(
                    (r: any) => r.fbref_team === row.fbref_team
                );
                if (teamIndex === -1) {
                    returnedRows.push({
                        fbref_team: row.fbref_team,
                        fbref_team_matchlog: [
                            {
                                fbref_match_date: row.fbref_date,
                                fbref_round: row.fbref_round,
                            },
                        ],
                    });
                } else {
                    returnedRows[teamIndex].fbref_team_matchlog.push({
                        fbref_match_date: row.fbref_date,
                        fbref_round: row.fbref_round,
                    });
                }
            });

            returnedRows.forEach((team: any) => {
                team.fbref_team_matchlog = team.fbref_team_matchlog.sort(
                    (a: any, b: any) => {
                        return (
                            new Date(a.fbref_match_date).getTime() -
                            new Date(b.fbref_match_date).getTime()
                        );
                    }
                );
            });

            returnedRows.forEach((team: any) => {
                team.fbref_team_matchlog.forEach(
                    (matchlog: any, index: number) => {
                        matchlog.match_number = index + 1;
                    }
                );
            });

            return returnedRows;
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
                ${gameweekStart ? `AND fbref_round >= ${gameweekStart}` : ""}
                ${gameweekEnd ? `AND fbref_round <= ${gameweekEnd}` : ""}
                ORDER BY fbref_round ASC
            `;

            const { rows } = await pool.query(query);

            return rows;
        },
    },
    // Team: {
    //     teams: async () => {
    //         const query = `
    //             SELECT * FROM "${SCHEMA}".fbref_team_scores_and_fixtures
    //             WHERE result IS NOT NULL AND result <> '';
    //         `;

    //         const { rows } = await pool.query(query);

    //         return rows;
    //     },
    // },
};

export default resolvers;
