import Header from "../components/shared/Header";
import { useQuery } from "@tanstack/react-query";
import { getRanking } from "../api/client";
import type { RankResponse } from "../api/types";
import ReportError from "../components/error/ReportError";
import RankTable from "../components/rank/RankTable";
import RankTableSkeleton from "../components/rank/RankTableSkeleton";
import { cn, initials } from "../lib/utils";
import { Target } from "lucide-react";
import PodiumCard from "../components/rank/PodiumCard";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getQuery(page: number, pageSize: number, fake: boolean = false): Promise<RankResponse> {
  if (fake) {
    await delay(2000);

    return {
      items: [
        {
          id: "id1",
          position: 1,
          predictions: [],
          title: "Pedro",
          totalPoints: 10,
          correctPreditions: 2
        },
        {
          id: "id2",
          position: 2,
          predictions: [],
          title: "Pedro",
          totalPoints: 9,
          correctPreditions: 2
        },
        {
          id: "id3",
          position: 3,
          predictions: [],
          title: "Pedro",
          totalPoints: 8,
          correctPreditions: 2
        },
        {
          id: "id4",
          position: 4,
          predictions: [],
          title: "Pedro",
          totalPoints: 8,
          correctPreditions: 2
        },
        {
          id: "id5",
          position: 5,
          predictions: [],
          title: "Pedro",
          totalPoints: 8,
          correctPreditions: 2
        }
      ],
      totalItems: 5
    };
  }

  const response = await getRanking(page, pageSize);

  if (response.status === 200 && response.data) {
    return response.data;
  }

  throw new Error(response.errors.join(', '));
}

export default function Ranking() {
  const page = 1;
  const pageSize = 20;

  const { isLoading, error, data } = useQuery<RankResponse>({
    queryKey: ["ranking", page, pageSize],
    queryFn: async () => getQuery(page, pageSize, true),
    staleTime: 1 * 60 * 1000
  });

  return (
    <div>
      <Header />
      <main className="flex flex-col gap-4 pt-20 pb-20 sm:w-2/3 md:w-1/2 mx-auto">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Ranking Geral</h1>
          <p className="text-sm text-muted-foreground">Os melhores palpiteiros da Copa</p>
        </div>

        {/* Podium */}
        <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-(image:--gradient-pitch) p-5">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent" />
          <div className="grid grid-cols-3 items-end gap-3">
            <PodiumCard user={data.items[1]} height="h-24" />
            <PodiumCard user={data.items[0]} height="h-32" />
            <PodiumCard user={data.items[2]} height="h-20" />
          </div>
        </div>

        {/* Rest */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="grid grid-cols-[40px_1fr_60px_60px] items-center gap-2 border-b border-border bg-secondary/40 px-4 py-2.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>#</span>
            <span>Jogador</span>
            <span className="flex items-center justify-center gap-1"><Target className="h-3 w-3" />Cheios</span>
            <span className="text-right font-bold text-gold">Pts</span>
          </div>
          {data.totalItems >= 4 &&  data.items.map((item) => {
            if(item.position<4) return;
            return (
              // Adicionar caso seja você: isMe && "bg-gold/10"
              <div key={item.id} className={cn("grid grid-cols-[40px_1fr_60px_60px] items-center gap-2 border-b border-border/50 px-4 py-3 last:border-0")}>
                {/* Adicionar algo caso seja você: isMe ? "text-gold" : "text-muted-foreground" */}
                <span className={cn("text-sm font-semibold tabular-nums")}>{item.position}</span>
                <div className="flex items-center gap-3">
                  {/* Adicionar algo caso seja você: isMe ? "bg-gold/20 text-gold" : "bg-secondary text-foreground*/}
                  <div className={cn("grid h-9 w-9 place-items-center rounded-full text-xs font-bold")}>
                    {initials(item.title)}
                  </div>
                  {/* Adicionar algo caso seja você: isMe && "text-gold" */}
                  <span className={cn("text-sm font-medium")}>{item.title}</span>
                </div>
                <span className="text-center text-sm tabular-nums text-muted-foreground">{item.correctPreditions}</span>
                <span className="text-right font-display font-bold tabular-nums text-gold">{item.totalPoints}</span>
              </div>
            );
          })}
        </div>
      </div>
        {/* <div>
          <h2 className="text-2xl font-bold">Ranking Geral</h2>
          <p className="text-md text-muted-foreground">Os melhores palpiteiros da Copa</p>
        </div>

        {error ?
          <ReportError error={error} />
          : (
            isLoading ? <RankTableSkeleton />
              : <RankTable lines={data?.items ?? []} />
          )
        } */}
      </main>
    </div >
  )
}