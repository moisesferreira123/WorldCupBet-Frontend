import { Medal } from "lucide-react";

type RankLineProp = {
   title: string;
   position: number;
   points: number;
};

function getMedalColor(position: number) {
   switch (position) {
      case 1:
         return "text-yellow-400";
      case 2:
         return "text-zinc-300";
      case 3:
         return "text-amber-600";
      default:
         return "text-muted-foreground";
   }
}

function getRankStyle(position: number) {
   switch (position) {
      case 1:
         return {
            bg: "gold",
            hover: "gold",
            glow: "shadow-[0_0_25px_oklch(0.98_0_0_/_0.25)]"
         };

      case 2:
         return {
            bg: "secondary",
            hover: "accent",
            glow: "shadow-[0_0_18px_oklch(0.75_0_0_/_0.15)]",
         };

      case 3:
         return {
            bg: "warning",
            hover: "warning",
            glow: "shadow-[0_0_18px_oklch(0.75_0.13_85_/_0.15)]",
         };

      default:
         return {
            bg: "surface",
            hover: "accent",
            glow: ""
         };
   }
}

export default function RankLine({
   title,
   position,
   points,
}: RankLineProp) {
   const { bg, hover, glow } = getRankStyle(position);

   const pointsColor =
      points > 0
         ? "text-success"
         : points < 0
            ? "text-destructive"
            : "text-foreground";

   return (
      <div
         className={`
            flex w-full
            bg-${bg}
            hover:bg-${hover}
            text-foreground
            border border-border-elevated
            rounded-lg
            justify-between
            p-3

            transition-all duration-300 ease-out
            hover:scale-[1.01]
            hover:-translate-y-[2px]
            ${glow}
         `}
      >
         {/* LEFT */}
         <div className="text-lg font-bold flex items-center gap-3">

            {/* medalha ou posição */}
            <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-muted">
               <Medal size={16} className={getMedalColor(position)} />

               <span className="absolute text-[10px] font-bold">
                  {position}
               </span>
            </span>

            <span>{title}</span>
         </div>

         {/* RIGHT */}
         <div className={`font-bold tabular-nums ${pointsColor}`}>
            {points > 0 ? `+${points}` : points}
         </div>
      </div>
   );
}