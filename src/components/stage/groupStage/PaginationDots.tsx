import { ChevronLeft, ChevronRight } from "lucide-react";
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
    <div className="flex justify-center gap-3">
      <button
        onClick={previous}
        disabled={selectedIndex === 0}
        className="text-muted-foreground hover:text-white disabled:opacity-30"
      >
        <ChevronLeft size={16} />
      </button>

      {groups.map((group, index) => (
        <div
          key={group.group}
          className="flex flex-col items-center gap-0.5 cursor-pointer group"
          onClick={() => onChange(index)}
        >
          <button
            className={
              index === selectedIndex
                ? "w-4 h-4 rounded-full border border-border bg-gold"
                : "w-4 h-4 rounded-full border border-border"
            }
          />

          <span className="text-xs text-muted-foreground group-hover:text-white">
            {group.group.replace("Group", "")}
          </span>
        </div>
      ))}

      <button
        onClick={next}
        disabled={selectedIndex === groups.length - 1}
        className="text-muted-foreground hover:text-white disabled:opacity-30"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}