// Particle Layer — canvas-based particle rendering + lightning flash overlay

import { useRef, useEffect } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import type { ParticleConfig, LightningConfig } from "../animatedBG"
import { createParticleSystem, type ParticleSystem } from "../particles/createParticleSystem"
import { startLightning } from "../particles/lightningEffect"

interface ParticleLayerProps {
  config: ParticleConfig
  lightning: LightningConfig
}

const ParticleLayer: React.FC<ParticleLayerProps> = ({ config, lightning }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const systemRef = useRef<ParticleSystem | null>(null)
  const tickerRef = useRef<gsap.Callback | null>(null)
  const lightningTlRef = useRef<gsap.core.Timeline | null>(null)
  const elapsedRef = useRef(0)

  // Set up canvas and particle system
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
      systemRef.current?.resize(window.innerWidth, window.innerHeight)
    }

    resize()

    // Create particle system
    systemRef.current = createParticleSystem(
      config,
      window.innerWidth,
      window.innerHeight
    )

    // GSAP ticker for animation loop
    let lastTime = performance.now()

    const tick = () => {
      const now = performance.now()
      const dt = Math.min((now - lastTime) / 1000, 0.05) // cap delta to avoid jumps
      lastTime = now
      elapsedRef.current += dt

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      systemRef.current?.update(dt, elapsedRef.current)
      systemRef.current?.draw(ctx)
    }

    gsap.ticker.add(tick)
    tickerRef.current = tick

    const observer = new ResizeObserver(resize)
    observer.observe(document.body)

    return () => {
      if (tickerRef.current) gsap.ticker.remove(tickerRef.current)
      observer.disconnect()
    }
  }, [config])

  // Lightning effect
  useGSAP(() => {
    lightningTlRef.current?.kill()
    lightningTlRef.current = null

    if (!flashRef.current || !containerRef.current || !lightning.enabled) return

    flashRef.current.style.backgroundColor = lightning.flashColor
    flashRef.current.style.opacity = "0"

    lightningTlRef.current = startLightning(
      flashRef.current,
      containerRef.current,
      lightning
    )

    return () => {
      lightningTlRef.current?.kill()
    }
  }, { dependencies: [lightning] })

  return (
    <div ref={containerRef} className="ParticleLayer absolute inset-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ willChange: "contents" }}
      />
      {/* Lightning flash overlay */}
      <div
        ref={flashRef}
        className="LightningFlash absolute inset-0 opacity-0"
        style={{ mixBlendMode: "screen" }}
      />
    </div>
  )
}

export default ParticleLayer
