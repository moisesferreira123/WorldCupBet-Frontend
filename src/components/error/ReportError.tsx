type ReportErrorProps = {
   error: Error;
};

export default function ReportError({ error }: ReportErrorProps) {
   const reportError = () => {
      const body = `
## Erro

${error.message}

## Página

${window.location.href}

## Data

${new Date().toISOString()}

## Navegador

${navigator.userAgent}

## Stack Trace

\`\`\`
${error.stack ?? "Não disponível"}
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
      <div className="text-surface-foreground rounded-lg matte border border-border-elevated p-6 w-full">
         <h2 className="mb-2 text-lg font-semibold">
            Ocorreu um erro inesperado
         </h2>

         <p className="mb-4">
            Encontramos um problema ao processar sua solicitação.
            Caso o erro persista, por favor reporte para que possamos corrigir.
         </p>

         <button
            onClick={reportError}
            className="rounded-md w-full bg-red-600 px-4 py-2 hover:bg-red-700"
         >
            Reportar erro
         </button>
      </div>
   );
}