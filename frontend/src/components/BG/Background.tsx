// Weather Background — orchestrates sky, atmosphere, and particle layers

import type { BackgroundProps } from "./animatedBG"
import { useWeatherBackground } from "./hooks/useWeatherBackground"
import SkyLayer from "./layers/SkyLayer"
import AtmosphereLayer from "./layers/AtmosphereLayer"
import ParticleLayer from "./layers/ParticleLayer"

const Background: React.FC<BackgroundProps> = ({ weather, timeOfDay, colorMode }) => {
  const config = useWeatherBackground(weather, timeOfDay, colorMode)

  return (
    <div className="BGContainer fixed inset-0 -z-10 overflow-hidden">
      <SkyLayer config={config.sky} />
      <AtmosphereLayer config={config.atmosphere} />
      <ParticleLayer config={config.particles} lightning={config.lightning} />
    </div>
  )
}

export default Background
