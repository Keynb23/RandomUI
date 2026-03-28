# Comments

> Claude: Apply these conventions to every file you create or edit.

## Philosophy

Comment just enough so anyone can navigate the file quickly. Don't explain *what* the code does line-by-line — explain *what a block is* and *why a function exists*. One good comment per logical unit.

---

## Components

Label the component at the top with a single-line comment. No need to re-explain what React or hooks do.

```tsx
import React, { useState } from "react";

// Weather Card — displays current conditions for a given city
const WeatherCard: React.FC<WeatherCardProps> = ({ city, temp, condition }) => {
  const [unit, setUnit] = useState<"F" | "C">("F");

  // Toggle between Fahrenheit and Celsius
  const handleUnitToggle = (): void => {
    setUnit((prev) => (prev === "F" ? "C" : "F"));
  };

  return (
    <div className="WeatherCard p-6 bg-white/5 border border-frosted-blue/30 rounded-xl">
      {/* City Name */}
      <h2 className="CityName text-2xl font-bold text-snow">{city}</h2>

      {/* Temperature Display */}
      <span className="TempDisplay text-6xl font-black text-light-blue">
        {temp}°{unit}
      </span>

      {/* Unit Toggle */}
      <button className="UnitToggleBtn mt-4 px-3 py-1 border border-frosted-blue text-frosted-blue rounded" onClick={handleUnitToggle}>
        Switch to °{unit === "F" ? "C" : "F"}
      </button>
    </div>
  );
};

export default WeatherCard;
```

---

## Functions & Hooks

One comment above the function describing its purpose. For complex logic inside, a short inline comment is fine.

```ts
// Fetches current weather data from the API for a given city
const fetchWeather = async (city: string): Promise<WeatherData> => {
  const res = await fetch(`/api/weather?city=${city}`);
  if (!res.ok) throw new AppError("WEATHER_FETCH_FAILED");
  return res.json();
};
```

```ts
// Returns formatted temperature string based on user's unit preference
const formatTemp = (temp: number, unit: "F" | "C"): string => {
  const converted = unit === "C" ? ((temp - 32) * 5) / 9 : temp;
  return `${Math.round(converted)}°${unit}`;
};
```

---

## Schemas

Label the schema and each field group when grouping makes sense.

```ts
import { z } from "zod";

// Weather API response schema
export const WeatherSchema = z.object({
  city: z.string(),
  temp: z.number(),
  condition: z.string(),
  // Extended forecast (optional)
  forecast: z.array(z.object({
    date: z.string(),
    high: z.number(),
    low: z.number(),
  })).optional(),
});

export type WeatherData = z.infer<typeof WeatherSchema>;
```

---

## Imports

No comments needed on imports unless you're flagging something non-obvious (e.g. a polyfill or aliased path).

```ts
// Path alias — configured in vite.config.ts
import WeatherCard from "@/components/WeatherCard";
```

---

## What NOT to Comment

```tsx
// ❌ Don't explain obvious React
const [city, setCity] = useState(""); // state for city — unnecessary

// ❌ Don't label every JSX element if the className already says it
<div className="Wrapper"> {/* wrapper div */} — redundant

// ✅ Do label elements that aren't self-evident from className alone
{/* Conditionally shown when API returns no results */}
{!results && <EmptyState />}
```