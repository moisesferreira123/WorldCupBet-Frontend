export type Team = {
   id: number;
   name: string;
   tla: string;
   flagUri: string;
};

export type Standings = {
   teamId: number;
   position: number;
   playedGames: number;
   won: number;
   draw: number;
   lost: number;
   goalsFor: number;
   goalsAgainst: number;
   goalsDifference: number;
   points: number;
};

export type Group = {
   group: string;
   standings: Standings[]
};

export type Match = {
   id: number;
   utcDate: string;
   status: string;
   stage: string;
   homeTeamId: number | null;
   awayTeamId: number | null;
   homeTeamGoals: number | null;
   awayTeamGoals: number | null;
   homeTeamPenalties: number | null;
   awayTeamPenalties: number | null;
   predictionPoints?: number | null;
};

export type WorldCupResponse = {
   teams: Team[];
   groups: Group[];
   matches: Match[];
};

export type MatchPrediction = {
   matchId: number;
   homeTeamId: number;
   awayTeamId: number;
   homeTeamGoals: number;
   awayTeamGoals: number;
   winnerTeamId: number | null;
   points: number;
};

export type BetResponse = {
   id: string;
   title: string;
   predictions: MatchPrediction[];
   totalPoints: number;
   position: number;
   correctPredictions: number;
};

export type RankResponse = {
   items: BetResponse[];
   totalItems: number;
}

export type CreateMatchPredictionRequest = {
   MatchId: number;
   HomeTeamId: number;
   AwayTeamId: number;
   HomeTeamScore: number;
   AwayTeamScore: number;
   WinnerTeamId: number | null;
};

export type CreateBetRequest = {
   Title: string;
   Predictions: CreateMatchPredictionRequest[];
};