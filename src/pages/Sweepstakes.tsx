import { useState } from "react";
import GroupMatch from "../components/stage/groupStage/GroupMatchs";
import GroupTable from "../components/stage/groupStage/GroupTable";
import PaginationDots from "../components/stage/groupStage/PaginationDots";
import Header from "../components/shared/Header";
import PhaseSelector from "../components/stage/StageSelector";
import KnockoutStage from "../components/stage/knockoutStage/KnockoutStage";

export default function Home() {
  const [isGroupStage, setIsGroupStage] = useState(true);

  function changeToGroupStage() {
    if(!isGroupStage) setIsGroupStage(true);
  }

  function  changeToKnockoutStage() {
    if(isGroupStage) setIsGroupStage(false);
  }

  return (
    <div className="">
      <Header />
      <div className="flex flex-col items-center justify-center pt-20 pb-20">
        {isGroupStage ?
          <div className="space-y-4 max-w-6xl">
            <PaginationDots />
            <h1 className="font-bold text-center text-2xl uppercase">GRUPO A</h1>
            <div className="space-y-8">
              <div className="grid grid-cols-3 gap-4">
                <GroupMatch />
                <GroupMatch />
                <GroupMatch />
              </div>
              <GroupTable />
            </div>
          </div>
          :
          <div className="w-full overflow-x-scroll px-20 mr-8 no-scrollbar">
            <KnockoutStage />
          </div>
        }
      </div>
      <PhaseSelector
        isGroupStage={isGroupStage}
        changeToGroupStage={changeToGroupStage}
        changeToKnockoutStage={changeToKnockoutStage}
      />
    </div>
  );
}