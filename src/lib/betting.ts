import type {
  CreateMatchPredictionRequest,
  Group,
  Match,
  MatchPrediction,
  Standings,
  WorldCupResponse,
} from "../api/types";

export type PredictionDraft = {
  homeTeamGoals: number | null;
  awayTeamGoals: number | null;
  homeTeamPenalties: number | null;
  awayTeamPenalties: number | null;
};

export type PredictionsMap = Record<number, PredictionDraft>;

export type MatchPlaceholder = {
  home: string;
  away: string;
};

export const roundOf32Placeholders: MatchPlaceholder[] = [
  { home: "1E", away: "3rd" },
  { home: "1I", away: "3rd" },
  { home: "2A", away: "2B" },
  { home: "1F", away: "2C" },
  { home: "2K", away: "2L" },
  { home: "1H", away: "2J" },
  { home: "1D", away: "3rd" },
  { home: "1G", away: "3rd" },
  { home: "1C", away: "2F" },
  { home: "2E", away: "2I" },
  { home: "1A", away: "3rd" },
  { home: "1L", away: "3rd" },
  { home: "1J", away: "2H" },
  { home: "2D", away: "2G" },
  { home: "1B", away: "3rd" },
  { home: "1K", away: "3rd" },
];

const groupLetters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
];

const emptyStanding = (teamId: number): Standings => ({
  teamId,
  position: 0,
  playedGames: 0,
  won: 0,
  draw: 0,
  lost: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  goalsDifference: 0,
  points: 0,
});

export function sortMatchesById(matches: Match[]) {
  return [...matches].sort((first, second) => first.id - second.id);
}

function getPrediction(match: Match, predictions: PredictionsMap) {
  return predictions[match.id];
}

function getGroupLetter(groupName: string) {
  return groupName.replace("Group", "");
}

function rankStandings(
  standings: Standings[],
  groupMatches: Match[],
  predictions: PredictionsMap
) {
  return [...standings]
    .sort((a, b) => {
      // 1. Total Points
      if (a.points !== b.points) return b.points - a.points;

      // Tie-break for same points: Confronto Direto
      const tiedWithSamePoints = standings
        .filter(s => s.points === a.points)
        .map(s => s.teamId);

      if (tiedWithSamePoints.length > 1) {
        const h2hStats = calculateH2HStats(
          tiedWithSamePoints,
          groupMatches,
          predictions
        );
        const statA = h2hStats.get(a.teamId)!;
        const statB = h2hStats.get(b.teamId)!;

        // 1a. H2H Points
        if (statA.points !== statB.points) return statB.points - statA.points;
        // 1b. H2H GD
        if (statA.goalsDifference !== statB.goalsDifference)
          return statB.goalsDifference - statA.goalsDifference;
        // 1c. H2H GF
        if (statA.goalsFor !== statB.goalsFor)
          return statB.goalsFor - statA.goalsFor;
      }

      // 2. Overall GD
      if (a.goalsDifference !== b.goalsDifference)
        return b.goalsDifference - a.goalsDifference;

      // 3. Overall GF
      if (a.goalsFor !== b.goalsFor) return b.goalsFor - a.goalsFor;

      // Fallback
      return a.teamId - b.teamId;
    })
    .map((standing, index) => ({
      ...standing,
      position: index + 1,
    }));
}

type H2HStats = {
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalsDifference: number;
};

function calculateH2HStats(
  teamIds: number[],
  matches: Match[],
  predictions: PredictionsMap
): Map<number, H2HStats> {
  const stats = new Map<number, H2HStats>();
  teamIds.forEach(id =>
    stats.set(id, {
      points: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalsDifference: 0,
    })
  );

  const teamIdSet = new Set(teamIds);

  matches.forEach(match => {
    if (match.homeTeamId === null || match.awayTeamId === null) return;
    if (!teamIdSet.has(match.homeTeamId) || !teamIdSet.has(match.awayTeamId))
      return;

    const prediction = predictions[match.id];
    if (
      prediction?.homeTeamGoals === null ||
      prediction?.homeTeamGoals === undefined ||
      prediction?.awayTeamGoals === null ||
      prediction?.awayTeamGoals === undefined
    ) {
      return;
    }

    const home = stats.get(match.homeTeamId)!;
    const away = stats.get(match.awayTeamId)!;

    home.goalsFor += prediction.homeTeamGoals;
    home.goalsAgainst += prediction.awayTeamGoals;
    away.goalsFor += prediction.awayTeamGoals;
    away.goalsAgainst += prediction.homeTeamGoals;

    if (prediction.homeTeamGoals > prediction.awayTeamGoals) {
      home.points += 3;
    } else if (prediction.homeTeamGoals < prediction.awayTeamGoals) {
      away.points += 3;
    } else {
      home.points += 1;
      away.points += 1;
    }
  });

  teamIds.forEach(id => {
    const s = stats.get(id)!;
    s.goalsDifference = s.goalsFor - s.goalsAgainst;
  });

  return stats;
}

