const typeDefs = `#graphql
    type PlayerGameweekData {
        position: String!
        xp: Float!
        assists: Int!
        bonus: Int!
        bps: Int!
        clean_sheets: Int!
        fixture: Int!
        goals_conceded: Int!
        goals_scored: Int!
        ict_index: Float!
        influence: Float!
        creativity: Float!
        threat: Float!
        kickoff_time: String!
        minutes: Int!
        opponent_team: Int!
        own_goals: Int!
        penalties_missed: Int!
        saves: Int!
        penalties_saved: Int!
        yellow_cards: Int!
        red_cards: Int!
        round: Int!
        selected: Int!
        team_a_score: String
        team_h_score: String!
        total_points: Int!
        value: Int!
        was_home: Boolean!
    }

    type Player {
        calc_fpl_npxp: Float!
        fbref_age: String!
        fbref_name: String!
        fbref_npxg: Float!
        fbref_npxg_xg_assist: Float!
        fbref_player_row_id: String!
        fbref_progressive_carries: Int!
        fbref_progressive_passes: Int!
        fbref_progressive_passes_received: Int!
        fbref_team: String!
        fbref_xg: Float!
        fbref_xg_assist: Float!
        fpl_assists: Int!
        fpl_bonus: Int!
        fpl_bps: Int!
        fpl_clean_sheets: Int!
        fpl_expected_goals_conceded: Float!
        fpl_goals_conceded: Int!
        fpl_goals_scored: Int!
        fpl_minutes: Int!
        fpl_player_code: Int!
        fpl_player_cost: Float!
        fpl_player_position: String!
        fpl_player_row_id: String!
        fpl_selected_by_percent: Float!
        fpl_total_points: Int!
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
