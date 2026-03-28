import { createRootRoute, Outlet } from '@tanstack/react-router'

export const rootRoute = createRootRoute({
  component: () => (
    <>
      {/* Shared layout goes here (nav, footer, etc.) */}
      <Outlet />
    </>
  ),
})
