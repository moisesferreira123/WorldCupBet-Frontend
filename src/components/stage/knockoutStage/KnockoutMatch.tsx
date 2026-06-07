import { Ban, Circle, Clock3, Minus, Plus, Trophy } from "lucide-react";
import { useLocation } from "react-router-dom";
import type { Match, Team } from "../../../api/types";

interface KnockoutMatchProps {
  leftLine: boolean;
  rightLine: boolean;
  leftConnectingLine: boolean;
  rightConnectingLine: boolean;
  connectingLineHeight: string;
  match?: Match;
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

function parseInputValue(value: string) {
  if (value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : Math.max(0, parsed);
}

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
      <div className="flex min-w-0 items-center gap-1.5 flex-1">
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
            <Trophy size={10} className={isPenaltyWinner ? "text-gold-foreground" : "text-muted-foreground/40"} />
          </button>
        )}
        {!showPenaltyButton && editable && <div className="w-5 h-5 shrink-0" />}
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
        
        <div className={`grid h-8 w-8 place-items-center rounded-md border border-gold/30 bg-gold/10 font-display font-bold tabular-nums text-gold text-base ${canEdit ? 'p-0' : ''}`}>
          {canEdit ? (
            <input
              type="number"
              min={0}
              value={score ?? ""}
              onChange={event => changeScore(parseInputValue(event.target.value))}
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

export default function KnockoutMatch({
  match,
  teamsMap,
  homePlaceholder,
  awayPlaceholder,
  editable = false,
  onScoreChange,
  onPenaltyChange,
}: Omit<KnockoutMatchProps, "leftLine" | "rightLine" | "leftConnectingLine" | "rightConnectingLine" | "connectingLineHeight">) {
  const homeTeam = match?.homeTeamId ? teamsMap?.get(match.homeTeamId) : undefined;
  const awayTeam = match?.awayTeamId ? teamsMap?.get(match.awayTeamId) : undefined;
  const status = getStatus(match);
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

  return (
    <div 
      className={`relative ${editable ? 'w-64' : 'w-44 xl:w-40'}`}
      data-match-id={match?.id}
      data-stage={match?.stage}
    >
      <div className="rounded-xl border border-border bg-card shadow-sm p-2.5">
        <div className="mb-1.5 flex items-center justify-between gap-2 text-[0.65rem] leading-none">
          <div className={`flex min-w-0 items-center gap-1 ${status.className}`}>
            {status.icon}
            <span className="truncate font-medium">{status.label}</span>
          </div>
          <span className="shrink-0 text-muted-foreground">
            {formatCompactDate(match?.utcDate)}
          </span>
        </div>
        <MatchTeamRow
          team={homeTeam}
          score={match?.homeTeamGoals}
          placeholder={homePlaceholder}
          matchId={match?.id}
          side="home"
          editable={editable}
          onScoreChange={onScoreChange}
          showPenaltyButton={shouldShowPenalties}
          isPenaltyWinner={
            match?.homeTeamPenalties !== null &&
            match?.awayTeamPenalties !== null &&
            match.homeTeamPenalties > match.awayTeamPenalties
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
          score={match?.awayTeamGoals}
          placeholder={awayPlaceholder}
          matchId={match?.id}
          side="away"
          editable={editable}
          onScoreChange={onScoreChange}
          showPenaltyButton={shouldShowPenalties}
          isPenaltyWinner={
            match?.homeTeamPenalties !== null &&
            match?.awayTeamPenalties !== null &&
            match.awayTeamPenalties > match.homeTeamPenalties
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
    </div>
  );
}
