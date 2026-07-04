import * as THREE from 'three'

/** Number of learning steps (stations) on the ladder. */
export const STEP_COUNT = 11
/** Islands: index 0 is the start island, 1..11 hold stations. */
export const ISLAND_COUNT = STEP_COUNT + 1

export type Lang = 'en' | 'vi'
export interface L {
  en: string
  vi: string
}
export const tr = (l: L, lang: Lang): string => l[lang]

/* ------------------------------------------------------------------ */
/* Levels (the 4 colored bands of the ladder)                          */
/* ------------------------------------------------------------------ */

export interface LevelDef {
  name: L
  color: string
  steps: number[]
}

export const LEVELS: LevelDef[] = [
  { name: { en: 'Get Going', vi: 'Khởi động' }, color: '#3e8dcc', steps: [1, 2, 3] },
  { name: { en: 'Power Up', vi: 'Tăng lực' }, color: '#2fa98c', steps: [4, 5, 6] },
  { name: { en: 'Go Pro', vi: 'Chuyên nghiệp' }, color: '#e9a13b', steps: [7, 8] },
  { name: { en: 'Automate', vi: 'Tự động hoá' }, color: '#d95b3f', steps: [9, 10, 11] },
]

export function levelOfStep(step: number): number {
  if (step <= 3) return 0
  if (step <= 6) return 1
  if (step <= 8) return 2
  return 3
}

/* ------------------------------------------------------------------ */
/* Atmosphere zones — sky, fog and terrain tint shift as you ascend    */
/* ------------------------------------------------------------------ */

export interface Zone {
  skyTop: THREE.Color
  skyBottom: THREE.Color
  grass: THREE.Color
  rock: THREE.Color
  accent: THREE.Color
  sun: THREE.Color
  starAlpha: number
}

const z = (
  skyTop: number,
  skyBottom: number,
  grass: number,
  rock: number,
  accent: number,
  sun: number,
  starAlpha: number,
): Zone => ({
  skyTop: new THREE.Color(skyTop),
  skyBottom: new THREE.Color(skyBottom),
  grass: new THREE.Color(grass),
  rock: new THREE.Color(rock),
  accent: new THREE.Color(accent),
  sun: new THREE.Color(sun),
  starAlpha,
})

export const ZONES: Zone[] = [
  // 1 · Get Going — fresh morning blue
  z(0x6fb3e8, 0xf6ead6, 0x7ec578, 0x8d87a8, 0x3e8dcc, 0xfff3e0, 0.0),
  // 2 · Power Up — mint noon
  z(0x62c1a6, 0xf0eed6, 0x6bbd74, 0x7f8ba0, 0x2fa98c, 0xfff8e8, 0.0),
  // 3 · Go Pro — golden hour
  z(0xf0a95c, 0xfbe3c0, 0xc4b05e, 0x9a7f92, 0xe9a13b, 0xffe0b8, 0.25),
  // 4 · Automate — violet dusk
  z(0x4c3d6e, 0xef8f6a, 0x8a76a6, 0x6b5f88, 0xd95b3f, 0xffc9a0, 1.0),
]

/** Altitude (world y) at which each zone's look is fully in effect. */
export const ZONE_CENTERS = [10, 30, 45, 62]

/** Returns interpolated zone palette for a given altitude. */
export function zoneBlendAt(y: number): { a: Zone; b: Zone; t: number } {
  if (y <= ZONE_CENTERS[0]) return { a: ZONES[0], b: ZONES[0], t: 0 }
  for (let i = 0; i < ZONE_CENTERS.length - 1; i++) {
    if (y < ZONE_CENTERS[i + 1]) {
      const t = (y - ZONE_CENTERS[i]) / (ZONE_CENTERS[i + 1] - ZONE_CENTERS[i])
      return { a: ZONES[i], b: ZONES[i + 1], t: THREE.MathUtils.smoothstep(t, 0, 1) }
    }
  }
  return { a: ZONES[3], b: ZONES[3], t: 0 }
}

export function zoneOfStep(step: number): Zone {
  return ZONES[levelOfStep(step)]
}

/* ------------------------------------------------------------------ */
/* World layout — a rising spiral of floating islands                  */
/* ------------------------------------------------------------------ */

const SPIRAL_STEP = THREE.MathUtils.degToRad(62)
const SPIRAL_RADIUS = 30
const RISE_PER_ISLAND = 6

export function islandPosition(i: number): THREE.Vector3 {
  const a = i * SPIRAL_STEP
  return new THREE.Vector3(Math.cos(a) * SPIRAL_RADIUS, i * RISE_PER_ISLAND, Math.sin(a) * SPIRAL_RADIUS)
}

export function islandRadius(i: number): number {
  return i === 0 ? 10 : 8
}

/** Where the summit core floats (ignites on completing step 11). */
export const SUMMIT_POS = new THREE.Vector3(0, ISLAND_COUNT * RISE_PER_ISLAND + 16, 0)

/* Deterministic per-island randomness so the world is stable. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
