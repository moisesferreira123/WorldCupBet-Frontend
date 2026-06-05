import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationDots() {
  return (
    <div className="flex justify-center gap-3">
      <button className="flex flex-start text-muted-foreground hover:text-yellow-200 cursor-pointer mr-1">
        <ChevronLeft size={16} />
      </button>

      <div className="flex flex-col items-center gap-0.5 cursor-pointer group">
        <button className="w-4 h-4 rounded-full border border-border bg-gold cursor-pointer transition-colors duration-200 group-hover:border-yellow-200"></button>
        <span className="text-xs text-muted-foreground group-hover:text-yellow-200">A</span>
      </div>

      <div className="flex flex-col items-center gap-0.5 cursor-pointer group">
        <button className="w-4 h-4 rounded-full border border-border cursor-pointer group-hover:border-yellow-200"></button>
        <span className="text-xs text-muted-foreground group-hover:text-yellow-200">B</span>
      </div>

      <div className="flex flex-col items-center gap-0.5 cursor-pointer group">
        <button className="w-4 h-4 rounded-full border border-border cursor-pointer group-hover:border-yellow-200"></button>
        <span className="text-xs text-muted-foreground group-hover:text-yellow-200">C</span>
      </div>

      <button className="flex flex-start text-muted-foreground hover:text-yellow-200 cursor-pointer ml-1">
        <ChevronRight size={16} />
      </button>
    </div>
  );
}