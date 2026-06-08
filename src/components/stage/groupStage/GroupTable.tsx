import type { Group, Team } from "../../../api/types";
import { getCountryNamePt } from "../../../lib/utils";
import { Flag } from "../../shared/Flag";

type GroupTableProps = {
  group: Group;
  teams: Team[];
};

const truncateName = (name: string) =>
  name.length > 15
    ? `${name.slice(0, 12)}...`
    : name;

export default function GroupTable({
  group,
  teams,
}: GroupTableProps) {
  const teamsMap = new Map(
    teams.map(team => [team.id, team])
  );

  const columns =
    "grid-cols-[minmax(180px,1fr)_repeat(8,28px)]";

  return (
    <div className="overflow-hidden w-full rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border bg-(image:--gradient-pitch) px-4 py-3">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-gold/15 font-display text-sm font-bold text-gold">
          {group.group.replace("Group", "")}
        </div>

        <span className="text-sm font-semibold">
          {group.group.replace("Group", "Grupo ")}
        </span>
      </div>

      <div className="overflow-x-auto px-2 py-2">
        <div className={`grid ${columns} gap-1 px-2 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground`}>
          <span>Time</span>
          <span className="text-center font-bold text-gold">P</span>
          <span className="text-center">J</span>
          <span className="text-center">V</span>
          <span className="text-center">E</span>
          <span className="text-center">D</span>
          <span className="text-center">GP</span>
          <span className="text-center">GC</span>
          <span className="text-center">SG</span>
        </div>

        {[...group.standings]
          .sort((a, b) => a.position - b.position)
          .map((standing) => {
            const team = teamsMap.get(standing.teamId);

            if (!team) {
              return null;
            }

            return (
              <div
                key={standing.teamId}
                className={`grid ${columns} items-center gap-1 rounded-lg px-2 py-2 text-sm transition-all duration-300 hover:bg-secondary/50`}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="w-4 text-xs text-muted-foreground">
                    {standing.position}
                  </span>

                  <Flag
                    src={team.flagUri}
                    alt={team.name}
                  />

                  <span className="whitespace-nowrap font-medium"
                    title={getCountryNamePt(team.name)}
                  >
                    {truncateName(getCountryNamePt(team.name))}
                  </span>
                </div>

                <span className="text-center font-display font-bold text-gold tabular-nums">
                  {standing.points}
                </span>

                <span className="text-center tabular-nums text-muted-foreground">
                  {standing.playedGames}
                </span>

                <span className="text-center tabular-nums text-muted-foreground">
                  {standing.won}
                </span>

                <span className="text-center tabular-nums text-muted-foreground">
                  {standing.draw}
                </span>

                <span className="text-center tabular-nums text-muted-foreground">
                  {standing.lost}
                </span>

                <span className="text-center tabular-nums text-muted-foreground">
                  {standing.goalsFor}
                </span>

                <span className="text-center tabular-nums text-muted-foreground">
                  {standing.goalsAgainst}
                </span>

                <span className="text-center tabular-nums text-muted-foreground">
                  {standing.goalsDifference}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
