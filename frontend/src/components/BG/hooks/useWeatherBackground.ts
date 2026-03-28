// Resolves weather config from props, memoized to prevent unnecessary re-renders

import { useMemo } from "react"
import type { WeatherCondition, TimeOfDay, ColorMode, WeatherLayerConfig } from "../animatedBG"
import { resolveConfig } from "../config/resolveConfig"

export function useWeatherBackground(
  weather: WeatherCondition,
  timeOfDay: TimeOfDay,
  colorMode: ColorMode
): WeatherLayerConfig {
  return useMemo(
    () => resolveConfig(weather, timeOfDay, colorMode),
    [weather, timeOfDay, colorMode]
  )
}
