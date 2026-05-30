export default function GroupMatch() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-wider">
        <span className="text-muted-foreground">11 de jun., QUINTA</span>
        <span className="text-muted-foreground">14:00</span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇧🇷</span>
            <span className="text-sm font-semibold">BRA</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:border-primary hover:text-primary active:scale-95" aria-label="Diminuir">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-minus h-4 w-4" aria-hidden="true"><path d="M5 12h14"></path></svg>
            </button>
            <div className="grid h-12 w-12 place-items-center rounded-xl border border-gold/30 bg-gold/10 font-display text-2xl font-bold tabular-nums text-gold">
              0
            </div>
            <button className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:border-primary hover:text-primary active:scale-95" aria-label="Aumentar">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-plus h-4 w-4" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
            </button>
          </div>
        </div>
        <span className="self-center pt-7 font-display text-lg font-bold text-muted-foreground">×</span>
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">CRO</span>
            <span className="text-2xl">🇭🇷</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:border-primary hover:text-primary active:scale-95" aria-label="Diminuir">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-minus h-4 w-4" aria-hidden="true"><path d="M5 12h14"></path></svg>
            </button>
            <div className="grid h-12 w-12 place-items-center rounded-xl border border-gold/30 bg-gold/10 font-display text-2xl font-bold tabular-nums text-gold">0</div>
            <button className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:border-primary hover:text-primary active:scale-95" aria-label="Aumentar">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-plus h-4 w-4" aria-hidden="true"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}