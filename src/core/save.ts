import type { Lang } from '../game/constants'

export interface SaveData {
  completed: number[]
  sparks: string[]
  lang: Lang
  sound: boolean
  quality: 'high' | 'low'
  seenIntro: boolean
}

const KEY = 'next-step-ascent-v1'

function defaults(): SaveData {
  const nav = typeof navigator !== 'undefined' ? navigator : undefined
  const vi = (nav?.languages ?? [nav?.language ?? '']).some((l) => (l ?? '').toLowerCase().startsWith('vi'))
  const weakDevice =
    (nav?.hardwareConcurrency ?? 8) <= 4 || /android|iphone|ipad|mobile/i.test(nav?.userAgent ?? '')
  return {
    completed: [],
    sparks: [],
    lang: vi ? 'vi' : 'en',
    sound: true,
    quality: weakDevice ? 'low' : 'high',
    seenIntro: false,
  }
}

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaults()
    const parsed = JSON.parse(raw) as Partial<SaveData>
    return { ...defaults(), ...parsed }
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
  } catch {
    /* ignore */
  }
}
