// Sky Layer — animated gradient background with crossfade transitions

import { useRef, useEffect, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import type { SkyConfig, GradientStop } from "../animatedBG"

interface SkyLayerProps {
  config: SkyConfig
}

function stopsToGradient(angle: number, stops: GradientStop[]): string {
  const s = stops.map((st) => `${st.color} ${st.position}%`).join(", ")
  return `linear-gradient(${angle}deg, ${s})`
}

function glowRadial(color: string, intensity: number): string {
  return `radial-gradient(ellipse at 70% 20%, ${color}${Math.round(intensity * 255).toString(16).padStart(2, "0")} 0%, transparent 60%)`
}

const SkyLayer: React.FC<SkyLayerProps> = ({ config }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const layerARef = useRef<HTMLDivElement>(null)
  const layerBRef = useRef<HTMLDivElement>(null)
  const [activeLayer, setActiveLayer] = useState<"a" | "b">("a")
  const breatheTimeline = useRef<gsap.core.Timeline | null>(null)

  // Crossfade when config changes
  useEffect(() => {
    const incoming = activeLayer === "a" ? layerBRef.current : layerARef.current
    const outgoing = activeLayer === "a" ? layerARef.current : layerBRef.current

    if (!incoming || !outgoing) return

    // Set new gradient on incoming layer
    incoming.style.background = stopsToGradient(config.angle, config.stops)

    // Crossfade
    gsap.to(incoming, { opacity: 1, duration: 1.2, ease: "power2.inOut" })
    gsap.to(outgoing, {
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut",
      onComplete: () => setActiveLayer((prev) => (prev === "a" ? "b" : "a")),
    })
  }, [config])

  // Glow overlay
  const glowStyle = config.glowColor && config.glowIntensity
    ? { background: glowRadial(config.glowColor, config.glowIntensity) }
    : undefined

  // Breathing animation — subtle gradient stop position shift
  useGSAP(() => {
    if (breatheTimeline.current) breatheTimeline.current.kill()
    if (config.breatheDuration <= 0) return

    const active = activeLayer === "a" ? layerARef.current : layerBRef.current
    if (!active) return

    const proxy = { shift: 0 }
    const baseStops = [...config.stops]

    breatheTimeline.current = gsap.timeline({ repeat: -1, yoyo: true })
    breatheTimeline.current.to(proxy, {
      shift: 3,
      duration: config.breatheDuration,
      ease: "sine.inOut",
      onUpdate: () => {
        const shifted = baseStops.map((s) => ({
          ...s,
          position: Math.max(0, Math.min(100, s.position + proxy.shift)),
        }))
        active.style.background = stopsToGradient(config.angle, shifted)
      },
    })

    return () => {
      breatheTimeline.current?.kill()
    }
  }, { dependencies: [config, activeLayer] })

  return (
    <div ref={containerRef} className="SkyLayer absolute inset-0">
      <div
        ref={layerARef}
        className="absolute inset-0 transition-none"
        style={{
          background: stopsToGradient(config.angle, config.stops),
          willChange: "opacity",
        }}
      />
      <div
        ref={layerBRef}
        className="absolute inset-0 transition-none opacity-0"
        style={{ willChange: "opacity" }}
      />
      {/* Glow overlay */}
      {glowStyle && (
        <div className="SkyGlow absolute inset-0 pointer-events-none" style={glowStyle} />
      )}
    </div>
  )
}

export default SkyLayer
