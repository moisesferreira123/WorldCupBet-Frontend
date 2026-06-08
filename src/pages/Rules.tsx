import Header from "../components/shared/Header";
import { Trophy, Target, Award, ShieldAlert, Users, Zap, Star } from "lucide-react";
import { cn } from "../lib/utils";

export default function Rules() {
  const scoringRules = [
    {
      title: "Placar Exato",
      points: "+5",
      description: "Você acertou exatamente o resultado da partida (ex: apostou 2x1 e terminou 2x1).",
      icon: <Target className="h-5 w-5" />,
      color: "bg-success/10 text-success border-success/20",
      badge: "bg-success text-success-foreground",
    },
    {
      title: "Resultado Correto",
      points: "+3",
      description: "Você acertou o vencedor ou empate, mas errou o número exato de gols.",
      icon: <Award className="h-5 w-5" />,
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      badge: "bg-blue-500 text-white",
    },
    {
      title: "Placar de um Time",
      points: "+1",
      description: "Você acertou a quantidade de gols marcada por apenas um dos times na partida.",
      icon: <Zap className="h-5 w-5" />,
      color: "bg-muted text-muted-foreground border-muted-foreground/20",
      badge: "bg-muted-foreground text-background",
    },
    {
      title: "Placar Invertido",
      points: "-3",
      description: "Você inverteu o placar (ex: apostou 2x1 e foi 1x2). Válido apenas na Fase de Grupos.",
      icon: <ShieldAlert className="h-5 w-5" />,
      color: "bg-destructive/10 text-destructive border-destructive/20",
      badge: "bg-destructive text-destructive-foreground",
    },
    {
      title: "Time no Mata-Mata",
      points: "+2",
      description: "Você acertou um dos times que participaria de um confronto do mata-mata. Válido por time.",
      icon: <Users className="h-5 w-5" />,
      color: "bg-warning/10 text-warning border-warning/20",
      badge: "bg-warning text-warning-foreground",
    },
    {
      title: "Vencedor nos Pênaltis",
      points: "+5",
      description: "Você acertou qual time venceu a disputa de pênaltis em jogos eliminatórios.",
      icon: <Star className="h-5 w-5" />,
      color: "bg-gold/10 text-gold border-gold/20",
      badge: "bg-gold text-gold-foreground",
    },
    {
      title: "Campeão Final",
      points: "+15",
      description: "Você acertou o grande campeão da Copa do Mundo em seu palpite.",
      icon: <Trophy className="h-5 w-5" />,
      color: "bg-gold/20 text-gold border-gold/30 shadow-[0_0_15px_rgba(255,215,0,0.15)]",
      badge: "bg-gold text-gold-foreground",
    },
  ];

  return (
    <div className="relative z-10 min-h-screen">
      <Header />
      <main className="mx-auto flex flex-col gap-6 pt-24 pb-20 px-4 sm:w-2/3 lg:w-1/2">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-bold tracking-tight">Regras de Pontuação</h1>
          <p className="text-muted-foreground">Entenda como somar pontos e subir no ranking do nosso bolão.</p>
        </div>

        <div className="grid gap-3">
          {scoringRules.map((rule, index) => (
            <div 
              key={index} 
              className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:border-border-elevated hover:shadow-glow group"
            >
              <div className={cn(
                "grid h-12 w-12 shrink-0 place-items-center rounded-xl border transition-transform group-hover:scale-110",
                rule.color
              )}>
                {rule.icon}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground">{rule.title}</h3>
                  <span className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums shadow-sm",
                    rule.badge
                  )}>
                    {rule.points} pts
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{rule.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-secondary/20 p-5 text-sm text-muted-foreground/80 italic backdrop-blur-sm">
          <p className="flex gap-2">
            <span className="font-bold text-warning">!</span>
            <span>Importante: As pontuações de Placar Exato, Resultado Correto e Placar de um Time não são cumulativas. A maior pontuação alcançada entre elas será a considerada.</span>
          </p>
        </div>
      </main>
    </div>
  );
}
