import { useState } from "react";
import Header from "../components/shared/Header";
import { recalculateBets } from "../api/client";
import { Lock, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" });

  const handleUpdateBets = async () => {
    if (!password) {
      setStatus({ type: 'error', message: "Senha é obrigatória" });
      return;
    }

    setIsLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const response = await recalculateBets(password);
      if (response.errors.length > 0) {
        setStatus({ type: 'error', message: response.errors[0] });
      } else {
        setStatus({ type: 'success', message: "Apostas atualizadas com sucesso!" });
      }
    } catch (error) {
      setStatus({ type: 'error', message: "Erro ao atualizar apostas" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-10 min-h-screen">
      <Header />
      <main className="mx-auto flex flex-col gap-6 pt-24 pb-20 px-4 sm:w-2/3 lg:w-1/2">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-bold tracking-tight">Administração</h1>
          <p className="text-muted-foreground">Área restrita para manutenção do sistema.</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" title="Senha Administrativa" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Lock className="h-4 w-4" /> Senha Administrativa
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-all"
              placeholder="Digite a senha..."
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handleUpdateBets}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gold py-3 font-bold text-gold-foreground transition-all hover:bg-gold-elevated hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <RefreshCw className="h-5 w-5" />
              )}
              Atualizar Apostas
            </button>
          </div>

          {status.type && (
            <div className={`mt-4 p-4 rounded-xl text-sm border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${status.type === 'success'
              ? 'bg-success/10 border-success/20 text-success'
              : 'bg-destructive/10 border-destructive/20 text-destructive'
              }`}>
              {status.type === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
              {status.message}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
