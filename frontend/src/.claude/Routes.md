# Routes

> Claude: Before working on any routing, read this file.

## Structure

This is a React + Vite application. Routing is handled with **React Router v6**.

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

All routes are defined in `src/router/index.tsx`. Add new routes here — do not scatter `<Route>` definitions across the app.

```tsx
// src/router/index.tsx
import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Forecast from "@/pages/Forecast";
import Settings from "@/pages/Settings";
import ErrorScreen from "@/components/ErrorScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorScreen />,
    children: [
      { index: true, element: <Home /> },
      { path: "forecast", element: <Forecast /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);
```

## Conventions

- **Page folders** use PascalCase: `Home/`, `Forecast/`
- Each page is `index.tsx` inside its folder
- **Lazy loading** — wrap pages in `React.lazy()` if the bundle grows large
- **Relative links** use React Router's `<Link to="...">`, never raw `<a>` tags for internal navigation
- **404** — add a `path: "*"` catch-all route pointing to a NotFound page if needed

## Current Routes

| Path         | Page        | Notes                  |
|--------------|-------------|------------------------|
| `/`          | Home        | Landing / current weather |
| `/forecast`  | Forecast    | Extended forecast view |
| `/settings`  | Settings    | User preferences       |