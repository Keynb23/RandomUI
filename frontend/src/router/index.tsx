import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router'
import Home from '../pages/Home'

// Root route — shared layout wraps all pages
const rootRoute = createRootRoute({
  component: () => (
    <>
      {/* Shared layout goes here (nav, footer, etc.) */}
      <Outlet />
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

const routeTree = rootRoute.addChildren([indexRoute])

export const router = createRouter({ routeTree })

// Type safety for router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
