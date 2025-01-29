import type PlayerGameweekData from "./PlayerGameweekData";

interface Player {
    fpl_player_id: string;
    fpl_player_code: string;
    fpl_web_name: string;
    fbref_team: string;
    fpl_player_position: string;
    fpl_player_cost: number;
    fpl_selected_by_percent: number;
    player_gameweek_data: PlayerGameweekData[];
}

export default Player;
