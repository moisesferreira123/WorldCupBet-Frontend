import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import Sweepstakes from './pages/Sweepstakes'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Ranking from './pages/Ranking'
import Matches from './pages/Matches'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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
])

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider >
  </StrictMode >,
)
