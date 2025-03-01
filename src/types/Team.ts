import type TeamMatchlog from "./TeamMatchlog";

interface Team {
    fbref_team: string;
    fbref_team_matchlog: TeamMatchlog[];
}

export default Team;
