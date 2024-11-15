import type PlayerSeasonTotals from "./PlayerSeasonTotals";
import type PlayerGameweekData from "./PlayerGameweekData";

interface Player {
    fbref_player_id: string;
    first_name: string;
    second_name: string;
    player_season_totals?: PlayerSeasonTotals;
    player_gameweek_data?: PlayerGameweekData;
}

export default Player;
