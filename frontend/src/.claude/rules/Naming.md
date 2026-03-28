# Naming

> Claude: Before writing any JSX, read this file.

## JSX Element Naming

When naming an element's `className`, the **element type comes first**, followed by its role/variant, followed by Tailwind utility classes.

### Pattern

```
{ElementType}{Role/Variant} {tailwind classes...}
```

### Examples

```tsx
{/* Button */}
<button className="ColorChangeBtn p-4 bg-pink-purple text-snow rounded" onClick={changeColor}>
  Change Color
</button>

{/* Input */}
<input className="CitySearchInput w-full px-4 py-2 bg-ink-black border border-frosted-blue text-snow" />

{/* Card wrapper */}
<div className="WeatherCard p-6 bg-white/5 backdrop-blur-md border border-frosted-blue/30 rounded-xl">

{/* Heading */}
<h1 className="AppTitle text-4xl font-bold text-light-blue">

{/* Icon */}
<img className="WeatherIcon w-16 h-16" src={icon} alt="weather" />

{/* Nav link */}
<a className="NavLink text-snow hover:text-light-blue transition-colors" href="/">
```

### Rules

- **PascalCase** for the semantic name portion (`ColorChangeBtn`, not `colorchangebtn` or `color-change-btn`)
- The semantic name should describe **what it is + what it does**, not how it looks
- Tailwind classes follow after a space — no separator needed
- Keep it readable: if the class string gets long, break onto a new line with a comment above

```tsx
{/* Temperature Display */}
<span className="TempDisplay text-6xl font-black text-light-blue tracking-tight">
  {temp}°
</span>
```

---

## File & Component Naming

| Thing              | Convention         | Example                    |
|--------------------|--------------------|----------------------------|
| Component files    | PascalCase         | `WeatherCard.tsx`          |
| Page folders       | PascalCase         | `pages/Forecast/`          |
| Schema files       | camelCase + suffix | `weather.schema.ts`        |
| Hook files         | camelCase          | `useWeather.ts`            |
| Utility files      | camelCase          | `formatTemp.ts`            |
| Constants          | SCREAMING_SNAKE    | `DEFAULT_CITY`             |
| TypeScript types   | PascalCase         | `WeatherData`, `ForecastItem` |

---

## Variable & Function Naming

- **Boolean vars:** prefix with `is`, `has`, `should` — e.g. `isLoading`, `hasError`
- **Event handlers:** prefix with `handle` — e.g. `handleSearch`, `handleUnitToggle`
- **Async fetchers:** prefix with `fetch` or `get` — e.g. `fetchWeather`, `getCurrentLocation`