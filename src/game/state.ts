import type { Lang } from './constants'
import type { Course } from '../content/types'
import { rankForXp, XP, type Rank } from '../content/types'
import { loadSave, writeSave, clearSave, type CourseProgress, type SaveData } from '../core/save'

type Events = {
  'step-completed': (step: number, perfect: boolean) => void
  'course-completed': () => void
  'spark-collected': (id: string, total: number) => void
  'xp-changed': (xp: number, gained: number, rankUp: Rank | null) => void
  'lang-changed': (lang: Lang) => void
  'sound-changed': (on: boolean) => void
  'quality-changed': (q: 'high' | 'low') => void
  reset: () => void
}

export class GameState {
  save: SaveData = loadSave()
  private listeners = new Map<keyof Events, Set<(...args: never[]) => void>>()

  constructor(readonly course: Course) {
    this.save.activeCourse = course.id
    if (!this.save.courses[course.id]) {
      this.save.courses[course.id] = { completed: [], sparks: [] }
    }
    writeSave(this.save)
  }

  on<K extends keyof Events>(event: K, cb: Events[K]): void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set())
    this.listeners.get(event)!.add(cb as (...args: never[]) => void)
  }

  private emit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>): void {
    this.listeners.get(event)?.forEach((cb) => (cb as (...a: unknown[]) => void)(...args))
  }

  get lang(): Lang {
    return this.save.lang
  }

  get progress(): CourseProgress {
    return this.save.courses[this.course.id]
  }

  progressOf(courseId: string): CourseProgress {
    return this.save.courses[courseId] ?? { completed: [], sparks: [] }
  }

  get stepCount(): number {
    return this.course.lessons.length
  }

  /** First uncompleted step (1..n), or n+1 when everything is done. */
  get nextStep(): number {
    for (let s = 1; s <= this.stepCount; s++) if (!this.progress.completed.includes(s)) return s
    return this.stepCount + 1
  }

  get allDone(): boolean {
    return this.progress.completed.length >= this.stepCount
  }

  isCompleted(step: number): boolean {
    return this.progress.completed.includes(step)
  }

  isUnlocked(step: number): boolean {
    return step <= this.nextStep
  }

  get rank(): Rank {
    return rankForXp(this.save.xp)
  }

  private addXp(amount: number): void {
    const before = this.rank
    this.save.xp += amount
    const after = this.rank
    writeSave(this.save)
    this.emit('xp-changed', this.save.xp, amount, after !== before ? after : null)
  }

  completeStep(step: number, perfect: boolean): void {
    if (this.isCompleted(step)) return
    this.progress.completed.push(step)
    this.save.seenIntro = true
    writeSave(this.save)
    let gained = XP.step + (perfect ? XP.perfectBonus : 0)
    const finished = this.allDone
    if (finished) gained += XP.courseComplete
    this.addXp(gained)
    this.emit('step-completed', step, perfect)
    if (finished) this.emit('course-completed')
  }

  hasSpark(id: string): boolean {
    return this.progress.sparks.includes(id)
  }

  collectSpark(id: string): void {
    if (this.hasSpark(id)) return
    this.progress.sparks.push(id)
    writeSave(this.save)
    this.addXp(XP.spark)
    this.emit('spark-collected', id, this.progress.sparks.length)
  }

  setLang(lang: Lang): void {
    if (this.save.lang === lang) return
    this.save.lang = lang
    writeSave(this.save)
    this.emit('lang-changed', lang)
  }

  setSound(on: boolean): void {
    this.save.sound = on
    writeSave(this.save)
    this.emit('sound-changed', on)
  }

  setQuality(q: 'high' | 'low'): void {
    if (this.save.quality === q) return
    this.save.quality = q
    writeSave(this.save)
    this.emit('quality-changed', q)
  }

  setPlayerName(name: string): void {
    this.save.playerName = name.slice(0, 40)
    writeSave(this.save)
  }

  markIntroSeen(): void {
    this.save.seenIntro = true
    writeSave(this.save)
  }

  resetProgress(): void {
    clearSave()
    this.emit('reset')
  }
}
