import { ChevronLeft, ChevronRight, Target } from "lucide-react";
import type { RankResponse } from "../../api/types";
import { cn, initials } from "../../lib/utils";
import PodiumCard from "./PodiumCard";

type RankTableProp = {
   data: RankResponse;
   page: number;
   pageSize: number;
   onPageChange: (page: number) => void;
   isRefreshing?: boolean;
};

const betStorageKey = "word-cup-bet-id";

export default function RankTable({ data, page, pageSize, onPageChange, isRefreshing }: RankTableProp) {
   const hasPodium = data.items.length >= 3 && page === 1;
   const itemsToRender = hasPodium
      ? data.items.filter(item => item.position > 3)
      : data.items;

   const localBetId = localStorage.getItem(betStorageKey);
   const totalPages = Math.ceil(data.totalItems / pageSize);

   return (
      <div className={cn("space-y-6 transition-opacity", isRefreshing && "opacity-50")}>
         {/* Podium */}
         {hasPodium && (
            < div className="relative overflow-hidden rounded-3xl border-2 border-gold/40 bg-(image:--gradient-pitch) p-5 shadow-lg shadow-gold/5" >
               <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent" />
               <div className="grid grid-cols-3 items-end gap-3">
                  <PodiumCard user={data.items[1]} height="h-24" />
                  <PodiumCard user={data.items[0]} height="h-32" />
                  <PodiumCard user={data.items[2]} height="h-20" />
               </div>
            </div >
         )}

         {/* Rest */}
         <div className="space-y-4">
            < div className="overflow-hidden rounded-2xl border-2 border-border bg-card shadow-xl" >
               <div className="grid grid-cols-[40px_1fr_60px_60px] items-center gap-2 border-b-2 border-border bg-secondary/40 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <span>#</span>
                  <span>Jogador</span>
                  <span className="flex items-center justify-center gap-1"><Target size={12} />CHEIOS</span>
                  <span className="text-right text-gold">PTS</span>
               </div>
               {
                  itemsToRender.map((item) => {
                     const isMe = item.id === localBetId;
                     return (
                        <div 
                           key={item.id} 
                           className={cn(
                              "grid grid-cols-[40px_1fr_60px_60px] items-center gap-2 border-b border-border/50 px-4 py-3 last:border-0 hover:bg-secondary/20 transition-colors relative",
                              isMe && "bg-gold/10 hover:bg-gold/15"
                           )}
                        >
                           {isMe && <div className="absolute inset-y-0 left-0 w-1 bg-gold shadow-[2px_0_12px_rgba(var(--color-gold),0.4)]" />}
                           <span className={cn("text-sm font-black tabular-nums", isMe ? "text-gold" : "text-muted-foreground")}>{item.position}</span>
                           <div className="flex items-center gap-3">
                              <div className={cn(
                                 "grid h-9 w-9 place-items-center rounded-full text-xs font-black border-2 shadow-sm transition-all",
                                 isMe 
                                    ? "bg-gold border-gold text-gold-foreground scale-110" 
                                    : "bg-secondary border-border/60 text-foreground"
                              )}>
                                 {initials(item.title)}
                              </div>
                              <span className={cn("text-sm font-black tracking-tight", isMe ? "text-gold" : "text-foreground")}>
                                 {item.title}
                                 {isMe && <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-gold/60">(Você)</span>}
                              </span>
                           </div>
                           <span className={cn("text-center text-sm font-bold tabular-nums", isMe ? "text-gold" : "text-muted-foreground")}>{item.correctPredictions}</span>
                           <span className="text-right font-display font-black tabular-nums text-gold">{item.totalPoints}</span>
                        </div>
                     );
                  })
               }
            </div >

            {/* Pagination */}
            {totalPages > 1 && (
               <div className="flex items-center justify-between px-2">
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                     Pág. <span className="text-foreground">{page}</span> de {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                     <button
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border bg-card text-foreground hover:border-gold hover:text-gold disabled:opacity-20 transition-all active:scale-90"
                        aria-label="Página anterior"
                     >
                        <ChevronLeft size={20} />
                     </button>
                     <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={page === totalPages}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border bg-card text-foreground hover:border-gold hover:text-gold disabled:opacity-20 transition-all active:scale-90"
                        aria-label="Próxima página"
                     >
                        <ChevronRight size={20} />
                     </button>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}