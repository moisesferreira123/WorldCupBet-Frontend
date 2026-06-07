import type { Match, Team, WorldCupResponse } from "../../../api/types";
import KnockoutMatch from "./KnockoutMatch";

type KnockoutStageProps = {
  data?: WorldCupResponse;
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

type MatchPlaceholder = {
  home: string;
  away: string;
};

const roundOf32Placeholders: MatchPlaceholder[] = [
  { home: "1ºE", away: "3ºA/3ºB/3ºC/3ºD/3ºF" },
  { home: "1ºI", away: "3ºC/3ºD/3ºF/3ºG/3ºH" },
  { home: "2ºA", away: "2ºB" },
  { home: "1ºF", away: "2ºC" },
  { home: "2ºK", away: "2ºL" },
  { home: "1ºH", away: "2ºJ" },
  { home: "1ºD", away: "3ºB/3ºE/3ºF/3ºI/3ºJ" },
  { home: "1ºG", away: "3ºA/3ºE/3ºH/3ºI/3ºJ" },
  { home: "1ºC", away: "2ºF" },
  { home: "2ºE", away: "2ºI" },
  { home: "1ºA", away: "3ºC/3ºE/3ºF/3ºH/3ºI" },
  { home: "1ºL", away: "3ºE/3ºH/3ºI/3ºJ/3ºK" },
  { home: "1ºJ", away: "2ºH" },
  { home: "2ºD", away: "2ºG" },
  { home: "1ºB", away: "3ºE/3ºF/3ºG/3ºI/3ºJ" },
  { home: "1ºK", away: "3ºD/3ºE/3ºI/3ºJ/3ºL" },
];

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

function sortMatchesById(matches: Match[]) {
  return [...matches].sort((first, second) => first.id - second.id);
}

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

export default function KnockoutStage({ data }: KnockoutStageProps) {
  const teamsMap = getTeamsMap(data?.teams ?? []);
  const matchesByStage = groupMatchesByStage(data?.matches ?? []);

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
    <div className="w-full overflow-x-auto px-4 sm:px-8 lg:px-10 no-scrollbar">
      <div className="mx-auto flex min-w-max justify-center gap-6 xl:gap-5">
        {columns.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className={column.className}
          >
            {column.lines.map((lineConfig, matchIndex) => (
              <KnockoutMatch
                key={`${columnIndex}-${matchIndex}`}
                {...lineConfig}
                match={column.matches[matchIndex]}
                teamsMap={teamsMap}
                homePlaceholder={column.placeholders?.[matchIndex]?.home}
                awayPlaceholder={column.placeholders?.[matchIndex]?.away}
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
                />
              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}
