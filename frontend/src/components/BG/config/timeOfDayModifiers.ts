// Night modifier — darkens sky, shifts particles cooler, amplifies neon glow

import type { TimeOfDay, WeatherLayerConfig, GradientStop } from "../animatedBG"

// Darken a hex color by mixing toward black
function darkenHex(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const nr = Math.round(r * (1 - amount))
  const ng = Math.round(g * (1 - amount))
  const nb = Math.round(b * (1 - amount))
  return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`
}

// Shift a hex color toward blue
function coolShift(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const nr = Math.round(r * (1 - amount * 0.3))
  const ng = Math.round(g * (1 - amount * 0.1))
  const nb = Math.min(255, Math.round(b + (255 - b) * amount * 0.2))
  return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`
}

function darkenStops(stops: GradientStop[], amount: number): GradientStop[] {
  return stops.map((s) => ({
    ...s,
    color: s.color.startsWith("#") ? darkenHex(s.color, amount) : s.color,
  }))
}

export function applyTimeOfDay(
  config: WeatherLayerConfig,
  time: TimeOfDay
): WeatherLayerConfig {
  if (time === "day") return config

  // Night modifications
  return {
    ...config,
    sky: {
      ...config.sky,
      stops: darkenStops(config.sky.stops, 0.4),
      glowIntensity: Math.min(1, (config.sky.glowIntensity ?? 0) + 0.12),
    },
    atmosphere: {
      ...config.atmosphere,
      clouds: config.atmosphere.clouds
        ? {
            ...config.atmosphere.clouds,
            opacity: config.atmosphere.clouds.opacity * 0.7,
            color: config.atmosphere.clouds.color.replace(
              /[\d.]+\)$/,
              `${parseFloat(config.atmosphere.clouds.color.match(/[\d.]+\)$/)?.[0] ?? "0.3") * 0.6})`
            ),
          }
        : undefined,
      hazeOpacity: config.atmosphere.hazeOpacity * 1.3,
    },
    particles: {
      ...config.particles,
      color: config.particles.color.startsWith("#")
        ? coolShift(config.particles.color, 0.3)
        : config.particles.color,
      glowEnabled: true,
      glowColor: config.particles.glowColor ?? "rgba(147, 230, 230, 0.3)",
    },
    lightning: {
      ...config.lightning,
      flashColor: config.lightning.enabled ? "#9368B7" : config.lightning.flashColor,
    },
  }
}
