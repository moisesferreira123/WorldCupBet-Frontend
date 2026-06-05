interface PhaseSelectorProps {
  isGroupPhase: boolean;
  changeToGroupPhase: () => void;
  changeToKnockoutStage: () => void;
}

export default function PhaseSelector({isGroupPhase, changeToGroupPhase, changeToKnockoutStage} : PhaseSelectorProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-lg">
      <div className="flex justify-center items-center gap-20">
        <button 
          onClick={changeToGroupPhase}
          className={`flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors duration-300 border-t-3 ${isGroupPhase ? 'text-gold border-t-gold' : 'border-t-transparent text-muted-foreground hover:text-foreground cursor-pointer'}`}
        >
          <span className="text-lg">FASE DE GRUPOS</span>
        </button>
        <button 
          onClick={changeToKnockoutStage}
          className={`flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors duration-300 border-t-3 ${!isGroupPhase ? 'text-gold border-t-gold' : 'border-t-transparent text-muted-foreground hover:text-foreground cursor-pointer'}`}
        >
          <span className="text-lg">MATA-MATA</span>
        </button>
      </div>
    </div>
  );
}