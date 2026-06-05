import { Flag } from "../Flag";

export default function GroupTable() {
  return (
    <div className="overflow-hidden w-full rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border bg-(image:--gradient-pitch) px-4 py-3">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-gold/15 font-display text-sm font-bold text-gold">
          A
        </div>
        <span className="text-sm font-semibold">Grupo A</span>
      </div>
      <div className="px-2 py-2">
        <div className="grid grid-cols-[1fr_repeat(8,28px)] gap-1 px-2 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>Time</span>
          <span className="text-center font-bold text-gold">P</span>
          <span className="text-center">J</span>
          <span className="text-center">V</span>
          <span className="text-center">E</span>
          <span className="text-center">D</span>
          <span className="text-center">GP</span>
          <span className="text-center">GC</span>
          <span className="text-center">SG</span>
        </div   >

        <div className="grid grid-cols-[1fr_repeat(8,28px)] items-center gap-1 rounded-lg px-2 py-2 text-sm hover:bg-secondary/50">
          <div className="flex items-center gap-2">
            <span className="w-4 text-xs text-muted-foreground">1</span>
            <Flag src="https://crests.football-data.org/764.svg" alt="Brazil" />
            <span className="font-medium">Brasil</span>
          </div>
          <span className="text-center font-display font-bold text-gold tabular-nums">9</span>
          <span className="text-center tabular-nums text-muted-foreground">3</span>
          <span className="text-center tabular-nums text-muted-foreground">3</span>
          <span className="text-center tabular-nums text-muted-foreground">0</span>
          <span className="text-center tabular-nums text-muted-foreground">0</span>
          <span className="text-center tabular-nums text-muted-foreground">1</span>
          <span className="text-center tabular-nums text-muted-foreground">1</span>
          <span className="text-center tabular-nums text-muted-foreground">1</span>

        </div   >

        <div className="grid grid-cols-[1fr_repeat(8,28px)] items-center gap-1 rounded-lg px-2 py-2 text-sm hover:bg-secondary/50">
          <div className="flex items-center gap-2">
            <span className="w-4 text-xs text-muted-foreground">2</span>
            <Flag src="https://crests.football-data.org/799.svg" alt="Croatia" />
            <span className="font-medium">Croácia</span>
          </div>
          <span className="text-center font-display font-bold text-gold tabular-nums">6</span>
          <span className="text-center tabular-nums text-muted-foreground">3</span>
          <span className="text-center tabular-nums text-muted-foreground">2</span>
          <span className="text-center tabular-nums text-muted-foreground">0</span>
          <span className="text-center tabular-nums text-muted-foreground">1</span>
          <span className="text-center tabular-nums text-muted-foreground">1</span>
          <span className="text-center tabular-nums text-muted-foreground">1</span>
          <span className="text-center tabular-nums text-muted-foreground">1</span>

        </div   >
        <div className="grid grid-cols-[1fr_repeat(8,28px)] items-center gap-1 rounded-lg px-2 py-2 text-sm hover:bg-secondary/50">
          <div className="flex items-center gap-2">
            <span className="w-4 text-xs text-muted-foreground">3</span>
            <Flag src="https://crests.football-data.org/morocco.svg" alt="Marroco" />
            <span className="font-medium">Marrocos</span>
          </div>
          <span className="text-center font-display font-bold text-gold tabular-nums">3</span>
          <span className="text-center tabular-nums text-muted-foreground">3</span>
          <span className="text-center tabular-nums text-muted-foreground">1</span>
          <span className="text-center tabular-nums text-muted-foreground">0</span>
          <span className="text-center tabular-nums text-muted-foreground">2</span>
          <span className="text-center tabular-nums text-muted-foreground">1</span>
          <span className="text-center tabular-nums text-muted-foreground">1</span>
          <span className="text-center tabular-nums text-muted-foreground">1</span>

        </div   >
        <div className="grid grid-cols-[1fr_repeat(8,28px)] items-center gap-1 rounded-lg px-2 py-2 text-sm hover:bg-secondary/50">
          <div className="flex items-center gap-2">
            <span className="w-4 text-xs text-muted-foreground">4</span>
            <Flag src="https://crests.football-data.org/791.svg" alt="Ecuador" />
            <span className="font-medium">Equador</span>
          </div>
          <span className="text-center font-display font-bold text-gold tabular-nums">0</span>
          <span className="text-center tabular-nums text-muted-foreground">3</span>
          <span className="text-center tabular-nums text-muted-foreground">0</span>
          <span className="text-center tabular-nums text-muted-foreground">0</span>
          <span className="text-center tabular-nums text-muted-foreground">3</span>
          <span className="text-center tabular-nums text-muted-foreground">1</span>
          <span className="text-center tabular-nums text-muted-foreground">1</span>
          <span className="text-center tabular-nums text-muted-foreground">1</span>

        </div>
      </div>
    </div>
  );
}