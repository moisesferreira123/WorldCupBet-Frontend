import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import Sweepstakes from './pages/Sweepstakes'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Ranking from './pages/Ranking'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Sweepstakes />,
  },
  {
    path: "/ranking",
    element: <Ranking />,
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
