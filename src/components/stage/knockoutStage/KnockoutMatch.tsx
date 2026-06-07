import { Ban, Circle, Clock3, Minus, Plus, Trophy } from "lucide-react";
import type { Match, Team } from "../../../api/types";

function parseInputValue(value: string) {
  if (value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : Math.max(0, parsed);
}

function formatCompactDate(dateString?: string) {
  if (!dateString) {
    return "A definir";
  }

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const time = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  return `${day}/${month} ${time}`;
}

function getStatus(match?: Match) {
  switch (match?.status) {
    case "InProgress":
      return {
        label: "Ao vivo",
        icon: <Circle className="h-2.5 w-2.5 fill-success text-success" />,
        className: "text-success",
      };

    case "Finished":
      return {
        label: "Finalizada",
        icon: <Trophy className="h-3 w-3 text-gold" />,
        className: "text-gold",
      };

    case "Cancelled":
      return {
        label: "Cancelada",
        icon: <Ban className="h-3 w-3 text-destructive" />,
        className: "text-destructive",
      };

    default:
      return {
        label: "Agendada",
        icon: <Clock3 className="h-3 w-3 text-muted-foreground" />,
        className: "text-muted-foreground",
      };
  }
}

type MatchTeamRowProps = {
  team?: Team;
  score: number | null | undefined;
  placeholder?: string;
  matchId?: number;
  side: "home" | "away";
  editable: boolean;
  onScoreChange?: (
    matchId: number,
    side: "home" | "away",
    value: number | null
  ) => void;
  isPenaltyWinner?: boolean;
  onPenaltySelect?: () => void;
  showPenaltyButton?: boolean;
};

function MatchTeamRow({
  team,
  score,
  placeholder,
  matchId,
  side,
  editable,
  onScoreChange,
  isPenaltyWinner,
  onPenaltySelect,
  showPenaltyButton,
}: MatchTeamRowProps) {
  const displayScore = score ?? "-";
  const label = team?.tla ?? placeholder ?? "A definir";
  const canEdit = editable && matchId !== undefined;

  function changeScore(value: number | null) {
    if (matchId === undefined) {
      return;
    }

    onScoreChange?.(matchId, side, value);
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        {showPenaltyButton && (
          <button
            onClick={onPenaltySelect}
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
              isPenaltyWinner
                ? "border-gold bg-gold text-gold-foreground"
                : "border-border bg-secondary hover:border-gold"
            }`}
            title="Marcar como vencedor nos pênaltis"
          >
            <Trophy
              size={10}
              className={
                isPenaltyWinner ? "text-gold-foreground" : "text-muted-foreground/40"
              }
            />
          </button>
        )}
        {!showPenaltyButton && editable && <div className="h-5 w-5 shrink-0" />}
        <div className="h-5 w-5 shrink-0 overflow-hidden rounded-full border border-border bg-secondary">
          {team && (
            <img
              className="h-full w-full object-cover"
              src={team.flagUri}
              alt={team.name}
            />
          )}
        </div>
        <span
          className="truncate text-xs font-semibold"
          title={label}
        >
          {label}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {canEdit && (
          <button
            onClick={() => changeScore(Math.max(0, (score ?? 0) - 1))}
            className="grid h-6 w-6 place-items-center rounded-md border border-border bg-secondary text-muted-foreground hover:border-primary hover:text-primary active:scale-95"
            aria-label="Diminuir"
          >
            <Minus className="h-3 w-3" />
          </button>
        )}

        <div
          className={`grid h-8 w-8 place-items-center rounded-md border border-gold/30 bg-gold/10 font-display font-bold tabular-nums text-gold text-base ${
            canEdit ? "p-0" : ""
          }`}
        >
          {canEdit ? (
            <input
              type="number"
              min={0}
              value={score ?? ""}
              onChange={event =>
                changeScore(parseInputValue(event.target.value))
              }
              className="h-full w-full bg-transparent text-center outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          ) : (
            displayScore
          )}
        </div>

        {canEdit && (
          <button
            onClick={() => changeScore((score ?? 0) + 1)}
            className="grid h-6 w-6 place-items-center rounded-md border border-border bg-secondary text-muted-foreground hover:border-primary hover:text-primary active:scale-95"
            aria-label="Aumentar"
          >
            <Plus className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function KnockoutMatch({
  match,
  realMatch,
  teamsMap,
  homePlaceholder,
  awayPlaceholder,
  editable = false,
  onScoreChange,
  onPenaltyChange,
}: {
  match?: Match;
  realMatch?: Match;
  teamsMap?: Map<number, Team>;
  homePlaceholder?: string;
  awayPlaceholder?: string;
  editable?: boolean;
  onScoreChange?: (
    matchId: number,
    side: "home" | "away",
    value: number | null
  ) => void;
  onPenaltyChange?: (
    matchId: number,
    side: "home" | "away",
    value: number | null
  ) => void;
}) {
  const homeTeam = match?.homeTeamId
    ? teamsMap?.get(match.homeTeamId)
    : undefined;
  const awayTeam = match?.awayTeamId
    ? teamsMap?.get(match.awayTeamId)
    : undefined;
  const status = getStatus(realMatch || match); 
  const isInProgress = (realMatch || match)?.status === "InProgress";
  const isFinished = (realMatch || match)?.status === "Finished";
  
  // Disable live effects in Sweepstakes view (where realMatch is used for comparison)
  const showLiveEffects = isInProgress && !realMatch;

  const hasPenalties =
    match?.homeTeamPenalties !== null &&
    match?.homeTeamPenalties !== undefined &&
    match?.awayTeamPenalties !== null &&
    match?.awayTeamPenalties !== undefined;

  const shouldShowPenalties =
    hasPenalties ||
    (editable &&
      match?.stage !== "GroupStage" &&
      match?.homeTeamGoals !== null &&
      match?.homeTeamGoals !== undefined &&
      match?.awayTeamGoals !== null &&
      match?.awayTeamGoals !== undefined &&
      match.homeTeamGoals === match.awayTeamGoals);

  const canEditPenalties = editable && match?.id !== undefined;

  function changePenalty(side: "home" | "away", value: number | null) {
    if (match?.id === undefined) {
      return;
    }

    onPenaltyChange?.(match.id, side, value);
  }

  // Points come directly from the backend via the match object in Sweepstakes view mode
  const points = realMatch ? match?.predictionPoints ?? null : null;

  return (
    <div
      className={`relative transition-all duration-500 ${
        editable ? "w-64" : "w-44 xl:w-40"
      } ${showLiveEffects ? "z-10" : ""}`}
      data-match-id={match?.id}
      data-stage={match?.stage}
    >
      <div
        className={`rounded-xl border bg-card p-2.5 shadow-sm transition-all duration-300 ${
          showLiveEffects
            ? "border-success/50 bg-success/[0.02] ring-1 ring-success/20 shadow-lg shadow-success/10"
            : "border-border"
        }`}
      >
        <div className="mb-1.5 flex items-center justify-between gap-2 text-[0.65rem] leading-none">
          <div className={`flex min-w-0 items-center gap-1 ${status.className}`}>
            {showLiveEffects ? (
              <div className="relative -top-0.5 h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success"></span>
              </div>
            ) : (
              status.icon
            )}
            <span
              className={`truncate font-bold uppercase tracking-wider ${
                showLiveEffects ? "text-success" : ""
              }`}
            >
              {showLiveEffects ? "Ao Vivo" : status.label}
            </span>
          </div>
          <span
            className={`shrink-0 ${
              isInProgress ? "text-success font-bold" : "text-muted-foreground"
            }`}
          >
            {formatCompactDate(realMatch?.utcDate || match?.utcDate)}
          </span>
          {points !== null && (
            <span
              className={`absolute -right-2 -top-2 z-20 rounded-md px-2 py-0.5 text-[0.6rem] font-black shadow-md transition-all ${
                points === 3
                  ? "bg-gold text-gold-foreground"
                  : points === 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              +{points}
            </span>
          )}
        </div>
        <MatchTeamRow
          team={homeTeam}
          score={(match?.status === "Finished" || match?.status === "InProgress") ? match.homeTeamGoals : (match?.homeTeamGoals)}
          placeholder={homePlaceholder}
          matchId={match?.id}
          side="home"
          editable={editable}
          onScoreChange={onScoreChange}
          showPenaltyButton={shouldShowPenalties}
          isPenaltyWinner={
            match?.homeTeamPenalties !== null &&
            match?.awayTeamPenalties !== null &&
            match?.homeTeamPenalties !== undefined &&
            match?.awayTeamPenalties !== undefined &&
            match?.homeTeamPenalties > match?.awayTeamPenalties
          }
          onPenaltySelect={
            canEditPenalties
              ? () => {
                  changePenalty("home", 1);
                  changePenalty("away", 0);
                }
              : undefined
          }
        />
        <div className="my-1.5 h-px bg-border/60"></div>
        <MatchTeamRow
          team={awayTeam}
          score={(match?.status === "Finished" || match?.status === "InProgress") ? match.awayTeamGoals : (match?.awayTeamGoals)}
          placeholder={awayPlaceholder}
          matchId={match?.id}
          side="away"
          editable={editable}
          onScoreChange={onScoreChange}
          showPenaltyButton={shouldShowPenalties}
          isPenaltyWinner={
            match?.homeTeamPenalties !== null &&
            match?.awayTeamPenalties !== null &&
            match?.homeTeamPenalties !== undefined &&
            match?.awayTeamPenalties !== undefined &&
            match?.awayTeamPenalties > match?.homeTeamPenalties
          }
          onPenaltySelect={
            canEditPenalties
              ? () => {
                  changePenalty("home", 0);
                  changePenalty("away", 1);
                }
              : undefined
          }
        />
      </div>
      {isFinished && realMatch && (
        <div className="absolute left-0 right-0 top-full mt-1 flex flex-col items-center text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/80 z-20">
          <div className="flex items-center gap-1.5 rounded-full border border-border/50 bg-card/80 px-2 py-0.5 shadow-sm backdrop-blur-sm">
            <span>Real:</span>
            <span className="text-foreground">
              {realMatch.homeTeamGoals} × {realMatch.awayTeamGoals}
              {realMatch.homeTeamPenalties !== null &&
                ` (${realMatch.homeTeamPenalties}-${realMatch.awayTeamPenalties})`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
