import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { Group } from "../../../api/types";

type PaginationDotsProps = {
  groups: Group[];
  selectedIndex: number;
  onChange: (index: number) => void;
};

export default function PaginationDots({
  groups,
  selectedIndex,
  onChange,
}: PaginationDotsProps) {
  const previous = () => {
    if (selectedIndex > 0) {
      onChange(selectedIndex - 1);
    }
  };

  const next = () => {
    if (selectedIndex < groups.length - 1) {
      onChange(selectedIndex + 1);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-center">
        <button
          onClick={previous}
          disabled={selectedIndex === 0}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/50 text-foreground border-2 border-border hover:border-gold hover:text-gold disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90 shadow-sm"
          aria-label="Grupo anterior"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 px-2">
          {groups.map((group, index) => (
            <div
              key={group.group}
              className="flex flex-col items-center gap-1 cursor-pointer group"
              onClick={() => onChange(index)}
            >
              <button
                className={cn(
                  "w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all",
                  index === selectedIndex
                    ? "border-gold bg-gold shadow-lg shadow-gold/20 scale-110"
                    : "border-border bg-secondary group-hover:border-gold/50"
                )}
              />

              <span className={cn(
                "text-[10px] sm:text-xs font-black transition-colors",
                index === selectedIndex ? "text-gold" : "text-muted-foreground group-hover:text-foreground"
              )}>
                {group.group.replace("Group", "")}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={next}
          disabled={selectedIndex === groups.length - 1}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/50 text-foreground border-2 border-border hover:border-gold hover:text-gold disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90 shadow-sm"
          aria-label="Próximo grupo"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}