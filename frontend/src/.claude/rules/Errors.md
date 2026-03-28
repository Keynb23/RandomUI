# Errors

> Claude: When working on error handling, data fetching, or error UI, read this file.

## Route-Level Error Handling

Use TanStack Router's `errorComponent` on routes. Each route can define its own error UI, and the root route provides a catch-all.

```tsx
// src/router/index.tsx
import ErrorScreen from "@/components/ErrorScreen";

const rootRoute = createRootRoute({
  component: Layout,
  errorComponent: ErrorScreen, // Catch-all for any unhandled route errors
});

// Per-route error handling (optional — falls back to root if not set)
const forecastRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forecast",
  component: Forecast,
  errorComponent: ForecastError, // Route-specific error UI
});
```

---

## AppError Class

All thrown errors in the app should be instances of `AppError`. Never throw raw strings.

```ts
// src/errors/AppError.ts

// Custom error class — carries a code for display + logging
export class AppError extends Error {
  code: string;

  constructor(code: string, message?: string) {
    super(message ?? code);
    this.code = code;
    this.name = "AppError";
  }
}
```

---

## Error Codes

| Code                    | Meaning                                         | User-Facing Message                          |
|-------------------------|-------------------------------------------------|----------------------------------------------|
| `WEATHER_FETCH_FAILED`  | API call to weather service failed              | "Couldn't load weather data. Try again."     |
| `CITY_NOT_FOUND`        | City name returned no results                  | "City not found. Check the spelling."        |
| `LOCATION_DENIED`       | User blocked geolocation permission            | "Location access denied. Enter a city manually." |
| `FORECAST_UNAVAILABLE`  | Forecast endpoint returned empty/invalid data  | "Forecast data is unavailable right now."    |
| `NETWORK_ERROR`         | No internet / request timeout                  | "No connection. Check your network."         |
| `UNKNOWN_ERROR`         | Catch-all for unclassified errors              | "Something went wrong. Try refreshing."      |

---

## Data Fetching Errors (TanStack Query)

All data fetching goes through TanStack Query. Handle errors via the query's `error` state — never try/catch around `useQuery`.

```tsx
import { useQuery } from "@tanstack/react-query";
import { AppError } from "@/errors/AppError";

// Query hook for weather data
const useWeather = (city: string) => {
  return useQuery({
    queryKey: ["weather", city],
    queryFn: () => fetchWeather(city),
  });
};

// In the component
const { data, error, isLoading } = useWeather(city);

{/* Show error from query */}
{error && (
  <p className="InlineError text-sm text-pink-purple mt-2">
    {error instanceof AppError
      ? ERROR_MESSAGES[error.code]
      : ERROR_MESSAGES["UNKNOWN_ERROR"]}
  </p>
)}
```

### Throwing in queryFn

Throw `AppError` inside the fetch function. TanStack Query catches it and surfaces it via the `error` property.

```ts
// src/features/weather/fetchWeather.ts
import { AppError } from "@/errors/AppError";

// Fetches current weather data from the API for a given city
const fetchWeather = async (city: string): Promise<WeatherData> => {
  const res = await fetch(`/api/weather?city=${city}`);
  if (res.status === 404) throw new AppError("CITY_NOT_FOUND");
  if (!res.ok) throw new AppError("WEATHER_FETCH_FAILED");
  return res.json();
};
```

---

## ErrorScreen Component

Shown when a route's `errorComponent` fires. Receives `error` and `reset` from TanStack Router.

```tsx
// src/components/ErrorScreen/index.tsx
import { AppError } from "@/errors/AppError";
import { ErrorComponentProps } from "@tanstack/react-router";

// Error codes → human-readable messages
const ERROR_MESSAGES: Record<string, string> = {
  WEATHER_FETCH_FAILED: "Couldn't load weather data. Try again.",
  CITY_NOT_FOUND: "City not found. Check the spelling.",
  LOCATION_DENIED: "Location access denied. Enter a city manually.",
  FORECAST_UNAVAILABLE: "Forecast data is unavailable right now.",
  NETWORK_ERROR: "No connection. Check your network.",
  UNKNOWN_ERROR: "Something went wrong. Try refreshing.",
};

// Full-screen error fallback — shown by route errorComponent
const ErrorScreen: React.FC<ErrorComponentProps> = ({ error, reset }) => {
  const code = error instanceof AppError ? error.code : "UNKNOWN_ERROR";
  const message = ERROR_MESSAGES[code] ?? ERROR_MESSAGES["UNKNOWN_ERROR"];

  return (
    <div className="ErrorScreen min-h-screen bg-ink-black flex flex-col items-center justify-center gap-6 p-8">
      {/* Error Code Badge */}
      <span className="ErrorCodeBadge font-mono text-sm tracking-widest text-pink-purple border border-pink-purple px-3 py-1 rounded">
        {code}
      </span>

      {/* Message */}
      <p className="ErrorMessage text-xl text-snow text-center max-w-md">
        {message}
      </p>

      {/* Retry */}
      <button
        className="RetryBtn px-6 py-2 border border-light-blue text-light-blue hover:bg-light-blue hover:text-ink-black transition-colors rounded font-mono"
        onClick={reset}
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorScreen;
```

---

## Inline / Non-Fatal Errors

For errors that don't crash the whole page (e.g. a failed search), handle locally via TanStack Query's error state — don't bubble up to the route error boundary.

```tsx
const { data, error } = useWeather(city);

{/* Inline Error Message */}
{error && (
  <p className="InlineError text-sm text-pink-purple mt-2">
    {error instanceof AppError
      ? ERROR_MESSAGES[error.code]
      : ERROR_MESSAGES["UNKNOWN_ERROR"]}
  </p>
)}
```
