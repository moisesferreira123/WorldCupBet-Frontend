import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/shared/Header";
import PhaseSelector from "../components/stage/StageSelector";
import KnockoutStage from "../components/stage/knockoutStage/KnockoutStage";
import GroupStage from "../components/stage/groupStage/GroupStage";
import GroupStageSkeleton from "../components/stage/groupStage/GroupStageSkeleton";
import ReportError from "../components/error/ReportError";
import { createBet, getBet, getWorldCupData } from "../api/client";
import type { BetResponse, WorldCupResponse } from "../api/types";
import {
  applyBetPredictions,
  buildCreateBetPredictions,
  buildPredictedWorldCup,
  buildPredictionsFromMatches,
  updatePenalties,
  updateScore,
  type PredictionsMap,
} from "../lib/betting";
import { Trophy, CheckCircle2, Lock } from "lucide-react";
import { TOURNAMENT_START_DATE } from "../components/shared/CountdownTimer";

const betStorageKey = "word-cup-bet-id";

async function getWorldCupQuery(): Promise<WorldCupResponse> {
  const response = await getWorldCupData();

  if (response.status === 200 && response.data) {
    return response.data;
  }

  throw new Error(response.errors.join(", "));
}

async function getBetQuery(betId: string): Promise<BetResponse> {
  const response = await getBet(betId);

  if (response.status === 200 && response.data) {
    return response.data;
  }

  throw new Error(response.errors.join(", "));
}

