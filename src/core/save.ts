import type { Lang } from '../game/constants'

export interface CourseProgress {
  completed: number[]
  sparks: string[]
}

export interface SaveData {
  version: 2
  lang: Lang
  sound: boolean
  quality: 'high' | 'low'
  seenIntro: boolean
  activeCourse: string
  playerName: string
  xp: number
  courses: Record<string, CourseProgress>
}

const KEY = 'next-step-ascent-v2'
const LEGACY_KEY = 'next-step-ascent-v1'

function defaults(): SaveData {
  const nav = typeof navigator !== 'undefined' ? navigator : undefined
  const vi = (nav?.languages ?? [nav?.language ?? '']).some((l) => (l ?? '').toLowerCase().startsWith('vi'))
  const weakDevice =
    (nav?.hardwareConcurrency ?? 8) <= 4 || /android|iphone|ipad|mobile/i.test(nav?.userAgent ?? '')
  return {
    version: 2,
    lang: vi ? 'vi' : 'en',
    sound: true,
    quality: weakDevice ? 'low' : 'high',
    seenIntro: false,
    activeCourse: 'ai-ladder',
    playerName: '',
    xp: 0,
    courses: {},
  }
}

/** Pulls v1 (single-course) progress into the v2 shape, once. */
function migrateLegacy(base: SaveData): SaveData {
  try {
    const raw = localStorage.getItem(LEGACY_KEY)
    if (!raw) return base
    const v1 = JSON.parse(raw) as {
      completed?: number[]
      sparks?: string[]
      lang?: Lang
      sound?: boolean
      quality?: 'high' | 'low'
      seenIntro?: boolean
    }
    const migrated: SaveData = {
      ...base,
      lang: v1.lang ?? base.lang,
      sound: v1.sound ?? base.sound,
      quality: v1.quality ?? base.quality,
      seenIntro: v1.seenIntro ?? base.seenIntro,
      courses: {
        ...base.courses,
        'ai-ladder': {
          completed: v1.completed ?? [],
          sparks: v1.sparks ?? [],
        },
      },
      // grant XP for progress earned before the meta-progression existed
      xp: (v1.completed?.length ?? 0) * 100 + (v1.sparks?.length ?? 0) * 10,
    }
    localStorage.removeItem(LEGACY_KEY)
    return migrated
  } catch {
    return base
  }
}

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      const migrated = migrateLegacy(defaults())
      writeSave(migrated)
      return migrated
    }
    const parsed = JSON.parse(raw) as Partial<SaveData>
    return { ...defaults(), ...parsed, courses: parsed.courses ?? {} }
  } catch {
    return defaults()
  }
}

export function writeSave(data: SaveData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    /* private mode etc. — play without persistence */
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(KEY)
    localStorage.removeItem(LEGACY_KEY)
  } catch {
    /* ignore */
  }
}
