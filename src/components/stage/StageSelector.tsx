interface PhaseSelectorProps {
  isGroupStage: boolean;
  changeToGroupStage: () => void;
  changeToKnockoutStage: () => void;
}

export default function PhaseSelector({isGroupStage, changeToGroupStage, changeToKnockoutStage} : PhaseSelectorProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 backdrop-blur-xl shadow-[0_-4px_16px_rgba(0,0,0,0.1)]">
      <div className="flex justify-center items-center gap-12 sm:gap-20">
        <button 
          onClick={changeToGroupStage}
          className={`flex flex-col items-center gap-1 py-4 text-xs font-black transition-all duration-300 border-t-4 ${isGroupStage ? 'text-gold border-t-gold' : 'border-t-transparent text-muted-foreground hover:text-foreground cursor-pointer'}`}
        >
          <span className="text-xl tracking-tight">FASE DE GRUPOS</span>
        </button>
        <button 
          onClick={changeToKnockoutStage}
          className={`flex flex-col items-center gap-1 py-4 text-xs font-black transition-all duration-300 border-t-4 ${!isGroupStage ? 'text-gold border-t-gold' : 'border-t-transparent text-muted-foreground hover:text-foreground cursor-pointer'}`}
        >
          <span className="text-xl tracking-tight">MATA-MATA</span>
        </button>
      </div>
    </div>
  );
}