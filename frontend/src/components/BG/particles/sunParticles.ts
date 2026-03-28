// Sun particle system — radial rays from upper corner + floating dust motes

import type { ParticleConfig } from "../animatedBG"

export interface SunRay {
  angle: number // radians
  length: number
  width: number
  opacity: number
}

export interface DustMote {
  x: number
  y: number
  size: number
  opacity: number
  vx: number
  vy: number
  life: number
  maxLife: number
}

export interface SunParticleState {
  rays: SunRay[]
  motes: DustMote[]
  rotation: number
}

export function createSunState(
  config: ParticleConfig,
  width: number,
  height: number
): SunParticleState {
  const rayCount = Math.min(config.count, 12)
  const moteCount = Math.max(0, config.count * 3)

  const rays: SunRay[] = Array.from({ length: rayCount }, (_, i) => ({
    angle: (i / rayCount) * Math.PI * 2,
    length: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
    width: 2 + Math.random() * 4,
    opacity: config.opacity * (0.5 + Math.random() * 0.5),
  }))

  const motes: DustMote[] = Array.from({ length: moteCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: 1 + Math.random() * 2,
    opacity: config.opacity * (0.3 + Math.random() * 0.4),
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.2,
    life: Math.random() * 10,
    maxLife: 8 + Math.random() * 6,
  }))

  return { rays, motes, rotation: 0 }
}

export function updateSunState(
  state: SunParticleState,
  config: ParticleConfig,
  width: number,
  height: number,
  deltaTime: number
): void {
  // Slow rotation for rays
  state.rotation += deltaTime * config.speedRange[0] * 0.01

  // Update dust motes — gentle Brownian motion
  for (const mote of state.motes) {
    mote.x += mote.vx + (Math.random() - 0.5) * 0.5
    mote.y += mote.vy + (Math.random() - 0.5) * 0.3
    mote.life += deltaTime

    if (mote.life > mote.maxLife || mote.x < -10 || mote.x > width + 10 || mote.y < -10 || mote.y > height + 10) {
      mote.x = Math.random() * width
      mote.y = Math.random() * height
      mote.life = 0
    }
  }
}

export function drawSunState(
  ctx: CanvasRenderingContext2D,
  state: SunParticleState,
  config: ParticleConfig,
  width: number
): void {
  // Sun source point — upper right area
  const sunX = width * 0.8
  const sunY = -50

  ctx.save()
  ctx.translate(sunX, sunY)
  ctx.rotate(state.rotation)

  // Draw rays
  for (const ray of state.rays) {
    const x1 = Math.cos(ray.angle) * 50
    const y1 = Math.sin(ray.angle) * 50
    const x2 = Math.cos(ray.angle) * ray.length
    const y2 = Math.sin(ray.angle) * ray.length

    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.strokeStyle = config.color
    ctx.globalAlpha = ray.opacity
    ctx.lineWidth = ray.width
    ctx.lineCap = "round"
    ctx.stroke()

    // Glow
    if (config.glowEnabled && config.glowColor) {
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = config.glowColor
      ctx.globalAlpha = ray.opacity * 0.25
      ctx.lineWidth = ray.width * 3
      ctx.stroke()
    }
  }

  ctx.restore()

  // Draw dust motes
  for (const mote of state.motes) {
    const fadeIn = Math.min(1, mote.life / 2)
    const fadeOut = Math.min(1, (mote.maxLife - mote.life) / 2)
    const alpha = mote.opacity * fadeIn * fadeOut

    ctx.beginPath()
    ctx.arc(mote.x, mote.y, mote.size, 0, Math.PI * 2)
    ctx.fillStyle = config.color
    ctx.globalAlpha = alpha
    ctx.fill()
  }

  ctx.globalAlpha = 1
}
