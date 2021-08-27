interface PlayerGameweekData {
  position: string;
  xp: number;
  assists: number;
  bonus: number;
  bps: number;
  clean_sheets: number;
  fixture: number;
  goals_conceded: number;
  goals_scored: number;
  ict_index: number;
  influence: number;
  creativity: number;
  threat: number;
  kickoff_time: string;
  minutes: number;
  opponent_team: number;
  own_goals: number;
  penalties_missed: number;
  saves: number;
  penalties_saved: number;
  yellow_cards: number;
  red_cards: number;
  round: number;
  selected: number;
  team_a_score: string;
  team_h_score: string;
  total_ponumbers: number;
  value: number;
  was_home: Boolean;
}

export default PlayerGameweekData;
