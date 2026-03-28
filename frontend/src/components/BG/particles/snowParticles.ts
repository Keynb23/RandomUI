// Snow particle system — falling flakes with sinusoidal drift

import type { ParticleConfig } from "../animatedBG"

export interface SnowFlake {
  x: number
  y: number
  baseX: number // original x for drift calculation
  speed: number
  size: number
  opacity: number
  driftPhase: number // radians, for sinusoidal sway
  driftSpeed: number
}

export function createSnowFlakes(
  config: ParticleConfig,
  width: number,
  height: number
): SnowFlake[] {
  return Array.from({ length: config.count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    baseX: Math.random() * width,
    speed: config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]),
    size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
    opacity: config.opacity * (0.4 + Math.random() * 0.6),
    driftPhase: Math.random() * Math.PI * 2,
    driftSpeed: 0.5 + Math.random() * 1.5,
  }))
}

export function updateSnowFlakes(
  flakes: SnowFlake[],
  config: ParticleConfig,
  width: number,
  height: number,
  deltaTime: number,
  elapsed: number
): void {
  const drift = config.drift ?? 20
  const windRad = (config.windAngle * Math.PI) / 180

  for (const flake of flakes) {
    flake.y += flake.speed * deltaTime
    flake.baseX += Math.tan(windRad) * flake.speed * deltaTime * 0.5

    // Sinusoidal horizontal drift
    flake.x = flake.baseX + Math.sin(elapsed * flake.driftSpeed + flake.driftPhase) * drift

    // Reset when past bottom
    if (flake.y > height + flake.size) {
      flake.y = -flake.size
      flake.baseX = Math.random() * width
      flake.x = flake.baseX
    }

    // Wrap horizontally
    if (flake.baseX < -30) flake.baseX = width + 30
    if (flake.baseX > width + 30) flake.baseX = -30
  }
}

export function drawSnowFlakes(
  ctx: CanvasRenderingContext2D,
  flakes: SnowFlake[],
  config: ParticleConfig
): void {
  for (const flake of flakes) {
    // Glow
    if (config.glowEnabled && config.glowColor) {
      ctx.beginPath()
      ctx.arc(flake.x, flake.y, flake.size * 2, 0, Math.PI * 2)
      ctx.fillStyle = config.glowColor
      ctx.globalAlpha = flake.opacity * 0.2
      ctx.fill()
    }

    // Flake
    ctx.beginPath()
    ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2)
    ctx.fillStyle = config.color
    ctx.globalAlpha = flake.opacity
    ctx.fill()
  }

  ctx.globalAlpha = 1
}
