import type PlayerTotals from "./PlayerTotals";

interface Player {
  id: number;
  first_name: string;
  second_name: string;
  player_totals: PlayerTotals;
}

export default Player;
