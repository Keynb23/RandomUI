// Light mode modifier — raises brightness, reduces glow, shifts atmosphere lighter

import type { ColorMode, WeatherLayerConfig, GradientStop } from "../animatedBG"

// Lighten a hex color by mixing toward white
function lightenHex(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const nr = Math.min(255, Math.round(r + (255 - r) * amount))
  const ng = Math.min(255, Math.round(g + (255 - g) * amount))
  const nb = Math.min(255, Math.round(b + (255 - b) * amount))
  return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`
}

function lightenStops(stops: GradientStop[], amount: number): GradientStop[] {
  return stops.map((s) => ({
    ...s,
    color: s.color.startsWith("#") ? lightenHex(s.color, amount) : s.color,
  }))
}

export function applyColorMode(
  config: WeatherLayerConfig,
  mode: ColorMode
): WeatherLayerConfig {
  if (mode === "dark") return config

  // Light mode modifications
  return {
    ...config,
    sky: {
      ...config.sky,
      stops: lightenStops(config.sky.stops, 0.45),
      glowIntensity: (config.sky.glowIntensity ?? 0) * 0.6,
    },
    atmosphere: {
      ...config.atmosphere,
      clouds: config.atmosphere.clouds
        ? {
            ...config.atmosphere.clouds,
            color: "rgba(249, 249, 249, 0.35)",
            opacity: config.atmosphere.clouds.opacity * 0.8,
          }
        : undefined,
      hazeOpacity: config.atmosphere.hazeOpacity * 0.6,
      hazeColor: "rgba(249, 249, 249, 0.1)",
      fogColor: config.atmosphere.fogEnabled
        ? "rgba(249, 249, 249, 0.2)"
        : undefined,
    },
    particles: {
      ...config.particles,
      opacity: config.particles.opacity * 0.75,
      glowEnabled: false,
    },
    lightning: {
      ...config.lightning,
      flashColor: config.lightning.enabled ? "#FAF7ED" : config.lightning.flashColor,
      flashOpacity: config.lightning.flashOpacity * 0.7,
    },
  }
}
