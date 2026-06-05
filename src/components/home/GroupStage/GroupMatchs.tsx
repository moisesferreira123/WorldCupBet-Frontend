export default function GroupMatch() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="font-bold">1ª RODADA</div>
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-wider">
          <span className="text-muted-foreground">11 de jun., QUINTA</span>
          <span className="text-muted-foreground">14:00</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex  items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇧🇷</span>
                <span className="text-sm font-semibold">BRA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <label className="grid h-12 w-12 place-items-center rounded-xl border border-gold/30 bg-gold/10 font-display text-2xl font-bold tabular-nums text-gold">
                  <input value={0} type="text" className="w-full h-full text-center focus:outline-none focus:border focus:border-white rounded-xl" />
                </label>
              </div>
            </div>
            <span className="self-center font-display text-lg font-bold text-muted-foreground">×</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <label className="grid h-12 w-12 place-items-center rounded-xl border border-gold/30 bg-gold/10 font-display text-2xl font-bold tabular-nums text-gold">
                  <input value={0} type="text" className="w-full h-full text-center focus:outline-none focus:border focus:border-white rounded-xl" />
                </label>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">CRO</span>
                <span className="text-2xl">🇭🇷</span>
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-border"></div>
          <div className="flex items-center gap-2">
            <div className="flex  items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇧🇷</span>
                <span className="text-sm font-semibold">BRA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <label className="grid h-12 w-12 place-items-center rounded-xl border border-gold/30 bg-gold/10 font-display text-2xl font-bold tabular-nums text-gold">
                  <input value={0} type="text" className="w-full h-full text-center focus:outline-none focus:border focus:border-white rounded-xl" />
                </label>
              </div>
            </div>
            <span className="self-center font-display text-lg font-bold text-muted-foreground">×</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <label className="grid h-12 w-12 place-items-center rounded-xl border border-gold/30 bg-gold/10 font-display text-2xl font-bold tabular-nums text-gold">
                  <input value={0} type="text" className="w-full h-full text-center focus:outline-none focus:border focus:border-white rounded-xl" />
                </label>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">CRO</span>
                <span className="text-2xl">🇭🇷</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}