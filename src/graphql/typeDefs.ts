const typeDefs = `#graphql
    type PlayerGameweekData {
        assists: Int!
        blocks: Int!
        cards_red: Int!
        cards_yellow: Int!
        carries: Int!
        comp: String!
        date: String!
        dayofweek: String!
        fbref_player_id: String!
        game_started: Int!
        gca: Int!
        goals: Int!
        interceptions: Int!
        minutes: Int!
        npxg: Float!
        opponent: String!
        passes: Int!
        passes_completed: Int!
        passes_pct: Float!
        pens_att: Int!
        pens_made: Int!
        position: Int!
        progressive_carries: Int!
        progressive_passes: Int!
        result: String!
        round: String!
        sca: Int!
        shots: Int!
        shots_on_target: Int!
        tackles: Int!
        take_ons: Int!
        take_ons_won: Int!
        team: String!
        touches: Int!
        venue: String!
        xg: Float!
        xg_assist: Float!
    }

    type Player {
        calc_fpl_npxp: Float!
        fbref_age: String!
        fbref_name: String!
        fbref_npxg: Float!
        fbref_npxg_xg_assist: Float!
        fbref_player_id: String!
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
        fpl_player_id: String!
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