function applyGroupMatch(
  standingsMap: Map<number, Standings>,
  match: Match,
  predictions: PredictionsMap
) {
  const prediction = getPrediction(match, predictions);

  if (
    match.homeTeamId === null ||
    match.awayTeamId === null ||
    prediction?.homeTeamGoals === null ||
    prediction?.homeTeamGoals === undefined ||
    prediction?.awayTeamGoals === null ||
    prediction?.awayTeamGoals === undefined
  ) {
    return;
  }

  const home = standingsMap.get(match.homeTeamId);
  const away = standingsMap.get(match.awayTeamId);

  if (!home || !away) {
    return;
  }

  home.playedGames += 1;
  away.playedGames += 1;
  home.goalsFor += prediction.homeTeamGoals;
  home.goalsAgainst += prediction.awayTeamGoals;
  away.goalsFor += prediction.awayTeamGoals;
  away.goalsAgainst += prediction.homeTeamGoals;
  home.goalsDifference = home.goalsFor - home.goalsAgainst;
  away.goalsDifference = away.goalsFor - away.goalsAgainst;

  if (prediction.homeTeamGoals > prediction.awayTeamGoals) {
    home.won += 1;
    home.points += 3;
    away.lost += 1;
    return;
  }

  if (prediction.homeTeamGoals < prediction.awayTeamGoals) {
    away.won += 1;
    away.points += 3;
    home.lost += 1;
    return;
  }

  home.draw += 1;
  away.draw += 1;
  home.points += 1;
  away.points += 1;
}

export function buildPredictionsFromMatches(matches: Match[]): PredictionsMap {
  return Object.fromEntries(
    matches.map(match => [
      match.id,
      {
        homeTeamGoals: null,
        awayTeamGoals: null,
        homeTeamPenalties: null,
        awayTeamPenalties: null,
      },
    ])
  );
}


export function applyBetPredictions(
  current: PredictionsMap,
  predictions: MatchPrediction[]
): PredictionsMap {
  const next = { ...current };

  predictions.forEach(prediction => {
    next[prediction.matchId] = {
      ...(next[prediction.matchId] ?? {
        homeTeamPenalties: null,
        awayTeamPenalties: null,
      }),
      homeTeamGoals: prediction.homeTeamGoals,
      awayTeamGoals: prediction.awayTeamGoals,
    };
  });

  return next;
}

function buildGroups(data: WorldCupResponse, predictions: PredictionsMap): Group[] {
  return data.groups.map(group => {
    const standingsMap = new Map(
      group.standings.map(standing => [
        standing.teamId,
        emptyStanding(standing.teamId),
      ])
    );

    const groupTeamIds = new Set(
      group.standings.map(standing => standing.teamId)
    );

    const groupMatches = data.matches
      .filter(match => match.stage === "GroupStage")
      .filter(
        match =>
          match.homeTeamId !== null &&
          match.awayTeamId !== null &&
          groupTeamIds.has(match.homeTeamId) &&
          groupTeamIds.has(match.awayTeamId)
      );

    groupMatches.forEach(match =>
      applyGroupMatch(standingsMap, match, predictions)
    );

    return {
      ...group,
      standings: rankStandings(
        Array.from(standingsMap.values()),
        groupMatches,
        predictions
      ),
    };
  });
}

function getGroupRankings(groups: Group[]) {
  return new Map(
    groups.map(group => [
      getGroupLetter(group.group),
      group.standings.sort((first, second) => first.position - second.position),
    ])
  );
}

function getQualifiedTeamId(
  placeholder: string,
  rankings: Map<string, Standings[]>
) {
  const match = placeholder.match(/^([12])([A-L])$/);

  if (match) {
    const position = Number(match[1]);
    const groupLetter = match[2];
    return rankings.get(groupLetter)?.[position - 1]?.teamId ?? null;
  }

  return null;
}

