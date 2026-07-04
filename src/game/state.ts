import { STEP_COUNT, type Lang } from './constants'
import { loadSave, writeSave, clearSave, type SaveData } from '../core/save'

type Events = {
  'step-completed': (step: number) => void
  'spark-collected': (id: string, total: number) => void
  'lang-changed': (lang: Lang) => void
  'sound-changed': (on: boolean) => void
  'quality-changed': (q: 'high' | 'low') => void
  reset: () => void
}

export class GameState {
  save: SaveData = loadSave()
  private listeners = new Map<keyof Events, Set<(...args: never[]) => void>>()

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

  /** First uncompleted step (1..11), or STEP_COUNT+1 when everything is done. */
  get nextStep(): number {
    for (let s = 1; s <= STEP_COUNT; s++) if (!this.save.completed.includes(s)) return s
    return STEP_COUNT + 1
  }

  get allDone(): boolean {
    return this.save.completed.length >= STEP_COUNT
  }

  isCompleted(step: number): boolean {
    return this.save.completed.includes(step)
  }

  /** A station is reachable/openable if every earlier step is complete. */
  isUnlocked(step: number): boolean {
    return step <= this.nextStep
  }

  completeStep(step: number): void {
    if (this.isCompleted(step)) return
    this.save.completed.push(step)
    this.save.seenIntro = true
    writeSave(this.save)
    this.emit('step-completed', step)
  }

  hasSpark(id: string): boolean {
    return this.save.sparks.includes(id)
  }

  collectSpark(id: string): void {
    if (this.hasSpark(id)) return
    this.save.sparks.push(id)
    writeSave(this.save)
    this.emit('spark-collected', id, this.save.sparks.length)
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

  markIntroSeen(): void {
    this.save.seenIntro = true
    writeSave(this.save)
  }

  resetProgress(): void {
    clearSave()
    this.save = loadSave()
    this.emit('reset')
  }
}
