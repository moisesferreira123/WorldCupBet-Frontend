import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import Sweepstakes from './pages/Sweepstakes'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Ranking from './pages/Ranking'
import Matches from './pages/Matches'
import Rules from './pages/Rules'
import Admin from './pages/Admin'
import { QueryClient } from '@tanstack/react-query'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'

import BackgroundElements from './components/shared/BackgroundElements'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Sweepstakes />,
  },
  {
    path: "/matches",
    element: <Matches />,
  },
  {
    path: "/ranking",
    element: <Ranking />,
  },
  {
    path: "/rules",
    element: <Rules />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
])

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15 * 60 * 1000, // 15 minutos de cache "fresco"
      gcTime: 15 * 60 * 1000, // Mantém em memória por 15 minutos
      refetchInterval: 15 * 60 * 1000, // Força atualização a cada 15 minutos
      refetchOnMount: true, // Verifica se expirou ao carregar o componente
      refetchOnWindowFocus: true, // Verifica se expirou ao voltar para a aba
      refetchOnReconnect: true,
      refetchIntervalInBackground: false,
    }
  }
});

const persister = createAsyncStoragePersister({
  storage: window.localStorage
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <BackgroundElements />
      <RouterProvider router={router} />
    </PersistQueryClientProvider >
  </StrictMode >,
)
