export default function PaginationDot() {
  return (
    <div className="flex flex-col items-center gap-0.5 cursor-pointer group">
      <button className="w-4 h-4 rounded-full border border-border bg-gold cursor-pointer transition-colors duration-200 group-hover:border-yellow-200"></button>
      <span className="text-xs text-muted-foreground group-hover:text-yellow-200">A</span>
    </div>
  );
}