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
}

type MatchTeamRowProps = {
  team?: Team;
  score: number | null | undefined;
  placeholder?: string;
};

function MatchTeamRow({ team, score, placeholder }: MatchTeamRowProps) {
  const pathname = useLocation().pathname;
  const displayScore = score ?? "-";
  const label = team?.tla ?? placeholder ?? "A definir";

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <div className="h-5 w-5 overflow-hidden rounded-full border border-border bg-secondary">
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
        {pathname === '/' &&
          <button className="grid h-6 w-6 place-items-center rounded-md border border-border bg-secondary text-muted-foreground hover:border-primary hover:text-primary active:scale-95" aria-label="Diminuir">
            <Minus className="h-3 w-3" />
          </button>
        }
        {/* TODO: Colocar input */}
        {pathname === '/' && <input type="text" value={score ?? ""} readOnly className="flex justify-center items-center text-center outline-none h-8 w-8 rounded-md border border-gold/30 bg-gold/10 font-display font-bold text-gold focus:border-gold" />}
        {pathname === '/matches' && <div className="grid h-8 w-8 place-items-center rounded-md border border-gold/30 bg-gold/10 font-display font-bold tabular-nums text-gold text-base">{displayScore}</div>}
        {pathname === '/' &&
          <button className="grid h-6 w-6 place-items-center rounded-md border border-border bg-secondary text-muted-foreground hover:border-primary hover:text-primary active:scale-95" aria-label="Aumentar">
            <Plus className="h-3 w-3" />
          </button>
        }
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

export default function KnockoutMatch({ leftLine, rightLine, leftConnectingLine, rightConnectingLine, connectingLineHeight, match, teamsMap, homePlaceholder, awayPlaceholder }: KnockoutMatchProps) {
  const pathname = useLocation().pathname;
  const homeTeam = match?.homeTeamId ? teamsMap?.get(match.homeTeamId) : undefined;
  const awayTeam = match?.awayTeamId ? teamsMap?.get(match.awayTeamId) : undefined;
  const status = getStatus(match);
  const hasPenalties =
    match?.homeTeamPenalties !== null &&
    match?.homeTeamPenalties !== undefined &&
    match?.awayTeamPenalties !== null &&
    match?.awayTeamPenalties !== undefined;

  return (
    <div className={`relative ${pathname === '/' ? 'w-56' : 'w-44 xl:w-40'}`}>
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
        />
        <div className="my-1.5 h-px bg-border/60"></div>
        <MatchTeamRow
          team={awayTeam}
          score={match?.awayTeamGoals}
          placeholder={awayPlaceholder}
        />
        {hasPenalties && (
          <div className="mt-1.5 border-t border-border/60 pt-1.5 text-center text-[0.65rem] font-medium text-muted-foreground">
            Pên. {match.homeTeamPenalties} x {match.awayTeamPenalties}
          </div>
        )}
      </div>
      {rightLine && <span className="pointer-events-none absolute -right-3 top-1/2 h-px w-3 bg-border"></span>}
      {leftLine && <span className="pointer-events-none absolute -left-3 top-1/2 h-px w-3 bg-border"></span>}
      {rightConnectingLine && <span className={`pointer-events-none absolute -right-3 top-1/2 w-px bg-border ${connectingLineHeight}`}></span>}
      {leftConnectingLine && <span className={`pointer-events-none absolute -left-3 top-1/2 w-px bg-border ${connectingLineHeight}`}></span>}
    </div>
  );
}
