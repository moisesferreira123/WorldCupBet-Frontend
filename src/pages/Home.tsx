import { useState } from "react";
import GroupMatch from "../components/home/GroupMatchs";
import GroupTable from "../components/home/GroupTable";
import PaginationDots from "../components/home/PaginationDots";
import Header from "../components/shared/Header";
import PhaseSelector from "../components/shared/PhaseSelector";

export default function Home() {
  const [isGroupPhase, setIsGroupPhase] = useState(true);

  function changeToGroupPhase() {
    if(!isGroupPhase) setIsGroupPhase(true);
  }

  function  changeToKnockoutStage() {
    if(isGroupPhase) setIsGroupPhase(false);
  }

  return (
    <div className="">
      <Header />
      <div className="flex flex-col items-center justify-center pt-20 pb-20">
        {isGroupPhase ?
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
          <div>
            
          </div>
        }
      </div>
      <PhaseSelector
        isGroupPhase={isGroupPhase}
        changeToGroupPhase={changeToGroupPhase}
        changeToKnockoutStage={changeToKnockoutStage}
      />
    </div>
  );
}