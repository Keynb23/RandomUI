# Routes

> Claude: Before working on any routing, read this file.

## Structure

This is a React + TypeScript + Vite application. Routing is handled with **TanStack Router** (code-based, not file-based).

```
src/
  pages/
    Home/
      index.tsx
    Forecast/
      index.tsx
    Settings/
      index.tsx
  components/
    Layout/
      index.tsx        ← Shared layout wrapper (nav, footer)
  router/
    index.tsx          ← Route definitions live here
```

## Route Definitions

All routes are defined in `src/router/index.tsx`. Add new routes here — do not scatter route definitions across the app.

```tsx
// src/router/index.tsx
import { createRouter, createRoute, createRootRoute, Outlet } from "@tanstack/react-router";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Forecast from "@/pages/Forecast";
import Settings from "@/pages/Settings";
import ErrorScreen from "@/components/ErrorScreen";

// Root route — shared layout wraps all pages
const rootRoute = createRootRoute({
  component: Layout,
  errorComponent: ErrorScreen,
});

// Child routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const forecastRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forecast",
  component: Forecast,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: Settings,
});

const routeTree = rootRoute.addChildren([indexRoute, forecastRoute, settingsRoute]);

export const router = createRouter({ routeTree });

// Type safety for router
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
```

## Layout Component

The root route's component acts as the shared layout. It must render `<Outlet />` for child routes.

```tsx
// src/components/Layout/index.tsx
import { Outlet } from "@tanstack/react-router";

const Layout: React.FC = () => {
  return (
    <div className="AppLayout min-h-screen bg-ink-black text-snow">
      {/* Navigation */}
      <nav className="AppNav p-4">
        {/* nav links here */}
      </nav>

      {/* Page content rendered by child routes */}
      <Outlet />
    </div>
  );
};

export default Layout;
```

## Conventions

- **Page folders** use PascalCase: `Home/`, `Forecast/`
- Each page is `index.tsx` inside its folder
- **Lazy loading** — use `createRoute` with `lazy` if the bundle grows large
- **Internal links** use `<Link>` from `@tanstack/react-router`, never raw `<a>` tags
- **404** — add a `notFoundComponent` to the root route for unmatched paths
- **Route type safety** — always include the `declare module` block in `router/index.tsx`

```tsx
// Using Link for internal navigation
import { Link } from "@tanstack/react-router";

<Link to="/forecast" className="NavLink text-snow hover:text-light-blue transition-colors">
  Forecast
</Link>
```

## Current Routes

| Path         | Page        | Notes                    |
|--------------|-------------|--------------------------|
| `/`          | Home        | Landing / current weather |
| `/forecast`  | Forecast    | Extended forecast view   |
| `/settings`  | Settings    | User preferences         |
