import { useState } from "react";
import Header from "../components/shared/Header";
import PhaseSelector from "../components/stage/StageSelector";
import KnockoutStage from "../components/stage/knockoutStage/KnockoutStage";
import GroupStage from "../components/stage/groupStage/GroupStage";

export default function Home() {
  const [isGroupStage, setIsGroupStage] = useState(sessionStorage.getItem('is-group-stage') ? sessionStorage.getItem('is-group-stage') === 'true' : true);

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
        {isGroupStage ?
          <GroupStage />
          :
          <KnockoutStage />
        }
      </main>
      <PhaseSelector
        isGroupStage={isGroupStage}
        changeToGroupStage={changeToGroupStage}
        changeToKnockoutStage={changeToKnockoutStage}
      />
    </div>
  );
}