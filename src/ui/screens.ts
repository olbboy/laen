import { LEVELS, levelOfStep, STEP_COUNT, tr, type Lang } from '../game/constants'
import { LESSONS } from '../content/lessons'
import { el, esc } from './dom'

export interface ScreensDeps {
  lang: () => Lang
  t: (key: string) => string
  isCompleted: (step: number) => boolean
  completedCount: () => number
  sparkCount: () => number
  sparkTotal: () => number
  soundOn: () => boolean
  quality: () => 'high' | 'low'
  setLang: (lang: Lang) => void
  setSound: (on: boolean) => void
  setQuality: (q: 'high' | 'low') => void
  resetProgress: () => void
  onOpenLesson: (step: number) => void
  sfx: { click: () => void; open: () => void; close: () => void }
}

/** Intro, journal, settings and summit-completion overlays. */
export class Screens {
  private current: HTMLElement | null = null

  constructor(
    private root: HTMLElement,
    private deps: ScreensDeps,
  ) {}

  get isOpen(): boolean {
    return this.current !== null
  }

  closeCurrent(silent = false): void {
    if (!this.current) return
    if (!silent) this.deps.sfx.close()
    const node = this.current
    node.classList.remove('visible')
    setTimeout(() => node.remove(), 300)
    this.current = null
  }

  private show(node: HTMLElement): void {
    this.closeCurrent(true)
    this.root.appendChild(node)
    requestAnimationFrame(() => node.classList.add('visible'))
    this.current = node
  }

  /* ---------------------------- intro ---------------------------- */

  showIntro(hasProgress: boolean, onStart: () => void): void {
    const { t, lang } = this.deps
    const overlay = el('div', 'overlay intro-overlay')
    const inner = el('div', 'intro-inner')

    // floating decorative blobs
    for (let i = 0; i < 4; i++) inner.appendChild(el('div', `intro-blob blob-${i}`))

    // language toggle
    const langRow = el('div', 'intro-lang')
    for (const l of ['en', 'vi'] as Lang[]) {
      const btn = el('button', 'lang-btn' + (lang() === l ? ' active' : ''), l.toUpperCase())
      btn.addEventListener('click', () => {
        this.deps.sfx.click()
        this.deps.setLang(l)
        this.showIntro(hasProgress, onStart)
      })
      langRow.appendChild(btn)
    }
    inner.appendChild(langRow)

    const robot = el('div', 'intro-robot')
    robot.innerHTML = `<svg viewBox="0 0 64 64" width="88" height="88" aria-hidden="true">
      <rect x="8" y="14" width="48" height="36" rx="9" fill="#e8674a"/>
      <rect x="2" y="24" width="9" height="14" rx="3" fill="#e8674a"/>
      <rect x="53" y="24" width="9" height="14" rx="3" fill="#e8674a"/>
      <rect x="16" y="24" width="32" height="17" rx="6" fill="#27222e"/>
      <rect x="21" y="28" width="8" height="10" rx="3.5" fill="#bff3ff"/>
      <rect x="35" y="28" width="8" height="10" rx="3.5" fill="#bff3ff"/>
      <rect x="24" y="52" width="7" height="6" rx="2" fill="#27222e"/>
      <rect x="33" y="52" width="7" height="6" rx="2" fill="#27222e"/>
      <line x1="32" y1="14" x2="32" y2="7" stroke="#27222e" stroke-width="2.4"/>
      <circle cx="32" cy="5.4" r="3" fill="#ffc93c"/>
    </svg>`
    inner.appendChild(robot)

    inner.appendChild(el('h1', 'intro-title', 'NEXT<span>STEP</span>'))
    inner.appendChild(el('p', 'intro-sub', esc(t('subtitle'))))

    // the four levels as pills
    const pills = el('div', 'intro-pills')
    LEVELS.forEach((lv, i) => {
      pills.appendChild(
        el('span', 'intro-pill', `<i style="background:${lv.color}"></i>${i + 1} · ${esc(tr(lv.name, lang()))}`),
      )
    })
    inner.appendChild(pills)

    // progress note when returning
    if (hasProgress) {
      const done = this.deps.completedCount()
      inner.appendChild(el('p', 'intro-progress', `${esc(t('welcomeBack'))} — ${done}/${STEP_COUNT}`))
    }

    const start = el('button', 'btn btn-primary btn-big', esc(hasProgress ? t('continue') : t('begin')))
    start.addEventListener('click', () => {
      this.deps.sfx.click()
      this.closeCurrent(true)
      onStart()
    })
    inner.appendChild(start)

    const hints = el('div', 'intro-hints')
    hints.innerHTML = `
      <span><span class="kbd">W</span><span class="kbd">A</span><span class="kbd">S</span><span class="kbd">D</span> ${esc(t('introHintMove'))}</span>
      <span>🖱 ${esc(t('introHintLook'))}</span>
      <span><span class="kbd">Space</span> ${esc(t('introHintJump'))}</span>
      <span><span class="kbd">E</span> ${esc(t('introHintInteract'))}</span>`
    inner.appendChild(hints)

    inner.appendChild(el('p', 'intro-credit', esc(t('inspiredBy'))))
    overlay.appendChild(inner)
    this.show(overlay)
  }

  /* --------------------------- journal --------------------------- */

