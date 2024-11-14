arr = [
    "fbref_player_row_id",
    "fbref_name",
    "fbref_team",
    "fbref_age",
    "fbref_xg",
    "fbref_npxg",
    "fbref_xg_assist",
    "fbref_npxg_xg_assist",
    "fbref_progressive_carries",
    "fbref_progressive_passes",
    "fbref_progressive_passes_received",
    "fpl_player_row_id",
    "fpl_player_code",
    "fpl_player_position",
    "fpl_player_cost",
    "fpl_selected_by_percent",
    "fpl_minutes",
    "fpl_total_points",
    "fpl_goals_scored",
    "fpl_assists",
    "fpl_clean_sheets",
    "fpl_goals_conceded",
    "fpl_bonus",
    "fpl_bps",
    "fpl_expected_goals_conceded",
    "calc_fpl_npxp",
]

arr.sort()

for i in arr:
    print(f"{i}: Int!")
