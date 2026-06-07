import Skeleton from "../shared/Skeleton";

export default function RankTableSkeleton() {
   return (
      <>
         {/* Podium */}
         <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-(image:--gradient-pitch) p-5">
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent" />

            <div className="grid grid-cols-3 items-end gap-3">
               {/* 2º */}
               <div className="flex flex-col items-center">
                  <Skeleton className="mb-2 h-10 w-10 rounded-full" />
                  <Skeleton className="mb-3 h-4 w-20" />
                  <Skeleton className="h-24 w-full rounded-t-xl" />
               </div>

               {/* 1º */}
               <div className="flex flex-col items-center">
                  <Skeleton className="mb-2 h-12 w-12 rounded-full" />
                  <Skeleton className="mb-3 h-4 w-24" />
                  <Skeleton className="h-32 w-full rounded-t-xl" />
               </div>

               {/* 3º */}
               <div className="flex flex-col items-center">
                  <Skeleton className="mb-2 h-10 w-10 rounded-full" />
                  <Skeleton className="mb-3 h-4 w-20" />
                  <Skeleton className="h-20 w-full rounded-t-xl" />
               </div>
            </div>
         </div>

         {/* Table */}
         <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {/* Header */}
            <div className="grid grid-cols-[40px_1fr_60px_60px] items-center gap-2 border-b border-border bg-secondary/40 px-4 py-2.5">
               <Skeleton className="h-3 w-4" />
               <Skeleton className="h-3 w-16" />
               <Skeleton className="mx-auto h-3 w-12" />
               <Skeleton className="ml-auto h-3 w-8" />
            </div>

            {Array.from({ length: 10 }).map((_, index) => (
               <div
                  key={index}
                  className="grid grid-cols-[40px_1fr_60px_60px] items-center gap-2 border-b border-border/50 px-4 py-3 last:border-0"
               >
                  {/* posição */}
                  <Skeleton className="h-5 w-6" />

                  {/* jogador */}
                  <div className="flex items-center gap-3">
                     <Skeleton className="h-9 w-9 rounded-full" />
                     <Skeleton className="h-4 w-32" />
                  </div>

                  {/* cheios */}
                  <Skeleton className="mx-auto h-4 w-6" />

                  {/* pontos */}
                  <Skeleton className="ml-auto h-4 w-10" />
               </div>
            ))}
         </div>
      </>
   );
}