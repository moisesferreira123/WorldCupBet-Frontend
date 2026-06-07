export default function RankTableSkeleton() {
   return (
      <div className="w-full flex flex-col gap-2 animate-shimmer">

         {/* Header skeleton */}
         <div className="flex justify-between px-3 text-sm">
            <div className="h-4 w-20 bg-muted rounded" />
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-4 w-16 bg-muted rounded" />
         </div>

         {/* Rows */}
         {Array.from({ length: 8 }).map((_, i) => (
            <div
               key={i}
               className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border-elevated"
            >
               {/* posição */}
               <div className="h-6 w-10 bg-muted rounded-full" />

               {/* nome */}
               <div className="h-4 w-40 bg-muted rounded" />

               {/* pontos */}
               <div className="h-4 w-12 bg-muted rounded" />
            </div>
         ))}
      </div>
   );
}