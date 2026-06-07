import { useState } from "react";
import Header from "../components/shared/Header";
import GroupStage from "../components/stage/groupStage/GroupeStage";
import KnockoutStage from "../components/stage/knockoutStage/KnockoutStage";
import PhaseSelector from "../components/stage/StageSelector";

export default function Matches() {
  const [isGroupStage, setIsGroupStage] = useState(sessionStorage.getItem('is-group-stage') === 'true');

  function changeToGroupStage() {
    if(!isGroupStage) setIsGroupStage(true);
    sessionStorage.setItem('is-group-stage', 'true');
  }

  function changeToKnockoutStage() {
    if(isGroupStage) setIsGroupStage(false);
    sessionStorage.setItem('is-group-stage', 'false');
  }

  return (
    <div className="">
      <Header />
      <div className="flex flex-col items-center justify-center pt-20 pb-20">
        {isGroupStage ?
          <GroupStage />
          :
          <KnockoutStage />
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