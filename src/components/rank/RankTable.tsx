import type { BetResponse } from "../../api/types";
import RankLine from "./RankLine";

type RankTableProp = {
   lines: BetResponse[];
};

export default function RankTable({ lines }: RankTableProp) {
   return (
      <div className="w-full flex flex-col gap-2">

         {/* Header */}
         <div className="flex justify-between text-sm text-muted-foreground px-3">
            <span>Posição</span>
            <span>Nome</span>
            <span>Pontos</span>
         </div>

         {/* Body */}
         <div className="flex flex-col gap-2">
            {lines.map((line) => (
               <RankLine
                  key={line.id}
                  title={line.title}
                  position={line.position}
                  points={line.totalPoints}
               />
            ))}
         </div>
      </div>
   );
}