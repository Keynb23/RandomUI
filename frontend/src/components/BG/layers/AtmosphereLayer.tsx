// Atmosphere Layer — animated clouds, haze, and fog overlays

import { useRef, useMemo } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import type { AtmosphereConfig } from "../animatedBG"

interface AtmosphereLayerProps {
  config: AtmosphereConfig
}

interface CloudData {
  id: number
  width: number
  top: number
  blur: number
  speed: number
  delay: number
}

function generateClouds(config: AtmosphereConfig): CloudData[] {
  if (!config.clouds) return []

  const { count, sizeRange, verticalRange, blurRange, speedRange } = config.clouds
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    width: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
    top: verticalRange[0] + Math.random() * (verticalRange[1] - verticalRange[0]),
    blur: blurRange[0] + Math.random() * (blurRange[1] - blurRange[0]),
    speed: speedRange[0] + Math.random() * (speedRange[1] - speedRange[0]),
    delay: Math.random() * -20, // stagger start positions
  }))
}

const AtmosphereLayer: React.FC<AtmosphereLayerProps> = ({ config }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const clouds = useMemo(
    () => generateClouds(config),
    [config.clouds?.count, config.clouds?.sizeRange[0], config.clouds?.sizeRange[1]]
  )

  // Animate cloud drift
  useGSAP(() => {
    if (!containerRef.current || clouds.length === 0) return

    const cloudEls = containerRef.current.querySelectorAll<HTMLElement>(".Cloud")

    cloudEls.forEach((el, i) => {
      const cloud = clouds[i]
      if (!cloud) return

      // Drift from right to left, loop infinitely
      const duration = 100 / cloud.speed // normalize to consistent feel
      gsap.fromTo(
        el,
        { x: "110vw" },
        {
          x: "-40vw",
          duration,
          ease: "none",
          repeat: -1,
          delay: cloud.delay,
        }
      )
    })
  }, { scope: containerRef, dependencies: [clouds, config.clouds?.speedRange] })

  return (
    <div ref={containerRef} className="AtmosphereLayer absolute inset-0 pointer-events-none">
      {/* Clouds */}
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="Cloud absolute rounded-full"
          style={{
            width: `${cloud.width}vw`,
            height: `${cloud.width * 0.4}vw`,
            top: `${cloud.top}%`,
            backgroundColor: config.clouds?.color,
            opacity: config.clouds?.opacity,
            filter: `blur(${cloud.blur}px)`,
            willChange: "transform",
          }}
        />
      ))}

      {/* Haze overlay */}
      {config.hazeOpacity > 0 && (
        <div
          className="Haze absolute inset-0"
          style={{
            backgroundColor: config.hazeColor,
            opacity: config.hazeOpacity,
          }}
        />
      )}

      {/* Bottom fog */}
      {config.fogEnabled && config.fogColor && (
        <div
          className="Fog absolute bottom-0 left-0 right-0"
          style={{
            height: `${config.fogHeight ?? 15}%`,
            background: `linear-gradient(to top, ${config.fogColor}, transparent)`,
          }}
        />
      )}
    </div>
  )
}

export default AtmosphereLayer