const thirdPlaceMappingFetch = fetch("/third-place-table.json").then(res => res.json());
let thirdPlaceMapping: Record<string, Record<string, string>> | null = null;
thirdPlaceMappingFetch.then(data => (thirdPlaceMapping = data));

function getThirdPlaceOpponent(
  homePlaceholder: string,
  bestThirdGroups: string[],
  rankings: Map<string, Standings[]>
) {
  if (!thirdPlaceMapping) return null;

  const key = bestThirdGroups.sort().join("");
  const mapping = thirdPlaceMapping[key];
  if (!mapping) return null;

  const opponentCode = mapping[`${homePlaceholder}_vs`]; // e.g., "3E"
  if (!opponentCode) return null;

  const groupLetter = opponentCode[1]; // "E"
  return rankings.get(groupLetter)?.[2]?.teamId ?? null;
}

function getWinnerTeamId(match: Match, predictions: PredictionsMap) {
  const prediction = getPrediction(match, predictions);

  if (
    match.homeTeamId === null ||
    match.awayTeamId === null ||
    prediction?.homeTeamGoals === null ||
    prediction?.homeTeamGoals === undefined ||
    prediction?.awayTeamGoals === null ||
    prediction?.awayTeamGoals === undefined
  ) {
    return null;
  }

  if (prediction.homeTeamGoals > prediction.awayTeamGoals) return match.homeTeamId;
  if (prediction.homeTeamGoals < prediction.awayTeamGoals) return match.awayTeamId;

  if (
    prediction.homeTeamPenalties !== null &&
    prediction.homeTeamPenalties !== undefined &&
    prediction.awayTeamPenalties !== null &&
    prediction.awayTeamPenalties !== undefined
  ) {
    if (prediction.homeTeamPenalties > prediction.awayTeamPenalties) return match.homeTeamId;
    if (prediction.homeTeamPenalties < prediction.awayTeamPenalties) return match.awayTeamId;
  }

  return null;
}

function getLoserTeamId(match: Match, winnerTeamId: number | null) {
  if (winnerTeamId === null) return null;
  if (match.homeTeamId === winnerTeamId) return match.awayTeamId;
  if (match.awayTeamId === winnerTeamId) return match.homeTeamId;
  return null;
}

function assignNextRound(
  matches: Match[],
  previousMatches: Match[],
  predictions: PredictionsMap
) {
  matches.forEach((match, index) => {
    const firstSource = previousMatches[index * 2];
    const secondSource = previousMatches[index * 2 + 1];

    match.homeTeamId = firstSource ? getWinnerTeamId(firstSource, predictions) : null;
    match.awayTeamId = secondSource ? getWinnerTeamId(secondSource, predictions) : null;
  });
}

export function buildPredictedWorldCup(
  data: WorldCupResponse,
  predictions: PredictionsMap
): WorldCupResponse {
  const matches = data.matches.map(match => {
    const prediction = getPrediction(match, predictions);

    return {
      ...match,
      homeTeamGoals: prediction?.homeTeamGoals ?? null,
      awayTeamGoals: prediction?.awayTeamGoals ?? null,
      homeTeamPenalties: prediction?.homeTeamPenalties ?? null,
      awayTeamPenalties: prediction?.awayTeamPenalties ?? null,
    };
  });

  const groups = buildGroups(data, predictions);
  const rankings = getGroupRankings(groups);
  const thirdPlaceTeams = groupLetters
    .map(groupLetter => {
      const standing = rankings.get(groupLetter)?.[2];
      return standing ? { ...standing, groupLetter } : null;
    })
    .filter((standing): standing is Standings & { groupLetter: string } => standing !== null)
    .sort((first, second) => {
      if (first.points !== second.points) return second.points - first.points;
      if (first.goalsDifference !== second.goalsDifference) {
        return second.goalsDifference - first.goalsDifference;
      }
      if (first.goalsFor !== second.goalsFor) return second.goalsFor - first.goalsFor;
      return first.teamId - second.teamId;
    });

  const bestThirdGroups = thirdPlaceTeams
    .slice(0, 8)
    .map(team => team.groupLetter);

  const roundOf32 = sortMatchesById(
    matches.filter(match => match.stage === "RoundOf32")
  );
  roundOf32.forEach((match, index) => {
    const placeholder = roundOf32Placeholders[index];
    if (!placeholder) return;

    // Home Team Assignment
    if (placeholder.home === "3rd") {
      match.homeTeamId =
        match.homeTeamId ??
        getThirdPlaceOpponent(placeholder.away, bestThirdGroups, rankings);
    } else {
      match.homeTeamId =
        match.homeTeamId ?? getQualifiedTeamId(placeholder.home, rankings);
    }

    // Away Team Assignment
    if (placeholder.away === "3rd") {
      match.awayTeamId =
        match.awayTeamId ??
        getThirdPlaceOpponent(placeholder.home, bestThirdGroups, rankings);
    } else {
      match.awayTeamId =
        match.awayTeamId ?? getQualifiedTeamId(placeholder.away, rankings);
    }
  });

  const roundOf16 = sortMatchesById(matches.filter(match => match.stage === "RoundOf16"));
  const quarterFinals = sortMatchesById(matches.filter(match => match.stage === "QuarterFinals"));
  const semiFinals = sortMatchesById(matches.filter(match => match.stage === "SemiFinals"));
  const thirdPlace = sortMatchesById(matches.filter(match => match.stage === "ThirdPlace"));
  const final = sortMatchesById(matches.filter(match => match.stage === "Final"));

  assignNextRound(roundOf16, roundOf32, predictions);
  assignNextRound(quarterFinals, roundOf16, predictions);
  assignNextRound(semiFinals, quarterFinals, predictions);
  assignNextRound(final, semiFinals, predictions);

  if (thirdPlace[0]) {
    const firstSemiWinner = semiFinals[0] ? getWinnerTeamId(semiFinals[0], predictions) : null;
    const secondSemiWinner = semiFinals[1] ? getWinnerTeamId(semiFinals[1], predictions) : null;

    thirdPlace[0].homeTeamId = semiFinals[0]
      ? getLoserTeamId(semiFinals[0], firstSemiWinner)
      : null;
    thirdPlace[0].awayTeamId = semiFinals[1]
      ? getLoserTeamId(semiFinals[1], secondSemiWinner)
      : null;
  }

  return {
    ...data,
    groups,
    matches,
  };
}

