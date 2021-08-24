import type PlayerSeasonTotals from "./PlayerSeasonTotals";

interface Player {
  id: number;
  first_name: string;
  second_name: string;
  player_season_totals: PlayerSeasonTotals;
}

export default Player;
