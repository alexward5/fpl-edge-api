const typeDefs = `#graphql
    type PlayerGameweekData {
        fbref_round: Int!
        fbref_minutes: Int!
        fbref_npxg: Float!
        fbref_xg_assist: Float!
        calc_fpl_npxp: Float!
    }

    type Player {
        fpl_player_id: String!
        fpl_player_code: Int!
        fpl_web_name: String!
        fbref_team: String!
        fpl_player_position: String!
        fpl_player_cost: Float!
        fpl_selected_by_percent: Float!
        player_gameweek_data(
            gameweekStart: Int
            gameweekEnd: Int
        ): [PlayerGameweekData!]!
    }

    type Query {
        players(ids: [Int!]): [Player]!
    }
`;

export default typeDefs;
