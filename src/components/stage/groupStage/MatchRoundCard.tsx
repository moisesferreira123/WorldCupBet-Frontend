import { useLocation } from "react-router-dom";
import type { Match, Team } from "../../../api/types";
import { Flag } from "../../shared/Flag";
import { Circle, Trophy, Ban, Clock3 } from "lucide-react";

type MatchRoundCardProps = {
   round: number;
   matches: Match[];
   teams: Team[];
};

const weekdays: Record<number, string> = {
   0: "Domingo",
   1: "Segunda",
   2: "Terça",
   3: "Quarta",
   4: "Quinta",
   5: "Sexta",
   6: "Sábado",
};

function formatMatchDate(dateString: string) {
   const date = new Date(dateString);

   const day = date.getDate();

   const month = new Intl.DateTimeFormat(
      "pt-BR",
      { month: "short" }
   )
      .format(date)
      .replace(".", "");

   const weekday = weekdays[date.getDay()];

   const time = new Intl.DateTimeFormat(
      "pt-BR",
      {
         hour: "2-digit",
         minute: "2-digit",
      }
   ).format(date);

   return {
      date: `${day} de ${month}., ${weekday}`,
      time,
   };
}

function getStatus(match: Match) {
   switch (match.status) {
      case "InProgress":
         return {
            icon: (
               <Circle
                  size={10}
                  className="fill-success text-success"
               />
            ),
            className: "text-success",
         };

      case "Finished":
         return {
            icon: (
               <Trophy
                  size={12}
                  className="text-gold"
               />
            ),
            className: "text-gold",
         };

      case "Cancelled":
         return {
            icon: (
               <Ban
                  size={12}
                  className="text-destructive"
               />
            ),
            className: "text-destructive",
         };

      default:
         return {
            icon: (
               <Clock3
                  size={12}
                  className="text-muted-foreground"
               />
            ),
            className: "text-muted-foreground",
         };
   }
}

export default function MatchRoundCard({
   round,
   matches,
   teams,
}: MatchRoundCardProps) {
   const pathname = useLocation().pathname;

   const teamsMap = new Map(
      teams.map(team => [team.id, team])
   );

   return (
      <div className="flex w-full flex-col gap-2">
         <div className="font-bold">
            {round}ª RODADA
         </div>

         <div className="w-full rounded-2xl border border-border bg-card p-4">
            <div className="space-y-4">
               {matches.map((match, index) => {
                  const homeTeam = match.homeTeamId
                     ? teamsMap.get(match.homeTeamId)
                     : null;

                  const awayTeam = match.awayTeamId
                     ? teamsMap.get(match.awayTeamId)
                     : null;

                  if (!homeTeam || !awayTeam) {
                     return null;
                  }

                  const { date, time } =
                     formatMatchDate(match.utcDate);

                  const status = getStatus(match);

                  return (
                     <div key={match.id}>
                        <div className="mb-2 flex items-center justify-between text-xs">
                           <div className="flex items-center gap-1.5">
                              {status.icon}

                              <span className="text-muted-foreground">
                                 {date}
                              </span>
                           </div>

                           <span className="font-medium text-muted-foreground">
                              {time}
                           </span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                           <div className="flex items-center gap-1.5">
                              <Flag
                                 src={homeTeam.flagUri}
                                 alt={homeTeam.name}
                              />

                              <span className="text-sm font-semibold">
                                 {homeTeam.tla}
                              </span>
                           </div>

                           <div className="flex items-center gap-3">
                              <label className="grid h-12 w-12 place-items-center rounded-xl border border-gold/30 bg-gold/10 font-display text-2xl font-bold tabular-nums text-gold">
                                 {pathname === "/" ? (
                                    <input
                                       type="text"
                                       value={
                                          match.homeTeamGoals ?? ""
                                       }
                                       readOnly
                                       className="h-full w-full rounded-xl text-center focus:outline-none"
                                    />
                                 ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                       {match.homeTeamGoals ?? "-"}
                                    </div>
                                 )}
                              </label>

                              <span className="font-display text-lg font-bold text-muted-foreground">
                                 ×
                              </span>

                              <label className="grid h-12 w-12 place-items-center rounded-xl border border-gold/30 bg-gold/10 font-display text-2xl font-bold tabular-nums text-gold">
                                 {pathname === "/" ? (
                                    <input
                                       type="text"
                                       value={
                                          match.awayTeamGoals ?? ""
                                       }
                                       readOnly
                                       className="h-full w-full rounded-xl text-center focus:outline-none"
                                    />
                                 ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                       {match.awayTeamGoals ?? "-"}
                                    </div>
                                 )}
                              </label>
                           </div>

                           <div className="flex items-center gap-1.5">
                              <span className="text-sm font-semibold">
                                 {awayTeam.tla}
                              </span>

                              <Flag
                                 src={awayTeam.flagUri}
                                 alt={awayTeam.name}
                              />
                           </div>
                        </div>

                        {match.homeTeamPenalties !== null &&
                           match.awayTeamPenalties !== null && (
                              <div className="mt-2 text-center text-xs text-muted-foreground">
                                 Pênaltis:{" "}
                                 {match.homeTeamPenalties}
                                 {" × "}
                                 {match.awayTeamPenalties}
                              </div>
                           )}

                        {index < matches.length - 1 && (
                           <div className="mt-4 h-px w-full bg-border" />
                        )}
                     </div>
                  );
               })}
            </div>
         </div>
      </div>
   );
}