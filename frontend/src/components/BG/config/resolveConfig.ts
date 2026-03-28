// Resolves (weather, timeOfDay, colorMode) → final WeatherLayerConfig

import type { WeatherCondition, TimeOfDay, ColorMode, WeatherLayerConfig } from "../animatedBG"
import { weatherConfigs } from "./weatherConfigs"
import { applyTimeOfDay } from "./timeOfDayModifiers"
import { applyColorMode } from "./colorModeModifiers"

export function resolveConfig(
  weather: WeatherCondition,
  timeOfDay: TimeOfDay,
  colorMode: ColorMode
): WeatherLayerConfig {
  const base = weatherConfigs[weather]
  const withTime = applyTimeOfDay(base, timeOfDay)
  const withMode = applyColorMode(withTime, colorMode)
  return withMode
}
