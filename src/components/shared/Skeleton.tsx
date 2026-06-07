import { cn } from "../../lib/utils";

type SkeletonProps = {
   className?: string;
};

export default function Skeleton({ className }: SkeletonProps) {
   return (
      <div
         className={cn(
            "relative overflow-hidden rounded-md bg-secondary",
            className
         )}
      >
         <div className="absolute inset-0 -translate-x-full animate-shimmer">
            <div className="h-full w-1/2 bg-linear-to-r from-transparent via-white/10 to-transparent" />
         </div>
      </div>
   );
}