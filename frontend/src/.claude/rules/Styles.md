# Styles

> Claude: Before working on any UI or styling task, read this file. Also read `naming.md`.

## Aesthetic Direction

**Vibe:** 1980s ski resort meets cyberpunk. Think neon signs glowing through mountain fog, retro digital displays, fluorescent trail markers, and après-ski arcade energy. Bold, warm nostalgia with cold electric accents.

References: neon-lit ski lodge signs, retro weather ticker displays, VHS-era UI, glowing instrument panels.

---

## Color Tokens

Defined in `tailwind.config.ts`. Use these — do not hardcode hex values in components.

### Main Colors
| Token          | Hex       | Role                                          |
|----------------|-----------|-----------------------------------------------|
| `light-blue`   | `#93E6E6` | Primary accent — glowing highlights, active states |
| `pink-purple`  | `#AA3E98` | Secondary accent — neon pop, CTAs             |
| `Emerald`      | `#33CA7F` | Success states, positive indicators           |

### Supporting Colors
| Token             | Hex       | Role                                       |
|-------------------|-----------|--------------------------------------------|
| `frosted-blue`    | `#84C7D0` | Muted glow, borders, subtle accents        |
| `lavender-purple` | `#9368B7` | Gradients, hover states                    |
| `VintageGrape`    | `#5F5069` | Muted UI elements, secondary backgrounds   |

### Accent / Neutral Colors
| Token          | Hex       | Role                                          |
|----------------|-----------|-----------------------------------------------|
| `ink-black`    | `#011627` | Base background                               |
| `Black`        | `#080708` | Deep backgrounds, overlays                    |
| `snow`         | `#F9F9F9` | Primary text on dark backgrounds              |
| `FloralWhite`  | `#FAF7ED` | Warm light surfaces, cards                    |
| `AzureMist`    | `#E9FCFD` | Cool light surfaces, frosted panels           |

### Usage Examples

```tsx
// Base background
<div className="bg-ink-black">

// Neon accent text
<h1 className="text-light-blue">

// CTA button
<button className="bg-pink-purple hover:bg-lavender-purple text-snow">

// Success badge
<span className="text-Emerald border border-Emerald">

// Frosted card
<div className="border border-frosted-blue bg-ink-black/80">

// Muted secondary panel
<div className="bg-VintageGrape text-snow">

// Warm light card (if used on a lighter section)
<div className="bg-FloralWhite text-ink-black">
```

---

## Typography

Font is **Inter** (`font-sans`), loaded via Google Fonts.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
```

### Font Sizes

| Class   | Size       |
|---------|------------|
| `text-xs`   | 12px   |
| `text-sm`   | 14px   |
| `text-base` | 16px   |
| `text-lg`   | 18px   |
| `text-xl`   | 20px   |
| `text-2xl`  | 24px   |
| `text-3xl`  | 30px   |
| `text-4xl`  | 36px   |
| `text-5xl`  | 48px   |

### Font Weights

| Class              | Weight |
|--------------------|--------|
| `font-thin`        | 100    |
| `font-xl`          | 200    |
| `font-light`       | 300    |
| `font-normal`      | 400    |
| `font-medium`      | 500    |
| `font-semibold`    | 600    |
| `font-bold`        | 700    |
| `font-extrabold`   | 800    |
| `font-black`       | 900    |

---

## Effects & Atmosphere

Lean into these to sell the vibe:

- **Glow / neon shadow** on key elements:
  ```tsx
  // Tailwind arbitrary value
  className="shadow-[0_0_20px_#93E6E6]"
  ```
- **Frosted glass** cards for weather panels:
  ```tsx
  className="bg-white/5 backdrop-blur-md border border-frosted-blue/30"
  ```
- **Scanline / noise texture** — subtle, applied via a pseudo-element or `bg-[url(...)]` overlay
- **Gradients** — diagonal, ink-black to lavender-purple for backgrounds
- **Borders** — thin, glowing, `border-light-blue` or `border-pink-purple`

---

## Dark Theme Only

This app is **dark theme exclusively**. Do not add light mode. Base background is always `bg-ink-black` or a near-black variant.

---

## Don't

- Don't hardcode hex values — always use the token classes above
- Don't use colors outside the palette (no generic Tailwind grays, whites, etc.)
- Don't use flat, unlit UI — everything should feel like it has some glow or depth
- Don't use purple gradients on white backgrounds (generic AI aesthetic)
- Don't use `FloralWhite` or `AzureMist` as base backgrounds — those are for cards/panels only