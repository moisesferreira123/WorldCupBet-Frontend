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
  const [title, setTitle] = useState("Meu bolão");
  const [predictions, setPredictions] = useState<PredictionsMap>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const {
    isLoading: isWorldCupLoading,
    error: worldCupError,
    data,
  } = useQuery<WorldCupResponse>({
    queryKey: ["worldcup"],
    queryFn: getWorldCupQuery,
    staleTime: 1 * 60 * 1000,
  });

  const {
    isLoading: isBetLoading,
    error: betError,
    data: bet,
  } = useQuery<BetResponse>({
    queryKey: ["bet", savedBetId],
    queryFn: async () => getBetQuery(savedBetId ?? ""),
    enabled: savedBetId !== null,
    staleTime: 1 * 60 * 1000,
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    const initialPredictions = buildPredictionsFromMatches(data.matches);

    setPredictions(
      bet
        ? applyBetPredictions(initialPredictions, bet.predictions)
        : initialPredictions
    );

    if (bet?.title) {
      setTitle(bet.title);
    }
  }, [data, bet]);

  const predictedData = useMemo(() => {
    if (!data) {
      return null;
    }

    return buildPredictedWorldCup(data, predictions);
  }, [data, predictions]);

  const createPredictions = useMemo(() => {
    if (!predictedData) {
      return [];
    }

    return buildCreateBetPredictions(predictedData, predictions);
  }, [predictedData, predictions]);

  const totalMatches = data?.matches.length ?? 104;
  const completedMatches = createPredictions.length;
  const error = worldCupError ?? betError;

  function changeToGroupStage() {
    if (!isGroupStage) setIsGroupStage(true);
    sessionStorage.setItem("is-group-stage", "true");
  }

  function changeToKnockoutStage() {
    if (isGroupStage) setIsGroupStage(false);
    sessionStorage.setItem("is-group-stage", "false");
  }

  function handleScoreChange(
    matchId: number,
    side: "home" | "away",
    value: number | null
  ) {
    setPredictions(current => updateScore(current, matchId, side, value));
    setSavedMessage(null);
  }

  function handlePenaltyChange(
    matchId: number,
    side: "home" | "away",
    value: number | null
  ) {
    setPredictions(current => updatePenalties(current, matchId, side, value));
    setSavedMessage(null);
  }

  async function handleSubmit() {
    if (!predictedData) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSavedMessage(null);

    const response = await createBet({
      Title: title.trim() || "Meu bolão",
      Predictions: createPredictions,
    });

    setIsSaving(false);

    if (response.status >= 200 && response.status < 300 && response.data) {
      localStorage.setItem(betStorageKey, response.data.id);
      setSavedBetId(response.data.id);
      setSavedMessage("Aposta salva com sucesso.");
      return;
    }

    setSaveError(response.errors.join(", "));
  }

  return (
    <div>
      <Header />

      <main className="flex flex-col items-center justify-center px-4 pt-20 pb-28">
        <div className="mb-5 flex w-full max-w-6xl flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <input
              value={title}
              onChange={event => setTitle(event.target.value)}
              className="w-full rounded-xl border border-border bg-background/50 px-4 py-2 text-xl font-bold outline-none transition-all focus:border-gold focus:bg-background focus:ring-1 focus:ring-gold sm:text-2xl"
              placeholder="Nome da sua aposta"
              aria-label="Nome da aposta"
            />

            <div className="mt-1 text-sm text-muted-foreground">
              {completedMatches}/{totalMatches} jogos preenchidos
              {savedBetId ? ` · ID ${savedBetId}` : ""}
            </div>

            {saveError && (
              <div className="mt-2 text-sm text-destructive">
                {saveError}
              </div>
            )}

            {savedMessage && (
              <div className="mt-2 text-sm text-success">
                {savedMessage}
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSaving || !predictedData}
            className="h-11 rounded-xl bg-gold px-5 font-bold text-gold-foreground transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Salvando..." : "Salvar aposta"}
          </button>
        </div>

        {error instanceof Error ? (
          <ReportError error={error} />
        ) : isWorldCupLoading || isBetLoading || !predictedData ? (
          <GroupStageSkeleton />
        ) : isGroupStage ? (
          <GroupStage
            data={predictedData}
            editable
            onScoreChange={handleScoreChange}
          />
        ) : (
          <KnockoutStage
            data={predictedData}
            editable
            onScoreChange={handleScoreChange}
            onPenaltyChange={handlePenaltyChange}
          />
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
