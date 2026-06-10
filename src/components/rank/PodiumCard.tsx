import { Crown, Medal } from "lucide-react";
import { cn, initials } from "../../lib/utils";
import type { BetResponse } from "../../api/types";

interface PodiumCardProps {
  user: BetResponse;
  height: string;
}

export default function PodiumCard({ user, height }: PodiumCardProps) {
  const podiumConfig = {
    1: { 
      Icon: Crown, 
      color: "text-gold", 
      bg: "bg-(image:--gradient-gold)", 
      ring: "ring-gold", 
      fg: "text-gold-foreground",
      podiumBg: "bg-(image:--gradient-gold)",
    },
    2: { 
      Icon: Medal, 
      color: "text-silver", 
      bg: "bg-silver", 
      ring: "ring-silver", 
      fg: "text-silver-foreground",
      podiumBg: "bg-silver/80",
    },
    3: { 
      Icon: Medal, 
      color: "text-bronze", 
      bg: "bg-bronze", 
      ring: "ring-bronze", 
      fg: "text-bronze-foreground",
      podiumBg: "bg-bronze/80",
    },
  };
  const config =
    podiumConfig[user.position as keyof typeof podiumConfig] ??
    podiumConfig[3];

  return (
    <div className="flex flex-col items-center">
      <div className={cn("mb-2 grid h-14 w-14 place-items-center rounded-full ring-2 ring-offset-2 ring-offset-background", config.ring, user.position === 1 && "shadow-(--shadow-gold)")}>
        <div className={cn("grid h-12 w-12 place-items-center rounded-full text-sm font-black", config.bg, config.fg)}>
          {initials(user.title)}
        </div>
      </div>
      <config.Icon className={cn("h-4 w-4", config.color)} />
      <p className="mt-1 line-clamp-1 max-w-full text-center text-xs font-black uppercase tracking-tight">{user.title}</p>
      <p className={cn("font-display text-lg font-black tabular-nums", config.color)}>{user.totalPoints}</p>
      <div className={cn("mt-2 w-full rounded-t-xl border-2 border-b-0 border-border/40 shadow-sm", height, config.podiumBg)}>
        <div className="pt-2 text-center font-display text-2xl font-black text-black/40">
          {user.position}
        </div>
      </div>
    </div>
  );
}
