import { useRef, useState, useLayoutEffect, type MouseEvent } from "react";
import type { Match, Team, WorldCupResponse } from "../../../api/types";
import {
  roundOf32Placeholders,
  sortMatchesById,
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
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [paths, setPaths] = useState<string[]>([]);

  useLayoutEffect(() => {
    if (!contentRef.current) return;

    const calculatePaths = () => {
      const newPaths: string[] = [];
      const contentEl = contentRef.current;
      if (!contentEl) return;
      const contentRect = contentEl.getBoundingClientRect();
      const matchElements = contentEl.querySelectorAll("[data-match-id]");

      const getCenter = (el: Element) => {
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left - contentRect.left + rect.width / 2,
          y: rect.top - contentRect.top + rect.height / 2,
          left: rect.left - contentRect.left,
          right: rect.right - contentRect.left,
          top: rect.top - contentRect.top,
          bottom: rect.bottom - contentRect.top,
          width: rect.width,
          height: rect.height,
        };
      };

      const matchMap = new Map();
      matchElements.forEach(el => {
        const id = el.getAttribute("data-match-id");
        if (id) matchMap.set(id, el);
      });

      const drawElbow = (start: any, end: any, direction: "right" | "left") => {
        const midX = (start.x + end.x) / 2;
        if (direction === "right") {
          return `M ${start.right} ${start.y} H ${midX} V ${end.y} H ${end.left}`;
        } else {
          return `M ${start.left} ${start.y} H ${midX} V ${end.y} H ${end.right}`;
        }
      };

      const connect = (
        sourceMatches: Match[],
        targetMatches: Match[],
        sourcePerTarget: number
      ) => {
        targetMatches.forEach((target, i) => {
          const targetEl = matchMap.get(String(target.id));
          if (!targetEl) return;
          const targetPos = getCenter(targetEl);

          for (let j = 0; j < sourcePerTarget; j++) {
            const source = sourceMatches[i * sourcePerTarget + j];
            if (!source) continue;
            const sourceEl = matchMap.get(String(source.id));
            if (!sourceEl) continue;
            const sourcePos = getCenter(sourceEl);
            const dir = sourcePos.x < targetPos.x ? "right" : "left";
            newPaths.push(drawElbow(sourcePos, targetPos, dir));
          }
        });
      };

      const left32 = matchesByStage.roundOf32.slice(0, 8);
      const right32 = matchesByStage.roundOf32.slice(8, 16);
      const left16 = matchesByStage.roundOf16.slice(0, 4);
      const right16 = matchesByStage.roundOf16.slice(4, 8);
      const leftQF = matchesByStage.quarterFinals.slice(0, 2);
      const rightQF = matchesByStage.quarterFinals.slice(2, 4);
      const leftSF = matchesByStage.semiFinals.slice(0, 1);
      const rightSF = matchesByStage.semiFinals.slice(1, 2);
      const final = matchesByStage.final;

      connect(left32, left16, 2);
      connect(right32, right16, 2);
      connect(left16, leftQF, 2);
      connect(right16, rightQF, 2);
      connect(leftQF, leftSF, 2);
      connect(rightQF, rightSF, 2);
      connect(leftSF, final, 1);
      connect(rightSF, final, 1);

      setPaths(newPaths);
    };

    const timer = setTimeout(calculatePaths, 100);
    window.addEventListener("resize", calculatePaths);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculatePaths);
    };
  }, [data, editable, matchesByStage]);

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

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div
      ref={scrollContainerRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      className={`no-scrollbar w-full max-h-[80vh] overflow-auto px-4 pb-12 touch-none ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      <div
        ref={contentRef}
        className="relative mx-auto flex min-w-max gap-12 p-8 py-12 lg:gap-16 sm:justify-center"
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          {paths.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted-foreground/60 transition-all duration-300"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>

        {/* Round of 32 Left */}
        <div className="flex flex-col justify-around gap-6">
          {matchesByStage.roundOf32.slice(0, 8).map((match, i) => (
            <KnockoutMatch
              key={match.id}
              match={match}
              teamsMap={teamsMap}
              homePlaceholder={roundOf32Placeholders[i].home}
              awayPlaceholder={roundOf32Placeholders[i].away}
              editable={editable}
              onScoreChange={onScoreChange}
              onPenaltyChange={onPenaltyChange}
            />
          ))}
        </div>

        {/* Round of 16 Left */}
        <div className="flex flex-col justify-around gap-12">
          {matchesByStage.roundOf16.slice(0, 4).map(match => (
            <KnockoutMatch
              key={match.id}
              match={match}
              teamsMap={teamsMap}
              editable={editable}
              onScoreChange={onScoreChange}
              onPenaltyChange={onPenaltyChange}
            />
          ))}
        </div>

        {/* Quarter Finals Left */}
        <div className="flex flex-col justify-around gap-24">
          {matchesByStage.quarterFinals.slice(0, 2).map(match => (
            <KnockoutMatch key={match.id} match={match} teamsMap={teamsMap} editable={editable} onScoreChange={onScoreChange} onPenaltyChange={onPenaltyChange} />
          ))}
        </div>

        {/* Semi Finals Left */}
        <div className="flex flex-col justify-around gap-32">
          <KnockoutMatch match={matchesByStage.semiFinals[0]} teamsMap={teamsMap} editable={editable} onScoreChange={onScoreChange} onPenaltyChange={onPenaltyChange} />
        </div>

        {/* Final + Third Place */}
        <div className="flex flex-col justify-center gap-24">
          <div className="flex flex-col gap-20">
            <div className="flex flex-col items-center gap-2">
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-gold">Final</span>
              <KnockoutMatch match={matchesByStage.final[0]} teamsMap={teamsMap} editable={editable} onScoreChange={onScoreChange} onPenaltyChange={onPenaltyChange} />
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">3º Lugar</span>
              <KnockoutMatch match={matchesByStage.thirdPlace[0]} teamsMap={teamsMap} editable={editable} onScoreChange={onScoreChange} onPenaltyChange={onPenaltyChange} />
            </div>
          </div>
        </div>

        {/* Semi Finals Right */}
        <div className="flex flex-col justify-around gap-32">
          <KnockoutMatch match={matchesByStage.semiFinals[1]} teamsMap={teamsMap} editable={editable} onScoreChange={onScoreChange} onPenaltyChange={onPenaltyChange} />
        </div>

        {/* Quarter Finals Right */}
        <div className="flex flex-col justify-around gap-24">

          {matchesByStage.quarterFinals.slice(2, 4).map(match => (
            <KnockoutMatch
              key={match.id}
              match={match}
              teamsMap={teamsMap}
              editable={editable}
              onScoreChange={onScoreChange}
              onPenaltyChange={onPenaltyChange}
            />
          ))}
        </div>

        {/* Round of 16 Right */}
        <div className="flex flex-col justify-around gap-12">
          {matchesByStage.roundOf16.slice(4, 8).map(match => (
            <KnockoutMatch
              key={match.id}
              match={match}
              teamsMap={teamsMap}
              editable={editable}
              onScoreChange={onScoreChange}
              onPenaltyChange={onPenaltyChange}
            />
          ))}
        </div>

        {/* Round of 32 Right */}
        <div className="flex flex-col justify-around gap-6">
          {matchesByStage.roundOf32.slice(8, 16).map((match, i) => (
            <KnockoutMatch
              key={match.id}
              match={match}
              teamsMap={teamsMap}
              homePlaceholder={roundOf32Placeholders[i + 8].home}
              awayPlaceholder={roundOf32Placeholders[i + 8].away}
              editable={editable}
              onScoreChange={onScoreChange}
              onPenaltyChange={onPenaltyChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
