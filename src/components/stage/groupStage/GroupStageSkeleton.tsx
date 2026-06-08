import Skeleton from "../../shared/Skeleton";

export default function GroupStageSkeleton() {
   return (
      <div className="w-full max-w-6xl space-y-4">
         <div className="flex justify-center gap-2">
            {Array.from({ length: 12 }).map((_, index) => (
               <Skeleton
                  key={index}
                  className="h-3 w-3 rounded-full"
               />
            ))}
         </div>

         <Skeleton className="mx-auto h-8 w-40" />

         <div className="space-y-8">
            <div className="grid grid-rows-3 sm:grid-cols-3 gap-4">
               {Array.from({ length: 3 }).map((_, round) => (
                  <div
                     key={round}
                     className="flex w-full flex-col gap-2"
                  >
                     <Skeleton className="h-6 w-24" />

                     <div className="rounded-2xl border border-border bg-card p-4">
                        <div className="space-y-4">
                           {Array.from({ length: 2 }).map(
                              (_, match) => (
                                 <div key={match}>
                                    <div className="mb-2 flex items-center justify-between">
                                       <Skeleton className="h-4 w-28" />
                                       <Skeleton className="h-4 w-12" />
                                    </div>

                                    <div className="flex items-center justify-between">
                                       <div className="flex items-center gap-2">
                                          <Skeleton className="h-6 w-6 rounded-full" />
                                          <Skeleton className="h-4 w-10" />
                                       </div>

                                       <div className="flex items-center gap-3">
                                          <Skeleton className="h-10 w-10 rounded-lg" />

                                          <Skeleton className="h-4 w-4" />

                                          <Skeleton className="h-10 w-10 rounded-lg" />
                                       </div>

                                       <div className="flex items-center gap-2">
                                          <Skeleton className="h-4 w-10" />
                                          <Skeleton className="h-6 w-6 rounded-full" />
                                       </div>
                                    </div>

                                    {match === 0 && (
                                       <div className="mt-3 h-px w-full bg-border/50" />
                                    )}
                                 </div>
                              )
                           )}
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            <div className="rounded-2xl border border-border bg-card">
               <div className="border-b border-border p-4">
                  <Skeleton className="h-6 w-32" />
               </div>

               <div className="space-y-2 p-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                     <div
                        key={index}
                        className="grid grid-cols-9 items-center gap-2"
                     >
                        <Skeleton className="h-4 w-4" />

                        <div className="flex items-center gap-2">
                           <Skeleton className="h-6 w-6 rounded-full" />
                           <Skeleton className="h-4 w-24" />
                        </div>

                        <Skeleton className="h-4 w-6" />
                        <Skeleton className="h-4 w-6" />
                        <Skeleton className="h-4 w-6" />
                        <Skeleton className="h-4 w-6" />
                        <Skeleton className="h-4 w-6" />
                        <Skeleton className="h-4 w-6" />
                        <Skeleton className="h-4 w-6" />
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
}