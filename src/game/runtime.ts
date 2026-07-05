import * as THREE from 'three'
import type { Course, Flavor } from '../content/types'

/** Materialized zone palette (THREE colors, ready for the renderer). */
export interface Zone {
  skyTop: THREE.Color
  skyBottom: THREE.Color
  grass: THREE.Color
  rock: THREE.Color
  accent: THREE.Color
  sun: THREE.Color
  starAlpha: number
  flavor: Flavor
}

/**
 * Everything derived from a course definition: island layout, zone
 * palettes, altitude blending. One instance per loaded world.
 */
export class CourseRuntime {
  readonly zones: Zone[]
  readonly zoneCenters: number[]

  constructor(readonly course: Course) {
    this.zones = course.zones.map((z) => ({
      skyTop: new THREE.Color(z.skyTop),
      skyBottom: new THREE.Color(z.skyBottom),
      grass: new THREE.Color(z.grass),
      rock: new THREE.Color(z.rock),
      accent: new THREE.Color(z.accent),
      sun: new THREE.Color(z.sun),
      starAlpha: z.starAlpha,
      flavor: z.flavor,
    }))

    // altitude at which each zone is fully in effect = mean island height
    // of the steps mapped to it
    this.zoneCenters = this.zones.map((_, zi) => {
      const steps: number[] = []
      for (const level of course.levels) if (level.zone === zi) steps.push(...level.steps)
      if (steps.length === 0) return zi * 20
      const mean = steps.reduce((a, b) => a + b, 0) / steps.length
      return mean * course.layout.rise
    })
  }

  get stepCount(): number {
    return this.course.lessons.length
  }

  get islandCount(): number {
    return this.stepCount + 1
  }

  islandPosition(i: number): THREE.Vector3 {
    const a = i * THREE.MathUtils.degToRad(this.course.layout.spiralDeg)
    const r = this.course.layout.radius
    return new THREE.Vector3(Math.cos(a) * r, i * this.course.layout.rise, Math.sin(a) * r)
  }

  islandRadius(i: number): number {
    return i === 0 ? this.course.layout.startRadius : this.course.layout.islandRadius
  }

  get summitPos(): THREE.Vector3 {
    return new THREE.Vector3(0, this.islandCount * this.course.layout.rise + 16, 0)
  }

  /** Index into course.levels for a step (1-based). */
  levelOfStep(step: number): number {
    const s = Math.min(Math.max(step, 1), this.stepCount)
    for (let i = 0; i < this.course.levels.length; i++) {
      if (this.course.levels[i].steps.includes(s)) return i
    }
    return this.course.levels.length - 1
  }

  levelColorOfStep(step: number): string {
    return this.course.levels[this.levelOfStep(step)].color
  }

  zoneIndexOfStep(step: number): number {
    return this.course.levels[this.levelOfStep(step)].zone
  }

  zoneOfStep(step: number): Zone {
    return this.zones[this.zoneIndexOfStep(step)]
  }

  /** Island 0 (start) borrows the first step's zone. */
  zoneOfIsland(i: number): Zone {
    return this.zoneOfStep(i === 0 ? 1 : i)
  }

  /** Interpolated palette for a given altitude. */
  zoneBlendAt(y: number): { a: Zone; b: Zone; t: number } {
    const c = this.zoneCenters
    if (this.zones.length === 1 || y <= c[0]) return { a: this.zones[0], b: this.zones[0], t: 0 }
    for (let i = 0; i < c.length - 1; i++) {
      if (y < c[i + 1]) {
        const t = (y - c[i]) / (c[i + 1] - c[i])
        return { a: this.zones[i], b: this.zones[i + 1], t: THREE.MathUtils.smoothstep(t, 0, 1) }
      }
    }
    const last = this.zones[this.zones.length - 1]
    return { a: last, b: last, t: 0 }
  }

  /** Nearest zone index for a given altitude (drives the music). */
  zoneIndexAt(y: number): number {
    let best = 0
    for (let i = 0; i < this.zoneCenters.length; i++) {
      if (Math.abs(y - this.zoneCenters[i]) < Math.abs(y - this.zoneCenters[best])) best = i
    }
    return best
  }

  lessonOf(step: number) {
    const l = this.course.lessons.find((x) => x.step === step)
    if (!l) throw new Error(`no lesson for step ${step} in ${this.course.id}`)
    return l
  }
}
