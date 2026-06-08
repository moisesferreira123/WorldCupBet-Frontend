import type { ApiResponse } from "../../api/client";

export interface AppError extends Error {
   apiResponse?: ApiResponse<unknown>;
}

type ReportErrorProps = {
   error: AppError;
};

export default function ReportError({ error }: ReportErrorProps) {
   const truncate = (str: string, limit: number = 1000) => {
      if (str.length <= limit) return str;
      return str.slice(0, limit) + "... (truncado por ser muito grande)";
   };

   const reportError = () => {
      const apiInfo = error.apiResponse ? `
## API Request
\`\`\`json
${truncate(JSON.stringify(error.apiResponse.request, null, 2), 1500)}
\`\`\`

## API Response
\`\`\`json
${truncate(JSON.stringify(error.apiResponse.response, null, 2), 1500)}
\`\`\`
` : "";

      const body = `
## Erro

${error.message}

## Página

${window.location.href}

## Data

${new Date().toISOString()}

## Navegador

${navigator.userAgent}
${apiInfo}
## Stack Trace

\`\`\`
${truncate(error.stack ?? "Não disponível", 1000)}
\`\`\`
`;

      const url =
         "https://github.com/moisesferreira123/WorldCupBet-Frontend/issues/new?" +
         new URLSearchParams({
            title: `[Bug] ${error.message}`,
            body,
         });

      window.open(url, "_blank");
   };

   return (
      <div className="text-surface-foreground rounded-2xl border border-destructive/20 bg-destructive/5 p-6 w-full backdrop-blur-sm">
         <h2 className="mb-2 text-lg font-bold text-destructive">
            Ocorreu um erro inesperado
         </h2>

         <p className="mb-4 text-sm text-muted-foreground">
            Encontramos um problema ao processar sua solicitação.
            {error.apiResponse && (
               <span className="block mt-2 font-mono text-xs bg-destructive/10 p-2 rounded border border-destructive/20">
                  {error.message}
               </span>
            )}
         </p>

         <button
            onClick={reportError}
            className="w-full rounded-xl bg-destructive px-4 py-2.5 font-bold text-destructive-foreground transition-all hover:brightness-110 active:scale-95"
         >
            Reportar erro e enviar detalhes
         </button>
      </div>
   );
}