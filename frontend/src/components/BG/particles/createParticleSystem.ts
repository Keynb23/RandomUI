// Particle system factory — creates the correct system based on config type

import type { ParticleConfig } from "../animatedBG"
import { createRainDrops, updateRainDrops, drawRainDrops, type RainDrop } from "./rainParticles"
import { createSnowFlakes, updateSnowFlakes, drawSnowFlakes, type SnowFlake } from "./snowParticles"
import { createSunState, updateSunState, drawSunState, type SunParticleState } from "./sunParticles"

export interface ParticleSystem {
  update: (deltaTime: number, elapsed: number) => void
  draw: (ctx: CanvasRenderingContext2D) => void
  resize: (width: number, height: number) => void
}

export function createParticleSystem(
  config: ParticleConfig,
  width: number,
  height: number
): ParticleSystem | null {
  if (config.type === "none" || config.count === 0) return null

  let w = width
  let h = height

  if (config.type === "rain") {
    let drops: RainDrop[] = createRainDrops(config, w, h)

    return {
      update: (dt) => updateRainDrops(drops, config, w, h, dt),
      draw: (ctx) => drawRainDrops(ctx, drops, config),
      resize: (nw, nh) => {
        w = nw
        h = nh
        drops = createRainDrops(config, w, h)
      },
    }
  }

  if (config.type === "snow") {
    let flakes: SnowFlake[] = createSnowFlakes(config, w, h)

    return {
      update: (dt, elapsed) => updateSnowFlakes(flakes, config, w, h, dt, elapsed),
      draw: (ctx) => drawSnowFlakes(ctx, flakes, config),
      resize: (nw, nh) => {
        w = nw
        h = nh
        flakes = createSnowFlakes(config, w, h)
      },
    }
  }

  if (config.type === "sunray" || config.type === "dust") {
    let state: SunParticleState = createSunState(config, w, h)

    return {
      update: (dt) => updateSunState(state, config, w, h, dt),
      draw: (ctx) => drawSunState(ctx, state, config, w),
      resize: (nw, nh) => {
        w = nw
        h = nh
        state = createSunState(config, w, h)
      },
    }
  }

  return null
}
