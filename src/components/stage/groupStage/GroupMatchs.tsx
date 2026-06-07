import { useLocation } from "react-router-dom";
import { Flag } from "../../shared/Flag";

export default function GroupMatch() {
  const pathname = useLocation().pathname;

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
                <Flag src="https://crests.football-data.org/764.svg" alt="Brazil" />
                <span className="text-sm font-semibold">BRA</span>
              </div>
              <div className="flex items-center gap-1.5">
                {/* {
                  <button className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:border-primary hover:text-primary active:scale-95" aria-label="Diminuir">
                    <Minus size={16} />
                  </button>
                } */}
                <label className="grid h-12 w-12 place-items-center rounded-xl border border-gold/30 bg-gold/10 font-display text-2xl font-bold tabular-nums text-gold">
                  {pathname === "/" && <input value={0} type="text" className="w-full h-full text-center focus:outline-none focus:border focus:border-white rounded-xl" />}
                  {pathname === "/matches" && <div className="w-full h-full flex items-center justify-center focus:outline-none focus:border focus:border-white rounded-xl">0</div>}
                </label>
                {/* {
                  <button className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:border-primary hover:text-primary active:scale-95" aria-label="Diminuir">
                    <Plus size={16} />
                  </button>
                } */}
              </div>
            </div>
            <span className="self-center font-display text-lg font-bold text-muted-foreground">×</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                {/* {
                  <button className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:border-primary hover:text-primary active:scale-95" aria-label="Diminuir">
                    <Minus size={16} />
                  </button>
                } */}
                <label className="grid h-12 w-12 place-items-center rounded-xl border border-gold/30 bg-gold/10 font-display text-2xl font-bold tabular-nums text-gold">
                  {pathname === "/" && <input value={0} type="text" className="w-full h-full text-center focus:outline-none focus:border focus:border-white rounded-xl" />}
                  {pathname === "/matches" && <div className="w-full h-full flex items-center justify-center focus:outline-none focus:border focus:border-white rounded-xl">0</div>}
                </label>
                {/* {
                  <button className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:border-primary hover:text-primary active:scale-95" aria-label="Diminuir">
                    <Plus size={16} />
                  </button>
                } */}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">CRO</span>
                <Flag src="https://crests.football-data.org/799.svg" alt="Croatia" />
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-border"></div>
          <div className="flex items-center gap-2">
            <div className="flex  items-center gap-2">
              <div className="flex items-center gap-2">
                <Flag src="https://crests.football-data.org/764.svg" alt="Brazil" />
                <span className="text-sm font-semibold">BRA</span>
              </div>
              <div className="flex items-center gap-1.5">
                {/* {
                  <button className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:border-primary hover:text-primary active:scale-95" aria-label="Diminuir">
                    <Minus size={16} />
                  </button>
                } */}
                <label className="grid h-12 w-12 place-items-center rounded-xl border border-gold/30 bg-gold/10 font-display text-2xl font-bold tabular-nums text-gold">
                  {pathname === "/" && <input value={0} type="text" className="w-full h-full text-center focus:outline-none focus:border focus:border-white rounded-xl" />}
                  {pathname === "/matches" && <div className="w-full h-full flex items-center justify-center focus:outline-none focus:border focus:border-white rounded-xl">0</div>}
                </label>
                {/* {
                  <button className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:border-primary hover:text-primary active:scale-95" aria-label="Diminuir">
                    <Plus size={16} />
                  </button>
                } */}
              </div>
            </div>
            <span className="self-center font-display text-lg font-bold text-muted-foreground">×</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                {/* {
                  <button className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:border-primary hover:text-primary active:scale-95" aria-label="Diminuir">
                    <Minus size={16} />
                  </button>
                } */}
                <label className="grid h-12 w-12 place-items-center rounded-xl border border-gold/30 bg-gold/10 font-display text-2xl font-bold tabular-nums text-gold">
                  {pathname === "/" && <input value={0} type="text" className="w-full h-full text-center focus:outline-none focus:border focus:border-white rounded-xl" />}
                  {pathname === "/matches" && <div className="w-full h-full flex items-center justify-center focus:outline-none focus:border focus:border-white rounded-xl">0</div>}
                </label>
                {/* {
                  <button className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:border-primary hover:text-primary active:scale-95" aria-label="Diminuir">
                    <Plus size={16} />
                  </button>
                } */}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">CRO</span>
                <Flag src="https://crests.football-data.org/799.svg" alt="Croatia" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}