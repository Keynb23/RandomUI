// Lightning flash effect — overlay flash with optional screen rumble

import gsap from "gsap"
import type { LightningConfig } from "../animatedBG"

export function startLightning(
  flashEl: HTMLDivElement,
  containerEl: HTMLDivElement,
  config: LightningConfig
): gsap.core.Timeline | null {
  if (!config.enabled) return null

  const tl = gsap.timeline({ repeat: -1 })

  function addFlash() {
    const interval = config.intervalRange[0] + Math.random() * (config.intervalRange[1] - config.intervalRange[0])

    tl.to(flashEl, {
      opacity: config.flashOpacity,
      duration: config.flashDuration * 0.3,
      ease: "power4.in",
    })
    .to(flashEl, {
      opacity: 0,
      duration: config.flashDuration * 0.2,
      ease: "power4.out",
    })
    // Double flash
    .to(flashEl, {
      opacity: config.flashOpacity * 0.6,
      duration: config.flashDuration * 0.2,
      ease: "power4.in",
      delay: 0.05,
    })
    .to(flashEl, {
      opacity: 0,
      duration: config.flashDuration * 0.3,
      ease: "power4.out",
    })

    // Screen rumble
    if (config.rumbleEnabled) {
      tl.to(containerEl, {
        x: 2,
        y: 1,
        duration: 0.05,
        ease: "none",
      }, "<")
      .to(containerEl, {
        x: -1,
        y: -1,
        duration: 0.05,
        ease: "none",
      })
      .to(containerEl, {
        x: 0,
        y: 0,
        duration: 0.1,
        ease: "power2.out",
      })
    }

    // Pause between flashes
    tl.to({}, { duration: interval })

    // Queue next flash
    tl.call(addFlash)
  }

  // Initial delay before first flash
  tl.to({}, { duration: 1 + Math.random() * 3 })
  tl.call(addFlash)

  return tl
}
