import { useRef, useState, type MouseEvent } from "react";
import type { Match, Team, WorldCupResponse } from "../../../api/types";
import {
  roundOf32Placeholders,
  sortMatchesById,
  type MatchPlaceholder,
} from "../../../lib/betting";
import KnockoutMatch from "./KnockoutMatch";

type KnockoutStageProps = {
  data?: WorldCupResponse;
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
};

type MatchLineConfig = {
  leftLine: boolean;
  rightLine: boolean;
  leftConnectingLine: boolean;
  rightConnectingLine: boolean;
  connectingLineHeight: string;
};

type MatchColumnConfig = {
  className: string;
  matches: (Match | undefined)[];
  lines: MatchLineConfig[];
  placeholders?: MatchPlaceholder[];
  absoluteMatch?: {
    className: string;
    match?: Match;
    line: MatchLineConfig;
    placeholder?: MatchPlaceholder;
  };
};

const line = (
  leftLine: boolean,
  rightLine: boolean,
  rightConnectingLine: boolean,
  leftConnectingLine: boolean,
  connectingLineHeight: string
): MatchLineConfig => ({
  leftLine,
  rightLine,
  rightConnectingLine,
  leftConnectingLine,
  connectingLineHeight,
});

function groupMatchesByStage(matches: Match[]) {
  return {
    roundOf32: sortMatchesById(matches.filter(match => match.stage === "RoundOf32")),
    roundOf16: sortMatchesById(matches.filter(match => match.stage === "RoundOf16")),
    quarterFinals: sortMatchesById(matches.filter(match => match.stage === "QuarterFinals")),
    semiFinals: sortMatchesById(matches.filter(match => match.stage === "SemiFinals")),
    thirdPlace: sortMatchesById(matches.filter(match => match.stage === "ThirdPlace")),
    final: sortMatchesById(matches.filter(match => match.stage === "Final")),
  };
}

function getTeamsMap(teams: Team[]) {
  return new Map(teams.map(team => [team.id, team]));
}

export default function KnockoutStage({
  data,
  editable = false,
  onScoreChange,
  onPenaltyChange,
}: KnockoutStageProps) {
  const teamsMap = getTeamsMap(data?.teams ?? []);
  const matchesByStage = groupMatchesByStage(data?.matches ?? []);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const y = e.pageY - scrollContainerRef.current.offsetTop;
    const walkX = (x - startX) * 2;
    const walkY = (y - startY) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walkX;
    scrollContainerRef.current.scrollTop = scrollTop - walkY;
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setStartY(e.pageY - scrollContainerRef.current.offsetTop);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    setScrollTop(scrollContainerRef.current.scrollTop);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const columns: MatchColumnConfig[] = [
    {
      className: "flex flex-col justify-around gap-3",
      matches: matchesByStage.roundOf32.slice(0, 8),
      placeholders: roundOf32Placeholders.slice(0, 8),
      lines: Array.from({ length: 8 }, (_, index) =>
        line(false, true, index % 2 === 0, false, "h-28")
      ),
    },
    {
      className: "flex flex-1 flex-col justify-around",
      matches: matchesByStage.roundOf16.slice(0, 4),
      lines: [
        line(true, true, true, false, "h-55"),
        line(true, true, false, false, "h-28"),
        line(true, true, true, false, "h-55"),
        line(true, true, false, false, "h-28"),
      ],
    },
    {
      className: "flex flex-1 flex-col justify-around",
      matches: matchesByStage.quarterFinals.slice(0, 2),
      lines: [
        line(true, true, true, false, "h-109.5"),
        line(true, true, false, false, "h-55"),
      ],
    },
    {
      className: "flex flex-1 flex-col justify-around",
      matches: matchesByStage.semiFinals.slice(0, 1),
      lines: [line(true, true, true, false, "h-60")],
    },
    {
      className: "relative flex flex-1 flex-col justify-around",
      matches: matchesByStage.final.slice(0, 1),
      lines: [line(true, true, true, false, "h-60")],
      absoluteMatch: {
        className: "absolute w-full top-156.75",
        match: matchesByStage.thirdPlace[0],
        line: line(true, true, false, false, "h-109.5"),
      },
    },
    {
      className: "relative flex flex-1 flex-col justify-around",
      matches: matchesByStage.semiFinals.slice(1, 2),
      lines: [line(true, true, false, false, "h-60")],
    },
    {
      className: "flex flex-1 flex-col justify-around",
      matches: matchesByStage.quarterFinals.slice(2, 4),
      lines: [
        line(true, true, false, true, "h-109.5"),
        line(true, true, false, false, "h-55"),
      ],
    },
    {
      className: "flex flex-1 flex-col justify-around",
      matches: matchesByStage.roundOf16.slice(4, 8),
      lines: [
        line(true, true, false, true, "h-55"),
        line(true, true, false, false, "h-28"),
        line(true, true, false, true, "h-55"),
        line(true, true, false, false, "h-28"),
      ],
    },
    {
      className: "flex flex-1 flex-col justify-around gap-3",
      matches: matchesByStage.roundOf32.slice(8, 16),
      placeholders: roundOf32Placeholders.slice(8, 16),
      lines: Array.from({ length: 8 }, (_, index) =>
        line(true, false, false, index % 2 === 0, "h-28")
      ),
    },
  ];

  return (
    <div 
      ref={scrollContainerRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      className={`w-full max-h-[70vh] overflow-auto px-4 pb-8 no-scrollbar touch-none ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      <div className="mx-auto flex min-w-max justify-start gap-8 py-4 sm:justify-center lg:gap-10">
        {columns.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className={`${column.className} select-none`}
          >
            {column.lines.map((lineConfig, matchIndex) => (
              <KnockoutMatch
                key={`${columnIndex}-${matchIndex}`}
                {...lineConfig}
                match={column.matches[matchIndex]}
                teamsMap={teamsMap}
                homePlaceholder={column.placeholders?.[matchIndex]?.home}
                awayPlaceholder={column.placeholders?.[matchIndex]?.away}
                editable={editable}
                onScoreChange={onScoreChange}
                onPenaltyChange={onPenaltyChange}
              />
            ))}

            {column.absoluteMatch && (
              <div className={column.absoluteMatch.className}>
                <KnockoutMatch
                  {...column.absoluteMatch.line}
                  match={column.absoluteMatch.match}
                  teamsMap={teamsMap}
                  homePlaceholder={column.absoluteMatch.placeholder?.home}
                  awayPlaceholder={column.absoluteMatch.placeholder?.away}
                  editable={editable}
                  onScoreChange={onScoreChange}
                  onPenaltyChange={onPenaltyChange}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
