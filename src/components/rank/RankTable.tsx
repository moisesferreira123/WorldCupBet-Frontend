import { Target } from "lucide-react";
import type { RankResponse } from "../../api/types";
import { cn, initials } from "../../lib/utils";
import PodiumCard from "./PodiumCard";

type RankTableProp = {
   data: RankResponse;
};

export default function RankTable({ data }: RankTableProp) {
   const hasPodium = data.items.length >= 3;
   const itemsToRender = hasPodium
      ? data.items.filter(item => item.position > 3)
      : data.items;

   return (
      <>
         {/* Podium */}
         {hasPodium && (
            < div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-(image:--gradient-pitch) p-5" >
               <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent" />
               <div className="grid grid-cols-3 items-end gap-3">
                  <PodiumCard user={data.items[1]} height="h-24" />
                  <PodiumCard user={data.items[0]} height="h-32" />
                  <PodiumCard user={data.items[2]} height="h-20" />
               </div>
            </div >
         )}

         {/* Rest */}
         < div className="overflow-hidden rounded-2xl border border-border bg-card" >
            <div className="grid grid-cols-[40px_1fr_60px_60px] items-center gap-2 border-b border-border bg-secondary/40 px-4 py-2.5 text-[10px] uppercase tracking-wider text-muted-foreground">
               <span>#</span>
               <span>Jogador</span>
               <span className="flex items-center justify-center gap-1"><Target className="h-3 w-3" />Cheios</span>
               <span className="text-right font-bold text-gold">Pts</span>
            </div>
            {
               itemsToRender.map((item) => {
                  return (
                     // Adicionar caso seja você: isMe && "bg-gold/10"
                     <div key={item.id} className={cn("grid grid-cols-[40px_1fr_60px_60px] items-center gap-2 border-b border-border/50 px-4 py-3 last:border-0")}>
                        {/* Adicionar algo caso seja você: isMe ? "text-gold" : "text-muted-foreground" */}
                        <span className={cn("text-sm font-semibold tabular-nums")}>{item.position}</span>
                        <div className="flex items-center gap-3">
                           {/* Adicionar algo caso seja você: isMe ? "bg-gold/20 text-gold" : "bg-secondary text-foreground*/}
                           <div className={cn("grid h-9 w-9 place-items-center rounded-full text-xs font-bold")}>
                              {initials(item.title)}
                           </div>
                           {/* Adicionar algo caso seja você: isMe && "text-gold" */}
                           <span className={cn("text-sm font-medium")}>{item.title}</span>
                        </div>
                        <span className="text-center text-sm tabular-nums text-muted-foreground">{item.correctPredictions}</span>
                        <span className="text-right font-display font-bold tabular-nums text-gold">{item.totalPoints}</span>
                     </div>
                  );
               })
            }
         </div >
      </>
   );
}