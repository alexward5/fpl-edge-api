import pool from "../pg";
import type Player from "../types/Player";
import type Team from "../types/Team";

const SCHEMA = "test_schema";

const resolvers = {
    Query: {
        players: async (parent: Player, { ids }: { ids: string[] }) => {
            let query = `
                SELECT * FROM "${SCHEMA}".v_player_data
            `;

            if (ids?.length) {
                query += ` WHERE fpl_player_id IN ('${ids.join("','")}')`;
            }

            const { rows } = await pool.query(query);

            return rows;
        },
        teams: async (parent: Team, { teamNames }: { teamNames: string[] }) => {
            let query = `
                SELECT * FROM "${SCHEMA}".v_team_matchlog
            `;

            if (teamNames?.length) {
                query += ` WHERE fbref_team IN ('${teamNames.join("','")}')`;
            }

            const { rows } = await pool.query(query);

            // Create a Map to organize teams by their fbref_team identifier
            const teamMap = new Map<string, Team>();

            rows.forEach((row) => {
                // If the team is not already in the map, add it
                if (!teamMap.has(row.fbref_team)) {
                    teamMap.set(row.fbref_team, {
                        fbref_team: row.fbref_team,
                        fbref_team_matchlog: [],
                    });
                }

                // Retrieve the team from the map and add the matchlog fields
                const team = teamMap.get(row.fbref_team)!;
                team.fbref_team_matchlog.push({
                    fbref_match_date: row.fbref_date,
                    fbref_round: row.fbref_round,
                });
            });

            teamMap.forEach((team) => {
                // Sort match logs by match date
                team.fbref_team_matchlog.sort(
                    (a, b) =>
                        new Date(a.fbref_match_date).getTime() -
                        new Date(b.fbref_match_date).getTime()
                );

                // Assign a match number based on the sorted order
                team.fbref_team_matchlog.forEach((matchlog, index) => {
                    matchlog.match_number = index + 1;
                });
            });

            return Array.from(teamMap.values());
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
                ${gameweekStart ? `AND fpl_gameweek >= ${gameweekStart}` : ""}
                ${gameweekEnd ? `AND fpl_gameweek <= ${gameweekEnd}` : ""}
                ORDER BY fpl_gameweek ASC
            `;

            const { rows } = await pool.query(query);

            return rows;
        },
    },
};

export default resolvers;
