import { useState } from "react";
import type { WorldCupResponse } from "../../../api/types";
import GroupTable from "./GroupTable";
import PaginationDots from "./PaginationDots";
import MatchRoundCard from "./MatchRoundCard";

type GroupStageProps = {
  data: WorldCupResponse;
};

export default function GroupStage({ data }: GroupStageProps) {
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);

  const selectedGroup = data.groups[selectedGroupIndex];

  if (!selectedGroup) {
    return null;
  }

  const groupTeamIds = selectedGroup.standings.map(
    standing => standing.teamId
  );

  const selectedGroupMatches = data.matches
    .filter(match => match.stage === "GroupStage")
    .filter(
      match =>
        match.homeTeamId !== null &&
        match.awayTeamId !== null &&
        groupTeamIds.includes(match.homeTeamId) &&
        groupTeamIds.includes(match.awayTeamId)
    );

  const rounds = [
    selectedGroupMatches.slice(0, 2),
    selectedGroupMatches.slice(2, 4),
    selectedGroupMatches.slice(4, 6),
  ];

  return (
    <div className="w-full space-y-4 max-w-6xl">
      <PaginationDots
        groups={data.groups}
        selectedIndex={selectedGroupIndex}
        onChange={setSelectedGroupIndex}
      />

      <h1 className="font-bold text-center text-2xl uppercase">
        {selectedGroup.group.replace("Group", "Grupo ")}
      </h1>

      <div className="space-y-8">
        <div className="grid grid-cols-3 gap-4">
          {rounds.map((matches, index) => (
            <MatchRoundCard
              key={index}
              round={index + 1}
              matches={matches}
              teams={data.teams}
            />
          ))}
        </div>

        <GroupTable
          group={selectedGroup}
          teams={data.teams}
        />
      </div>
    </div>
  );
}