export function updateScore(
  predictions: PredictionsMap,
  matchId: number,
  side: "home" | "away",
  value: number | null
): PredictionsMap {
  const current = predictions[matchId] ?? {
    homeTeamGoals: null,
    awayTeamGoals: null,
    homeTeamPenalties: null,
    awayTeamPenalties: null,
  };

  const next = { ...current };
  
  if (side === "home") {
    next.homeTeamGoals = value;
    if (value !== null && next.awayTeamGoals === null) {
      next.awayTeamGoals = 0;
    }
  } else {
    next.awayTeamGoals = value;
    if (value !== null && next.homeTeamGoals === null) {
      next.homeTeamGoals = 0;
    }
  }

  // Clear penalties if it's no longer a draw
  if (
    next.homeTeamGoals !== null &&
    next.awayTeamGoals !== null &&
    next.homeTeamGoals !== next.awayTeamGoals
  ) {
    next.homeTeamPenalties = null;
    next.awayTeamPenalties = null;
  }

  return {
    ...predictions,
    [matchId]: next,
  };
}

export function updatePenalties(
  predictions: PredictionsMap,
  matchId: number,
  side: "home" | "away",
  value: number | null
): PredictionsMap {
  const current = predictions[matchId] ?? {
    homeTeamGoals: null,
    awayTeamGoals: null,
    homeTeamPenalties: null,
    awayTeamPenalties: null,
  };

  return {
    ...predictions,
    [matchId]: {
      ...current,
      [side === "home" ? "homeTeamPenalties" : "awayTeamPenalties"]: value,
    },
  };
}

export function buildCreateBetPredictions(
  data: WorldCupResponse,
  predictions: PredictionsMap
): CreateMatchPredictionRequest[] {
  return data.matches
    .map(match => {
      const prediction = getPrediction(match, predictions);
      const winnerTeamId = getWinnerTeamId(match, predictions);

      if (
        match.homeTeamId === null ||
        match.awayTeamId === null ||
        prediction?.homeTeamGoals === null ||
        prediction?.homeTeamGoals === undefined ||
        prediction?.awayTeamGoals === null ||
        prediction?.awayTeamGoals === undefined
      ) {
        return null;
      }

      return {
        MatchId: match.id,
        HomeTeamId: match.homeTeamId,
        AwayTeamId: match.awayTeamId,
        HomeTeamScore: prediction.homeTeamGoals,
        AwayTeamScore: prediction.awayTeamGoals,
        WinnerTeamId: winnerTeamId,
      };
    })
    .filter(
      (prediction): prediction is CreateMatchPredictionRequest =>
        prediction !== null
    );
}
