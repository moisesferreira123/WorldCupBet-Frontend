import type { Match, Team } from "../../../api/types";
import { Flag } from "../../shared/Flag";
import { Circle, Trophy, Ban, Clock3, Minus, Plus } from "lucide-react";

type MatchRoundCardProps = {
   round: number;
   matches: Match[];
   realMatches?: Match[];
   teams: Team[];
   editable?: boolean;
   onScoreChange?: (
      matchId: number,
      side: "home" | "away",
      value: number | null
   ) => void;
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

function parseInputValue(value: string) {
   if (value === "") {
      return null;
   }

   const parsed = Number(value);
   return Number.isNaN(parsed) ? null : Math.max(0, parsed);
}

export default function MatchRoundCard({
   round,
   matches,
   realMatches,
   teams,
   editable = false,
   onScoreChange,
}: MatchRoundCardProps) {
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

                  const realMatch = realMatches?.find(m => m.id === match.id);
                  const status = getStatus(realMatch || match);
                  const canEdit = editable;

                  const isInProgress = (realMatch || match).status === "InProgress";
                  const isFinished = (realMatch || match).status === "Finished";
                  
                  // Disable live effects in Sweepstakes view (where realMatches is provided)
                  const showLiveEffects = isInProgress && !realMatches;

                  // Points come directly from the backend via the match object in Sweepstakes view mode
                  const points = realMatches ? match.predictionPoints ?? null : null;

                  const scoreControl = (
                     side: "home" | "away",
                     value: number | null
                  ) => (
                     <div className="flex items-center gap-1">
                        {canEdit && (
                           <button
                              onClick={() =>
                                 onScoreChange?.(
                                    match.id,
                                    side,
                                    Math.max(0, (value ?? 0) - 1)
                                 )
                              }
                              className="grid h-6 w-6 place-items-center rounded-md border-2 border-border bg-secondary text-foreground hover:border-gold hover:text-gold active:scale-90 transition-colors"
                              aria-label="Diminuir"
                           >
                              <Minus className="h-3 w-3" />
                           </button>
                        )}

                        <label className="grid h-9 w-9 place-items-center rounded-lg border-2 border-gold/40 bg-gold/10 font-display text-xl font-black tabular-nums text-gold shadow-inner">
                           {canEdit ? (
                              <input
                                 type="number"
                                 min={0}
                                 value={value ?? ""}
                                 onChange={event =>
                                    onScoreChange?.(
                                       match.id,
                                       side,
                                       parseInputValue(event.target.value)
                                    )
                                 }
                                 className="h-full w-full rounded-lg bg-transparent text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                           ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                 {value ?? "-"}
                              </div>
                           )}
                        </label>

                        {canEdit && (
                           <button
                              onClick={() =>
                                 onScoreChange?.(
                                    match.id,
                                    side,
                                    (value ?? 0) + 1
                                 )
                              }
                              className="grid h-6 w-6 place-items-center rounded-md border-2 border-border bg-secondary text-foreground hover:border-gold hover:text-gold active:scale-90 transition-colors"
                              aria-label="Aumentar"
                           >
                              <Plus className="h-3 w-3" />
                           </button>
                        )}
                     </div>
                  );

                  return (
                     <div key={match.id} className={`relative rounded-xl transition-all duration-300 ${showLiveEffects ? 'bg-success/5 ring-1 ring-success/20 shadow-lg' : ''}`}>
                        <div className={`mb-2 flex items-center justify-between text-xs font-black uppercase tracking-widest ${showLiveEffects ? 'p-2 pb-0' : ''}`}>
                           <div className="flex items-center gap-1.5">
                              {showLiveEffects ? (
                                 <div className="flex items-center gap-1.5">
                                    <div className="relative -top-0.5 h-2 w-2">
                                       <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
                                       <span className="relative inline-flex h-2 w-2 rounded-full bg-success"></span>
                                    </div>
                                    <span className="text-success">Ao Vivo</span>
                                 </div>
                              ) : <span className="scale-110">{status.icon}</span>}

                              <span className="text-muted-foreground">
                                 {date}
                              </span>
                           </div>

                           <div className="flex items-center gap-2">
                              {points !== null && (
                                 <span className={`rounded-md px-1.5 py-0.5 shadow-sm ring-1 ring-background ${points === 3 ? 'bg-gold text-gold-foreground' : points === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                    +{points}
                                 </span>
                              )}
                              <span className={`${isInProgress ? 'text-success' : 'text-muted-foreground'}`}>
                                 {time}
                              </span>
                           </div>
                        </div>

                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                           <div className="flex items-center gap-1.5">
                              <Flag
                                 src={homeTeam.flagUri}
                                 alt={homeTeam.name}
                              />

                              <span className="text-sm font-semibold">
                                 {homeTeam.tla}
                              </span>
                           </div>

                           <div className="flex items-center gap-1 sm:gap-2">
                              {scoreControl(
                                 "home",
                                 (match.status === "Finished" || match.status === "InProgress") ? match.homeTeamGoals : (match.homeTeamGoals ?? null)
                              )}

                              <span className="font-display text-lg font-bold text-muted-foreground">
                                 ×
                              </span>

                              {scoreControl(
                                 "away",
                                 (match.status === "Finished" || match.status === "InProgress") ? match.awayTeamGoals : (match.awayTeamGoals ?? null)
                              )}
                           </div>

                           <div className="flex items-center justify-end gap-1.5 text-right">
                              <span className="text-sm font-semibold">
                                 {awayTeam.tla}
                              </span>

                              <Flag
                                 src={awayTeam.flagUri}
                                 alt={awayTeam.name}
                              />
                           </div>
                        </div>

                        {isFinished && realMatch && (
                           <div className="absolute left-0 right-0 top-full mt-0.5 flex flex-col items-center text-[0.55rem] font-bold uppercase tracking-widest text-muted-foreground/80 z-20 pointer-events-none">
                              <div className="flex items-center gap-1 rounded-full border border-border/50 bg-card/80 px-2 py-0.5 shadow-sm backdrop-blur-sm">
                                 <span>Real:</span>
                                 <span className="text-foreground">
                                    {realMatch.homeTeamGoals} × {realMatch.awayTeamGoals}
                                 </span>
                              </div>
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
