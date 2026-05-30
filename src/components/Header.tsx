export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <a className="flex items-center gap-2 active" href="/" data-status="active" aria-current="page">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-(image:--gradient-gold) shadow-(--shadow-gold)">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trophy h-5 w-5 text-gold-foreground" aria-hidden="true"><path d="M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978"></path><path d="M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978"></path><path d="M18 9h1.5a1 1 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"></path><path d="M6 9H4.5a1 1 0 0 1 0-5H6"></path></svg>
          </div>
          <div className="leading-tight">
            <p className="font-display text-base font-bold tracking-tight">Bolão da Copa</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Mundial 2026</p>
          </div>
        </a>
      </div>
    </header>
  )
}