export default function Home() {
  const [isGroupStage, setIsGroupStage] = useState(
    sessionStorage.getItem("is-group-stage")
      ? sessionStorage.getItem("is-group-stage") === "true"
      : true
  );
  const [savedBetId, setSavedBetId] = useState(() =>
    localStorage.getItem(betStorageKey)
  );
  const [title, setTitle] = useState("");
  const [predictions, setPredictions] = useState<PredictionsMap>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    isLoading: isWorldCupLoading,
    error: worldCupError,
    data,
  } = useQuery<WorldCupResponse>({
    queryKey: ["worldcup"],
    queryFn: getWorldCupQuery,
    staleTime: 15 * 60 * 1000,
  });

  const {
    isLoading: isBetLoading,
    error: betError,
    data: bet,
  } = useQuery<BetResponse>({
    queryKey: ["bet", savedBetId],
    queryFn: async () => getBetQuery(savedBetId ?? ""),
    enabled: savedBetId !== null,
    staleTime: 15 * 60 * 1000,
  });

  const isViewMode = !!savedBetId && !!bet;
  const isTournamentStarted = useMemo(() => new Date() >= TOURNAMENT_START_DATE, []);

  useEffect(() => {
    if (!data) return;

    const initialPredictions = buildPredictionsFromMatches(data.matches);

    if (bet) {
      setPredictions(applyBetPredictions(initialPredictions, bet.predictions));
      setTitle(bet.title);
    } else {
      setPredictions(initialPredictions);
    }
  }, [data, bet]);

  const predictedData = useMemo(() => {
    if (!data) return null;
    return buildPredictedWorldCup(data, predictions);
  }, [data, predictions]);

  const createPredictions = useMemo(() => {
    if (!predictedData) return [];
    return buildCreateBetPredictions(predictedData, predictions);
  }, [predictedData, predictions]);

  const totalMatches = 104;
  const completedMatchesCount = createPredictions.length;
  const isComplete = completedMatchesCount === totalMatches;
  const error = worldCupError ?? betError;

  function changeToGroupStage() {
    setIsGroupStage(true);
    sessionStorage.setItem("is-group-stage", "true");
  }

  function changeToKnockoutStage() {
    setIsGroupStage(false);
    sessionStorage.setItem("is-group-stage", "false");
  }

  function handleScoreChange(
    matchId: number,
    side: "home" | "away",
    value: number | null
  ) {
    if (isViewMode || isTournamentStarted) return;
    setPredictions(current => updateScore(current, matchId, side, value));
  }

  function handlePenaltyChange(
    matchId: number,
    side: "home" | "away",
    value: number | null
  ) {
    if (isViewMode || isTournamentStarted) return;
    setPredictions(current => updatePenalties(current, matchId, side, value));
  }

  async function handleSubmit() {
    if (isViewMode || isTournamentStarted || !predictedData) return;

    if (title.length < 5 || title.length > 50) {
      setSaveError("O título deve ter entre 5 e 50 caracteres.");
      return;
    }

    if (!isComplete) {
      setSaveError(`Você precisa preencher todos os ${totalMatches} jogos.`);
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    const response = await createBet({
      Title: title.trim(),
      Predictions: createPredictions,
    });

    setIsSaving(false);

    if (response.status >= 200 && response.status < 300 && response.data) {
      localStorage.setItem(betStorageKey, response.data.id);
      setSavedBetId(response.data.id);
      return;
    }

    setSaveError(response.errors.join(", "));
  }

  if (error instanceof Error) return <ReportError error={error} />;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="flex flex-col items-center px-4 pt-24 pb-28">
        {isTournamentStarted && !isViewMode && (
          <div className="mb-6 flex w-full max-w-6xl items-center gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-warning shadow-lg">
            <Lock size={20} />
            <div className="text-sm font-bold uppercase tracking-tight">
              As apostas foram encerradas. A Copa do Mundo 2026 já começou!
            </div>
          </div>
        )}

        <div className="mb-6 flex w-full max-w-6xl flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              {isViewMode || isTournamentStarted ? (
                <h1 className="truncate text-2xl font-bold text-foreground sm:text-3xl">
                  {isViewMode ? title : "Apostas Encerradas"}
                </h1>
              ) : (
                <input
                  value={title}
                  onChange={event => setTitle(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-xl font-bold outline-none transition-all focus:border-gold focus:bg-background focus:ring-1 focus:ring-gold sm:text-2xl"
                  placeholder="Nome do seu bolão (ex: Bolão do Pedro)"
                  aria-label="Nome do bolão"
                />
              )}
            </div>

            {!isViewMode && !isTournamentStarted && (
              <button
                onClick={handleSubmit}
                disabled={isSaving || !isComplete}
                className="h-12 shrink-0 rounded-xl bg-gold px-8 font-bold text-gold-foreground shadow-lg shadow-gold/20 transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale"
              >
                {isSaving ? "Enviando..." : "Criar Bolão"}
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
            {isViewMode ? (
              <>
                <div className="flex items-center gap-1.5 text-gold">
                  <Trophy size={16} />
                  <span>{bet?.totalPoints ?? 0} pontos</span>
                </div>
                <div className="flex items-center gap-1.5 text-success">
                  <CheckCircle2 size={16} />
                  <span>{bet?.correctPredictions ?? 0} acertos</span>
                </div>
                <div className="text-muted-foreground/60">
                  ID: {savedBetId}
                </div>
              </>
            ) : (
              <div className={`${isComplete ? "text-success" : "text-muted-foreground"}`}>
                {isTournamentStarted ? "Período de apostas encerrado" : `${completedMatchesCount}/${totalMatches} jogos preenchidos`}
              </div>
            )}
          </div>

          {saveError && (
            <div className="text-sm font-semibold text-destructive">
              {saveError}
            </div>
          )}
        </div>

        {isWorldCupLoading || isBetLoading || !predictedData ? (
          <GroupStageSkeleton />
        ) : (
          <div className={`w-full animate-in fade-in duration-500 ${isGroupStage ? 'max-w-6xl' : ''}`}>
            {isGroupStage ? (
              <GroupStage
                data={predictedData}
                realData={isViewMode ? data : undefined}
                editable={!isViewMode && !isTournamentStarted}
                onScoreChange={handleScoreChange}
              />
            ) : (
              <KnockoutStage
                data={predictedData}
                realData={isViewMode ? data : undefined}
                editable={!isViewMode && !isTournamentStarted}
                onScoreChange={handleScoreChange}
                onPenaltyChange={handlePenaltyChange}
              />
            )}
          </div>
        )}
      </main>

      {!error && (
        <PhaseSelector
          isGroupStage={isGroupStage}
          changeToGroupStage={changeToGroupStage}
          changeToKnockoutStage={changeToKnockoutStage}
        />
      )}
    </div>
  );
}
