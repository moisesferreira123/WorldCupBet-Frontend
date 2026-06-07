import Header from "../components/shared/Header";
import { useQuery } from "@tanstack/react-query";
import { getRanking } from "../api/client";
import type { RankResponse } from "../api/types";
import { cn, initials } from "../lib/utils";
import { Target } from "lucide-react";
import PodiumCard from "../components/rank/PodiumCard";
import ReportError from "../components/error/ReportError";
import RankTable from "../components/rank/RankTable";
import RankTableSkeleton from "../components/rank/RankTableSkeleton";

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
          correctPredictions: 2
        },
        {
          id: "id2",
          position: 2,
          predictions: [],
          title: "Maria",
          totalPoints: 9,
          correctPredictions: 2
        },
        {
          id: "id3",
          position: 3,
          predictions: [],
          title: "José",
          totalPoints: 8,
          correctPredictions: 2
        },
        {
          id: "id4",
          position: 4,
          predictions: [],
          title: "Oscar",
          totalPoints: 8,
          correctPredictions: 2
        },
        {
          id: "id5",
          position: 5,
          predictions: [],
          title: "Moises",
          totalPoints: 8,
          correctPredictions: 2
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
          {error ?
            <ReportError error={error} />
            : (
              isLoading ?
                <RankTableSkeleton />
                : <RankTable data={data ?? { items: [], totalItems: 0 }} />
            )
          }
        </div>
      </main>
    </div >
  )
}