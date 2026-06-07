import { useEffect, useState } from "react";
import { Timer, Trophy } from "lucide-react";

// Tournament Start Date: June 11, 2026, at 19:00:00 UTC
export const TOURNAMENT_START_DATE = new Date("2026-06-11T19:00:00Z");

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = TOURNAMENT_START_DATE.getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return null;
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return (
      <div className="mb-8 flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-6 py-2 text-gold animate-in fade-in zoom-in duration-500">
        <Trophy size={18} className="animate-bounce" />
        <span className="font-display font-bold tracking-tight">A COPA COMEÇOU!</span>
      </div>
    );
  }

  return (
    <div className="mb-8 flex flex-col items-center gap-2 animate-in fade-in slide-in-from-top duration-700">
      <div className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
        <Timer size={12} />
        <span>Início em</span>
      </div>
      
      <div className="flex items-center gap-3">
        <TimeUnit value={timeLeft.days} label="DIAS" />
        <Separator />
        <TimeUnit value={timeLeft.hours} label="HRS" />
        <Separator />
        <TimeUnit value={timeLeft.minutes} label="MIN" />
        <Separator />
        <TimeUnit value={timeLeft.seconds} label="SEG" />
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-3xl font-black tabular-nums text-foreground sm:text-4xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] font-bold text-muted-foreground/40">{label}</span>
    </div>
  );
}

function Separator() {
  return (
    <span className="mb-4 font-display text-xl font-bold text-border">:</span>
  );
}
