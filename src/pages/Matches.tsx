import { useState } from "react";
import Header from "../components/shared/Header";
import GroupStage from "../components/stage/groupStage/GroupStage";
import KnockoutStage from "../components/stage/knockoutStage/KnockoutStage";
import PhaseSelector from "../components/stage/StageSelector";
import { useQuery } from "@tanstack/react-query";
import { type WorldCupResponse } from "../api/types";
import { getWorldCupData } from "../api/client";
import { delay } from "../lib/utils";
import worldCupData from "../mock/worldcup.json"
import ReportError from "../components/error/ReportError";
import GroupStageSkeleton from "../components/stage/groupStage/GroupStageSkeleton";

async function getQuery(fake: boolean = false): Promise<WorldCupResponse> {
  if (fake) {
    await delay(2000);

    return worldCupData as WorldCupResponse;
  }

  const response = await getWorldCupData();

  if (response.status === 200 && response.data) {
    return response.data;
  }

  throw new Error(response.errors.join(', '));
}

export default function Matches() {
  const [isGroupStage, setIsGroupStage] = useState(sessionStorage.getItem('is-group-stage') === 'true');
  const { isLoading, error, data } = useQuery<WorldCupResponse>({
    queryKey: ["worldcup"],
    queryFn: async () => getQuery(true),
    staleTime: 1 * 60 * 1000
  })

  function changeToGroupStage() {
    if (!isGroupStage) setIsGroupStage(true);
    sessionStorage.setItem('is-group-stage', 'true');
  }

  function changeToKnockoutStage() {
    if (isGroupStage) setIsGroupStage(false);
    sessionStorage.setItem('is-group-stage', 'false');
  }

  return (
    <div className="">
      <Header />
      <main className="flex flex-col items-center justify-center pt-20 pb-20">
        {error ?
          <ReportError error={error} />
          : (
            isLoading ? (
              isGroupStage ? <GroupStageSkeleton /> : <GroupStageSkeleton />
            )
              : (
                isGroupStage
                  ? <GroupStage data={data ?? { teams: [], groups: [], matches: [] }} />
                  : <KnockoutStage data={data} />
              )
          )
        }
      </main>
      {
        error ?
          <></>
          : <PhaseSelector
            isGroupStage={isGroupStage}
            changeToGroupStage={changeToGroupStage}
            changeToKnockoutStage={changeToKnockoutStage}
          />
      }
    </div>
  );
}
