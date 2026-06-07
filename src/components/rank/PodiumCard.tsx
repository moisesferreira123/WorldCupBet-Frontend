import { Crown, Medal } from "lucide-react";
import { cn, initials } from "../../lib/utils";
import type { BetResponse } from "../../api/types";

interface PodiumCardProps {
  user: BetResponse;
  height: string;
}

export default function PodiumCard({ user, height }: PodiumCardProps) {
  const config = {
    1: { Icon: Crown, color: "text-gold", bg: "bg-[image:var(--gradient-gold)]", ring: "ring-gold", fg: "text-gold-foreground" },
    2: { Icon: Medal, color: "text-muted-foreground", bg: "bg-secondary", ring: "ring-border", fg: "text-foreground" },
    3: { Icon: Medal, color: "text-amber-600", bg: "bg-secondary", ring: "ring-border", fg: "text-foreground" },
  }[user.position];

  return (
    <div className="flex flex-col items-center">
      <div className={cn("mb-2 grid h-14 w-14 place-items-center rounded-full ring-2 ring-offset-2 ring-offset-background", config.ring, user.position === 1 && "shadow-(--shadow-gold)")}>
        <div className={cn("grid h-12 w-12 place-items-center rounded-full text-sm font-bold", config.bg, config.fg)}>
          {initials(user.title)}
        </div>
      </div>
      <config.Icon className={cn("h-4 w-4", config.color)} />
      <p className="mt-1 line-clamp-1 max-w-full text-center text-xs font-semibold">{user.title}</p>
      <p className="font-display text-lg font-bold text-gold tabular-nums">{user.totalPoints}</p>
      <div className={cn("mt-2 w-full rounded-t-xl border border-b-0 border-border/60", height, user.position === 1 ? "bg-(image:--gradient-gold) opacity-90" : "bg-secondary")}>
        <div className="pt-2 text-center font-display text-xl font-bold text-background/80">
          {user.position}
        </div>
      </div>
    </div>
  );
}