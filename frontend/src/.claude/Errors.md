# Errors

> Claude: When working on error handling, data fetching, or error UI, read this file.

## Error Boundary

Wrap the app (and optionally individual page sections) in an `ErrorBoundary` component. Use `react-error-boundary` — no need to write a class component manually.

```tsx
// src/main.tsx
import { ErrorBoundary } from "react-error-boundary";
import ErrorScreen from "@/components/ErrorScreen";

<ErrorBoundary FallbackComponent={ErrorScreen}>
  <App />
</ErrorBoundary>
```

For route-level errors, also set `errorElement: <ErrorScreen />` in the router (see `routes.md`).

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

## Throwing Errors

```ts
import { AppError } from "@/errors/AppError";

const fetchWeather = async (city: string) => {
  try {
    const res = await fetch(`/api/weather?city=${city}`);
    if (res.status === 404) throw new AppError("CITY_NOT_FOUND");
    if (!res.ok) throw new AppError("WEATHER_FETCH_FAILED");
    return res.json();
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError("NETWORK_ERROR");
  }
};
```

---

## ErrorScreen Component

Shown when the ErrorBoundary catches an unrecoverable error. Should be clear, branded, and match the app's aesthetic.

```tsx
// src/components/ErrorScreen/index.tsx
import { FallbackProps } from "react-error-boundary";
import { AppError } from "@/errors/AppError";

// Error codes → human-readable messages
const ERROR_MESSAGES: Record<string, string> = {
  WEATHER_FETCH_FAILED: "Couldn't load weather data. Try again.",
  CITY_NOT_FOUND: "City not found. Check the spelling.",
  LOCATION_DENIED: "Location access denied. Enter a city manually.",
  FORECAST_UNAVAILABLE: "Forecast data is unavailable right now.",
  NETWORK_ERROR: "No connection. Check your network.",
  UNKNOWN_ERROR: "Something went wrong. Try refreshing.",
};

// Full-screen error fallback — shown by ErrorBoundary
const ErrorScreen: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
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
        onClick={resetErrorBoundary}
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

For errors that don't crash the whole app (e.g. a failed search), handle locally with state — don't bubble up to the boundary.

```tsx
const [error, setError] = useState<string | null>(null);

try {
  await fetchWeather(city);
} catch (err) {
  if (err instanceof AppError) {
    setError(ERROR_MESSAGES[err.code] ?? ERROR_MESSAGES["UNKNOWN_ERROR"]);
  }
}

{/* Inline Error Message */}
{error && (
  <p className="InlineError text-sm text-pink-purple mt-2">{error}</p>
)}
```