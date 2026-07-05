/** Language + shared primitives. World layout lives in game/runtime.ts. */

export type Lang = 'en' | 'vi'
export interface L {
  en: string
  vi: string
}
export const tr = (l: L, lang: Lang): string => l[lang]

/** Deterministic PRNG so every world looks identical across sessions. */
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