  showJournal(): void {
    const { t, lang } = this.deps
    const overlay = el('div', 'overlay panel-overlay')
    const card = el('div', 'card panel-card')
    card.appendChild(this.panelHeader(t('journal'), overlay))

    const list = el('div', 'journal-list')
    let any = false
    for (const lesson of LESSONS) {
      const done = this.deps.isCompleted(lesson.step)
      const level = LEVELS[levelOfStep(lesson.step)]
      const row = el('button', 'journal-row' + (done ? ' done' : ' locked'))
      row.style.setProperty('--accent', level.color)
      row.appendChild(el('span', 'journal-num', done ? '✓' : String(lesson.step).padStart(2, '0')))
      const info = el('span', 'journal-info')
      info.appendChild(el('span', 'journal-title', esc(done ? tr(lesson.title, lang()) : '· · ·')))
      if (done) {
        info.appendChild(el('span', 'journal-action', '⚡ ' + esc(tr(lesson.action, lang()))))
        any = true
      }
      row.appendChild(info)
      if (done) {
        row.addEventListener('click', () => {
          this.deps.sfx.click()
          this.closeCurrent(true)
          this.deps.onOpenLesson(lesson.step)
        })
      }
      list.appendChild(row)
    }
    if (!any) list.prepend(el('p', 'journal-empty', esc(t('journalEmpty'))))
    card.appendChild(list)
    overlay.appendChild(card)
    this.wireDismiss(overlay)
    this.show(overlay)
    this.deps.sfx.open()
  }

  /* --------------------------- settings -------------------------- */

  showSettings(): void {
    const { t } = this.deps
    const overlay = el('div', 'overlay panel-overlay')
    const card = el('div', 'card panel-card settings-card')
    card.appendChild(this.panelHeader(t('settings'), overlay))

    const mkRow = (label: string, options: Array<{ label: string; active: boolean; onPick: () => void }>) => {
      const row = el('div', 'settings-row')
      row.appendChild(el('span', 'settings-label', esc(label)))
      const group = el('div', 'settings-group')
      for (const opt of options) {
        const btn = el('button', 'settings-opt' + (opt.active ? ' active' : ''), esc(opt.label))
        btn.addEventListener('click', () => {
          this.deps.sfx.click()
          opt.onPick()
          this.showSettings()
        })
        group.appendChild(btn)
      }
      row.appendChild(group)
      return row
    }

    card.appendChild(
      mkRow(t('language'), [
        { label: 'English', active: this.deps.lang() === 'en', onPick: () => this.deps.setLang('en') },
        { label: 'Tiếng Việt', active: this.deps.lang() === 'vi', onPick: () => this.deps.setLang('vi') },
      ]),
    )
    card.appendChild(
      mkRow(t('sound'), [
        { label: t('soundOn'), active: this.deps.soundOn(), onPick: () => this.deps.setSound(true) },
        { label: t('soundOff'), active: !this.deps.soundOn(), onPick: () => this.deps.setSound(false) },
      ]),
    )
    card.appendChild(
      mkRow(t('quality'), [
        { label: t('qualityHigh'), active: this.deps.quality() === 'high', onPick: () => this.deps.setQuality('high') },
        { label: t('qualityLow'), active: this.deps.quality() === 'low', onPick: () => this.deps.setQuality('low') },
      ]),
    )

    const reset = el('button', 'btn btn-danger', esc(t('resetProgress')))
    reset.addEventListener('click', () => {
      if (confirm(t('resetConfirm'))) {
        this.deps.resetProgress()
        this.closeCurrent()
      }
    })
    card.appendChild(reset)

    overlay.appendChild(card)
    this.wireDismiss(overlay)
    this.show(overlay)
    this.deps.sfx.open()
  }

  /* -------------------------- completion ------------------------- */

  showCompletion(onKeepExploring: () => void): void {
    const { t, lang } = this.deps
    const overlay = el('div', 'overlay completion-overlay')
    const card = el('div', 'card completion-card')

    card.appendChild(el('div', 'completion-star', '★'))
    card.appendChild(el('h2', 'completion-title', esc(t('summitTitle'))))
    card.appendChild(
      el(
        'p',
        'completion-stats',
        `${STEP_COUNT}/${STEP_COUNT} · ✦ ${this.deps.sparkCount()}/${this.deps.sparkTotal()} ${esc(t('sparks'))}`,
      ),
    )
    card.appendChild(el('p', 'completion-sub', esc(t('summitSub'))))

    const grid = el('div', 'completion-grid')
    for (const lesson of LESSONS) {
      const level = LEVELS[levelOfStep(lesson.step)]
      const item = el('div', 'completion-item')
      item.style.setProperty('--accent', level.color)
      item.appendChild(el('span', 'completion-item-icon', lesson.icon))
      item.appendChild(el('span', 'completion-item-text', esc(tr(lesson.title, lang()))))
      grid.appendChild(item)
    }
    card.appendChild(grid)

    const row = el('div', 'completion-actions')
    const explore = el('button', 'btn btn-primary', esc(t('keepExploring')))
    explore.addEventListener('click', () => {
      this.deps.sfx.click()
      this.closeCurrent(true)
      onKeepExploring()
    })
    const journal = el('button', 'btn', esc(t('reviewJournal')))
    journal.addEventListener('click', () => {
      this.deps.sfx.click()
      this.showJournal()
    })
    row.appendChild(explore)
    row.appendChild(journal)
    card.appendChild(row)

    overlay.appendChild(card)
    this.show(overlay)
  }

  /* --------------------------- helpers ---------------------------- */

  private panelHeader(title: string, overlay: HTMLElement): HTMLElement {
    const header = el('header', 'panel-header')
    header.appendChild(el('h2', 'panel-title', esc(title)))
    const close = el('button', 'icon-btn', '✕')
    close.addEventListener('click', () => this.closeCurrent())
    header.appendChild(close)
    overlay.addEventListener('pointerdown', (e) => {
      if (e.target === overlay) this.closeCurrent()
    })
    return header
  }

  private wireDismiss(overlay: HTMLElement): void {
    const esc_ = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.closeCurrent()
        window.removeEventListener('keydown', esc_)
      }
    }
    window.addEventListener('keydown', esc_)
  }
}
