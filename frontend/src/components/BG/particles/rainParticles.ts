// Rain particle system — falling drops with optional splash

import type { ParticleConfig } from "../animatedBG"

export interface RainDrop {
  x: number
  y: number
  speed: number
  length: number
  opacity: number
  splashTimer: number // countdown after hitting bottom
}

export function createRainDrops(
  config: ParticleConfig,
  width: number,
  height: number
): RainDrop[] {
  return Array.from({ length: config.count }, () => ({
    x: Math.random() * width * 1.2,
    y: Math.random() * height * -1, // start above viewport
    speed: config.speedRange[0] + Math.random() * (config.speedRange[1] - config.speedRange[0]),
    length: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
    opacity: config.opacity * (0.5 + Math.random() * 0.5),
    splashTimer: 0,
  }))
}

export function updateRainDrops(
  drops: RainDrop[],
  config: ParticleConfig,
  width: number,
  height: number,
  deltaTime: number
): void {
  const windRad = (config.windAngle * Math.PI) / 180

  for (const drop of drops) {
    if (drop.splashTimer > 0) {
      drop.splashTimer -= deltaTime
      if (drop.splashTimer <= 0) {
        // Reset drop
        drop.x = Math.random() * width * 1.2
        drop.y = -drop.length
        drop.splashTimer = 0
      }
      continue
    }

    drop.y += drop.speed * deltaTime
    drop.x += Math.tan(windRad) * drop.speed * deltaTime

    // Hit bottom — trigger splash
    if (drop.y > height) {
      if (config.splashEnabled) {
        drop.splashTimer = 0.15
        drop.y = height
      } else {
        drop.x = Math.random() * width * 1.2
        drop.y = -drop.length
      }
    }

    // Wrap horizontally
    if (drop.x < -50) drop.x = width + 50
    if (drop.x > width + 50) drop.x = -50
  }
}

export function drawRainDrops(
  ctx: CanvasRenderingContext2D,
  drops: RainDrop[],
  config: ParticleConfig
): void {
  const windRad = (config.windAngle * Math.PI) / 180

  for (const drop of drops) {
    if (drop.splashTimer > 0) {
      // Draw splash circle
      const splashRadius = 3 + (0.15 - drop.splashTimer) * 20
      const splashAlpha = drop.splashTimer / 0.15
      ctx.beginPath()
      ctx.arc(drop.x, drop.y, splashRadius, 0, Math.PI * 2)
      ctx.strokeStyle = config.color
      ctx.globalAlpha = drop.opacity * splashAlpha * 0.5
      ctx.lineWidth = 1
      ctx.stroke()
      continue
    }

    // Draw rain line
    const endX = drop.x + Math.sin(windRad) * drop.length
    const endY = drop.y + Math.cos(windRad) * drop.length

    ctx.beginPath()
    ctx.moveTo(drop.x, drop.y)
    ctx.lineTo(endX, endY)
    ctx.strokeStyle = config.color
    ctx.globalAlpha = drop.opacity
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Glow effect
    if (config.glowEnabled && config.glowColor) {
      ctx.beginPath()
      ctx.moveTo(drop.x, drop.y)
      ctx.lineTo(endX, endY)
      ctx.strokeStyle = config.glowColor
      ctx.globalAlpha = drop.opacity * 0.3
      ctx.lineWidth = 4
      ctx.stroke()
    }
  }

  ctx.globalAlpha = 1
}
