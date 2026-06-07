import { useState } from "react";
import type { WorldCupResponse } from "../../../api/types";
import GroupTable from "./GroupTable";
import PaginationDots from "./PaginationDots";
import MatchRoundCard from "./MatchRoundCard";

type GroupStageProps = {
  data: WorldCupResponse;
  editable?: boolean;
  onScoreChange?: (
    matchId: number,
    side: "home" | "away",
    value: number | null
  ) => void;
};

export default function GroupStage({
  data,
  editable = false,
  onScoreChange,
}: GroupStageProps) {
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(() => {
    const saved = sessionStorage.getItem("selected-group-index");
    return saved !== null ? Number(saved) : 0;
  });

  const handleGroupChange = (index: number) => {
    setSelectedGroupIndex(index);
    sessionStorage.setItem("selected-group-index", index.toString());
  };

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
        onChange={handleGroupChange}
      />

      <h1 className="font-bold text-center text-2xl uppercase">
        {selectedGroup.group.replace("Group", "Grupo ")}
      </h1>

      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {rounds.map((matches, index) => (
            <MatchRoundCard
              key={index}
              round={index + 1}
              matches={matches}
              teams={data.teams}
              editable={editable}
              onScoreChange={onScoreChange}
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
