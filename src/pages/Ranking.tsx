import Header from "../components/shared/Header";
import { useQuery } from "@tanstack/react-query";
import { getRanking } from "../api/client";
import type { RankResponse } from "../api/types";
import ReportError from "../components/error/ReportError";
import RankTable from "../components/rank/RankTable";
import RankTableSkeleton from "../components/rank/RankTableSkeleton";

async function getRankQuery(page: number, pageSize: number): Promise<RankResponse> {
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
    queryFn: async () => getRankQuery(page, pageSize),
  });

  return (
    <div className="relative z-10 min-h-screen">
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
