import { useMemo, useState } from "react";
import Header from "../components/shared/Header";
import GroupStage from "../components/stage/groupStage/GroupStage";
import KnockoutStage from "../components/stage/knockoutStage/KnockoutStage";
import PhaseSelector from "../components/stage/StageSelector";
import { useQuery } from "@tanstack/react-query";
import { type Match, type WorldCupResponse } from "../api/types";
import { getWorldCupData } from "../api/client";
import { delay } from "../lib/utils";
import worldCupData from "../mock/worldcup.json"
import ReportError from "../components/error/ReportError";
import GroupStageSkeleton from "../components/stage/groupStage/GroupStageSkeleton";
import CountdownTimer from "../components/shared/CountdownTimer";
import { ChevronDown, ChevronUp, History, CalendarClock } from "lucide-react";
import { Flag } from "../components/shared/Flag";

async function getWorldCupQuery(): Promise<WorldCupResponse> {
  const response = await getWorldCupData();

  if (response.status === 200 && response.data) {
    return response.data;
  }

  throw new Error(response.errors.join(", "));
}

export default function Matches() {
  const [isGroupStage, setIsGroupStage] = useState(sessionStorage.getItem('is-group-stage') === 'true');
  const [showLive, setShowLive] = useState(true);
  const [showRecent, setShowRecent] = useState(true);
  const [showUpcoming, setShowUpcoming] = useState(true);

  const { isLoading, error, data } = useQuery<WorldCupResponse>({
    queryKey: ["worldcup"],
    queryFn: async () => getWorldCupQuery(),
    staleTime: 15 * 60 * 1000
  });

  const teamsMap = useMemo(() => {
    return new Map((data?.teams ?? []).map(t => [t.id, t]));
  }, [data?.teams]);

  const liveMatches = useMemo(() => {
    if (!data) return [];
    return data.matches.filter(m => m.status === 'InProgress');
  }, [data]);

  const recentMatches = useMemo(() => {
    if (!data) return [];
    return [...data.matches]
      .filter(m => m.status === 'Finished')
      .sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())
      .slice(0, 5);
  }, [data]);

  const upcomingMatches = useMemo(() => {
    if (!data) return [];
    return [...data.matches]
      .filter(m => m.status === 'Scheduled')
      .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
      .slice(0, 5);
  }, [data]);

  function changeToGroupStage() {
    if (!isGroupStage) setIsGroupStage(true);
    sessionStorage.setItem('is-group-stage', 'true');
  }

  function changeToKnockoutStage() {
    if (isGroupStage) setIsGroupStage(false);
    sessionStorage.setItem('is-group-stage', 'false');
  }

  const renderSummaryList = (matches: Match[], title: string, icon: any, isOpen: boolean, onToggle: () => void, isLiveList: boolean = false) => {
    if (matches.length === 0) return null;

    return (
      <div className="w-full max-w-6xl mb-6">
        <button
          onClick={onToggle}
          className={`flex w-full items-center justify-between rounded-xl border p-4 transition-all ${isLiveList
              ? 'border-success/30 bg-success/5 hover:bg-success/10'
              : 'border-border bg-card/50 hover:bg-card'
            }`}
        >
          <div className={`flex items-center gap-2 font-bold uppercase tracking-wider ${isLiveList ? 'text-success' : 'text-muted-foreground'}`}>
            {isLiveList ? (
              <div className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-success"></span>
              </div>
            ) : icon}
            <span>{title}</span>
          </div>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {isOpen && (
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5 animate-in fade-in slide-in-from-top-2 duration-300">
            {matches.map(match => {
              const home = teamsMap.get(match.homeTeamId!);
              const away = teamsMap.get(match.awayTeamId!);
              if (!home || !away) return null;
              const isMatchInProgress = match.status === 'InProgress';

              return (
                <div
                  key={match.id}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-3 shadow-sm transition-all duration-500 ${isMatchInProgress
                      ? 'border-success/50 bg-success/[0.03] ring-1 ring-success/20 animate-pulse-subtle'
                      : 'border-border bg-card'
                    }`}
                >
                  <div className="flex w-full items-center justify-center gap-2">
                    <div className="flex flex-col items-center gap-1">
                      <div className="h-6 w-8 overflow-hidden rounded-sm border border-border/50 shadow-sm">
                        <Flag src={home.flagUri} alt={home.name} />
                      </div>
                      <span className="text-[10px] font-bold">{home.tla}</span>
                    </div>
                    <div className="flex flex-col items-center px-1">
                      <div className={`font-display text-sm font-black ${isMatchInProgress ? 'text-success' : 'text-gold'}`}>
                        {match.status === 'Scheduled' ? 'vs' : `${match.homeTeamGoals} - ${match.awayTeamGoals}`}
                      </div>
                      <span className={`text-[8px] uppercase font-bold ${isMatchInProgress ? 'text-success animate-pulse' : 'text-muted-foreground'}`}>
                        {isMatchInProgress ? 'AO VIVO' : new Date(match.utcDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="h-6 w-8 overflow-hidden rounded-sm border border-border/50 shadow-sm">
                        <Flag src={away.flagUri} alt={away.name} />
                      </div>
                      <span className="text-[10px] font-bold">{away.tla}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex flex-col items-center pt-24 pb-32 px-4">
        <CountdownTimer />

        {!error && !isLoading && (
          <>
            {renderSummaryList(liveMatches, "Partidas Ao Vivo", null, showLive, () => setShowLive(!showLive), true)}
            {renderSummaryList(recentMatches, "Últimas Partidas", <History size={16} />, showRecent, () => setShowRecent(!showRecent))}
            {renderSummaryList(upcomingMatches, "Próximas Partidas", <CalendarClock size={16} />, showUpcoming, () => setShowUpcoming(!showUpcoming))}
          </>
        )}

        {error ?
          <ReportError error={error} />
          : (
            isLoading ? (
              <GroupStageSkeleton />
            )
              : (
                <div className="w-full max-w-6xl animate-in fade-in duration-500">
                  {isGroupStage
                    ? <GroupStage data={data ?? { teams: [], groups: [], matches: [] }} />
                    : <KnockoutStage data={data} />
                  }
                </div>
              )
          )
        }
      </main>
      {
        !error && (
          <PhaseSelector
            isGroupStage={isGroupStage}
            changeToGroupStage={changeToGroupStage}
            changeToKnockoutStage={changeToKnockoutStage}
          />
        )
      }
    </div>
  );
}
