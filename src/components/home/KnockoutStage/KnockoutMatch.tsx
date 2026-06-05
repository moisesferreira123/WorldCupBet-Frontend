interface KnockoutMatchProps {
  leftLine: boolean;
  rightLine: boolean;
  leftConnectingLine: boolean;
  rightConnectingLine: boolean;
  connectingLineHeight: string;
}

export default function KnockoutMatch({leftLine, rightLine, leftConnectingLine, rightConnectingLine, connectingLineHeight} : KnockoutMatchProps) {
  return (
    <div className="relative w-44">
      <div className="rounded-xl border border-border bg-card shadow-sm p-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex shrink-0 items-center gap-2">
            <div className="h-5 w-5 rounded-full object-cover bg-secondary">
              {/* <img className="h-5 w-5 rounded-full object-cover" src="https://crests.football-data.org/algeria.svg" alt="" /> */}
            </div>
            <span className=" font-semibold text-xs">- - -</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="grid h-6 w-6 place-items-center rounded-md border border-border bg-secondary text-muted-foreground hover:border-primary hover:text-primary active:scale-95" aria-label="Diminuir">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-minus h-3 w-3" aria-hidden="true">
                <path d="M5 12h14"></path>
              </svg>
            </button>
            <div className="grid h-8 w-8 place-items-center rounded-md border border-gold/30 bg-gold/10 font-display font-bold tabular-nums text-gold text-base">0</div>
            <button className="grid h-6 w-6 place-items-center rounded-md border border-border bg-secondary text-muted-foreground hover:border-primary hover:text-primary active:scale-95" aria-label="Aumentar">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-plus h-3 w-3" aria-hidden="true">
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="my-1.5 h-px bg-border/60"></div>
        <div className="flex justify-between items-center gap-2">
          <div className="flex shrink-0 items-center gap-2">
          <div className="h-5 w-5 rounded-full object-cover bg-secondary">
            <img className="h-5 w-5 rounded-full object-cover" src="https://crests.football-data.org/algeria.svg" alt="" />
          </div>
          <span className="truncate font-semibold text-xs">GHA</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="grid h-6 w-6 place-items-center rounded-md border border-border bg-secondary text-muted-foreground hover:border-primary hover:text-primary active:scale-95" aria-label="Diminuir">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-minus h-3 w-3" aria-hidden="true">
                <path d="M5 12h14"></path>
              </svg>
            </button>
            <div className="grid h-8 w-8 place-items-center rounded-md border border-gold/30 bg-gold/10 font-display font-bold tabular-nums text-gold text-base">0</div>
            <button className="grid h-6 w-6 place-items-center rounded-md border border-border bg-secondary text-muted-foreground hover:border-primary hover:text-primary active:scale-95" aria-label="Aumentar">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-plus h-3 w-3" aria-hidden="true">
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {rightLine && <span className="pointer-events-none absolute -right-3 top-1/2 h-px w-3 bg-border"></span>}
      {leftLine && <span className="pointer-events-none absolute -left-3 top-1/2 h-px w-3 bg-border"></span>}
      {rightConnectingLine && <span className={`pointer-events-none absolute -right-3 top-1/2 w-px bg-border ${connectingLineHeight}`}></span>}
      {leftConnectingLine && <span className={`pointer-events-none absolute -left-3 top-1/2 w-px bg-border ${connectingLineHeight}`}></span>}
    </div>
  );
}