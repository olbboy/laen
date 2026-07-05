import type { L } from '../game/constants'

/* ------------------------------------------------------------------ */
/* Challenge specs — five interactive engines, all data-driven         */
/* ------------------------------------------------------------------ */

export interface QuizOption {
  text: L
  correct?: boolean
  feedback: L
}
export interface MultiOption {
  text: L
  good: boolean
  feedback: L
}
export interface MatchPair {
  left: L
  right: L
}

export type ChallengeSpec =
  | { kind: 'quiz'; prompt: L; options: QuizOption[] }
  | { kind: 'multi'; prompt: L; options: MultiOption[] }
  | { kind: 'match'; prompt: L; pairs: MatchPair[] }
  | { kind: 'order'; prompt: L; items: L[] }
  | { kind: 'terminal'; prompt: L; placeholder: string; pattern: string; hint: L; success: L }

export interface Lesson {
  step: number
  icon: string
  from: L
  to: L
  title: L
  tagline: L
  hook: L
  body: L[]
  example?: { label: L; code: string }
  challenge: ChallengeSpec
  action: L
}

/* ------------------------------------------------------------------ */
/* Courses — a course is a themed 3D world plus a learning path.       */
/* Adding a new course = one file in src/content/courses/.             */
/* ------------------------------------------------------------------ */

export type Flavor = 'trees' | 'bushes' | 'shards' | 'sakura' | 'bamboo' | 'lantern' | 'reeds'

/** One atmosphere band: sky, terrain tint and decoration style. */
export interface ZoneSpec {
  skyTop: string
  skyBottom: string
  grass: string
  rock: string
  accent: string
  sun: string
  starAlpha: number
  flavor: Flavor
}

/** A named band of steps (drives ladder colors, chips, zone mapping). */
export interface CourseLevel {
  name: L
  color: string
  steps: number[]
  /** index into the course's zones array */
  zone: number
}

/** Spiral geometry of the island chain. */
export interface CourseLayout {
  spiralDeg: number
  radius: number
  rise: number
  islandRadius: number
  startRadius: number
}

export interface Course {
  id: string
  icon: string
  name: L
  tagline: L
  blurb: L
  minutes: number
  levels: CourseLevel[]
  zones: ZoneSpec[]
  layout: CourseLayout
  lessons: Lesson[]
}

/* ------------------------------------------------------------------ */
/* Global meta-progression                                             */
/* ------------------------------------------------------------------ */

export interface Rank {
  xp: number
  name: L
  icon: string
}

export const RANKS: Rank[] = [
  { xp: 0, name: { en: 'Explorer', vi: 'Người khám phá' }, icon: '🥾' },
  { xp: 400, name: { en: 'Pathfinder', vi: 'Người mở đường' }, icon: '🧭' },
  { xp: 1000, name: { en: 'Builder', vi: 'Người kiến tạo' }, icon: '🔨' },
  { xp: 2000, name: { en: 'Architect', vi: 'Kiến trúc sư' }, icon: '📐' },
  { xp: 3200, name: { en: 'Automator', vi: 'Bậc thầy tự động' }, icon: '🌅' },
]

export function rankForXp(xp: number): Rank {
  let r = RANKS[0]
  for (const rank of RANKS) if (xp >= rank.xp) r = rank
  return r
}

export const XP = {
  step: 100,
  perfectBonus: 40,
  spark: 10,
  courseComplete: 250,
}
