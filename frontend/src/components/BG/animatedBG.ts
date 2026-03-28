// Weather Background Type System — drives all 3 animation layers

export type WeatherCondition =
  | "sunny"
  | "cloudy"
  | "overcast"
  | "rain"
  | "thunderstorm"
  | "snow"

export type TimeOfDay = "day" | "night"

export type ColorMode = "light" | "dark"

// --- Sky Layer ---

export interface GradientStop {
  color: string
  position: number // 0–100
}

export interface SkyConfig {
  angle: number
  stops: GradientStop[]
  glowColor?: string
  glowIntensity?: number // 0–1
  breatheDuration: number // seconds for subtle gradient shift
}

// --- Atmosphere Layer ---

export interface CloudConfig {
  count: number
  color: string
  opacity: number
  speedRange: [number, number]
  sizeRange: [number, number] // viewport %
  blurRange: [number, number]
  verticalRange: [number, number] // viewport %
}

export interface AtmosphereConfig {
  clouds?: CloudConfig
  hazeOpacity: number
  hazeColor: string
  fogEnabled: boolean
  fogColor?: string
  fogHeight?: number // viewport % from bottom
}

// --- Particle Layer ---

export type ParticleType = "rain" | "snow" | "sunray" | "dust" | "none"

export interface ParticleConfig {
  type: ParticleType
  count: number
  color: string
  opacity: number
  sizeRange: [number, number]
  speedRange: [number, number]
  windAngle: number // degrees, 0 = straight down
  drift?: number // horizontal sway amplitude (snow)
  splashEnabled?: boolean // rain
  glowEnabled?: boolean
  glowColor?: string
}

// --- Lightning ---

export interface LightningConfig {
  enabled: boolean
  flashColor: string
  flashOpacity: number
  intervalRange: [number, number] // seconds between flashes
  flashDuration: number
  rumbleEnabled: boolean
}

// --- Composite resolved config ---

export interface WeatherLayerConfig {
  sky: SkyConfig
  atmosphere: AtmosphereConfig
  particles: ParticleConfig
  lightning: LightningConfig
  transitionDuration: number
}

// --- Component props ---

export interface BackgroundProps {
  weather: WeatherCondition
  timeOfDay: TimeOfDay
  colorMode: ColorMode
}
