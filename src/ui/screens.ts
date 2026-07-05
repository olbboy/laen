import { tr, type Lang } from '../game/constants'
import type { Course, Rank } from '../content/types'
import { COURSES } from '../content/courses'
import type { CourseRuntime } from '../game/runtime'
import { drawCertificate } from './certificate'
import { el, esc } from './dom'

export interface ScreensDeps {
  lang: () => Lang
  t: (key: string) => string
  isCompleted: (step: number) => boolean
  completedCount: () => number
  courseProgress: (courseId: string) => { completed: number; total: number }
  sparkCount: () => number
  sparkTotal: () => number
  xp: () => number
  rank: () => Rank
  playerName: () => string
  setPlayerName: (name: string) => void
  soundOn: () => boolean
  quality: () => 'high' | 'low'
  setLang: (lang: Lang) => void
  setSound: (on: boolean) => void
  setQuality: (q: 'high' | 'low') => void
  resetProgress: () => void
  onOpenLesson: (step: number) => void
  onEnterCourse: (courseId: string) => void
  sfx: { click: () => void; open: () => void; close: () => void }
  toast: (msg: string) => void
}

/** Intro, worlds hub, journal, settings and summit-completion overlays. */
export class Screens {
  private current: HTMLElement | null = null

  constructor(
    private root: HTMLElement,
    private rt: CourseRuntime,
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
    const course = this.rt.course
    const overlay = el('div', 'overlay intro-overlay')
    const inner = el('div', 'intro-inner')

    for (let i = 0; i < 4; i++) inner.appendChild(el('div', `intro-blob blob-${i}`))

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

    // current world card-line
    inner.appendChild(
      el(
        'p',
        'intro-course',
        `${course.icon} <b>${esc(tr(course.name, lang()))}</b> · ${course.lessons.length} ${esc(t('stepsWord'))} · ~${course.minutes} ${esc(t('minutesWord'))}`,
      ),
    )

    if (hasProgress) {
      const done = this.deps.completedCount()
      inner.appendChild(el('p', 'intro-progress', `${esc(t('welcomeBack'))} — ${done}/${this.rt.stepCount}`))
    }

    const btnRow = el('div', 'intro-actions')
    const start = el('button', 'btn btn-primary btn-big', esc(hasProgress ? t('continue') : t('begin')))
    start.addEventListener('click', () => {
      this.deps.sfx.click()
      this.closeCurrent(true)
      onStart()
    })
    btnRow.appendChild(start)
    const worlds = el('button', 'btn btn-big', `🌍 ${esc(t('chooseWorldBtn'))}`)
    worlds.addEventListener('click', () => {
      this.deps.sfx.click()
      this.showWorlds(() => this.showIntro(hasProgress, onStart))
    })
    btnRow.appendChild(worlds)
    inner.appendChild(btnRow)

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

  /* -------------------------- worlds hub -------------------------- */

  showWorlds(onDismiss?: () => void): void {
    const { t, lang } = this.deps
    const L = lang()
    const overlay = el('div', 'overlay panel-overlay worlds-overlay')
    const card = el('div', 'card panel-card worlds-card')

    const header = el('header', 'panel-header worlds-header')
    const titleWrap = el('div', 'worlds-title-wrap')
    titleWrap.appendChild(el('h2', 'panel-title', esc(t('chooseWorld'))))
    const rank = this.deps.rank()
    titleWrap.appendChild(
      el('div', 'worlds-rank', `${rank.icon} <b>${esc(tr(rank.name, L))}</b> · ⚡ ${this.deps.xp()} XP`),
    )
    header.appendChild(titleWrap)
    const close = el('button', 'icon-btn', '✕')
    close.addEventListener('click', () => {
      this.closeCurrent()
      onDismiss?.()
    })
    header.appendChild(close)
    card.appendChild(header)

    const grid = el('div', 'worlds-grid')
    for (const course of COURSES) {
      grid.appendChild(this.worldCard(course, L))
    }
    card.appendChild(grid)
    card.appendChild(el('p', 'worlds-footer', esc(t('moreWorlds'))))

    overlay.appendChild(card)
    overlay.addEventListener('pointerdown', (e) => {
      if (e.target === overlay) {
        this.closeCurrent()
        onDismiss?.()
      }
    })
    this.show(overlay)
    this.deps.sfx.open()
  }

  private worldCard(course: Course, L: Lang): HTMLElement {
    const { t } = this.deps
    const prog = this.deps.courseProgress(course.id)
    const isActive = course.id === this.rt.course.id
    const complete = prog.completed >= prog.total

    const cardEl = el('div', 'world-card' + (isActive ? ' active' : ''))
    cardEl.style.setProperty('--accent', course.zones[0].accent)

    // themed sky banner
    const banner = el('div', 'world-banner')
    const zs = course.zones
    banner.style.background = `linear-gradient(160deg, ${zs[zs.length - 1].skyTop} 0%, ${zs[0].skyTop} 55%, ${zs[0].skyBottom} 100%)`
    banner.appendChild(el('span', 'world-icon', course.icon))
    // mini island silhouettes
    for (let i = 0; i < 3; i++) banner.appendChild(el('i', `world-isle isle-${i}`))
    cardEl.appendChild(banner)

    const info = el('div', 'world-info')
    info.appendChild(el('h3', 'world-name', esc(tr(course.name, L))))
    info.appendChild(el('p', 'world-tagline', esc(tr(course.tagline, L))))
    info.appendChild(
      el('p', 'world-meta', `${course.lessons.length} ${esc(t('stepsWord'))} · ~${course.minutes} ${esc(t('minutesWord'))}`),
    )

    const bar = el('div', 'world-progress')
    const fill = el('div', 'world-progress-fill')
    fill.style.width = `${(prog.completed / prog.total) * 100}%`
    bar.appendChild(fill)
    info.appendChild(bar)
    info.appendChild(
      el(
        'p',
        'world-progress-label',
        complete ? `★ ${esc(t('worldComplete'))}` : `${prog.completed}/${prog.total}`,
      ),
    )

    const enter = el(
      'button',
      'btn btn-primary world-enter',
      esc(complete ? t('replayWorld') : prog.completed > 0 ? t('continueWorld') : t('enterWorld')),
    )
    enter.addEventListener('click', () => {
      this.deps.sfx.click()
      this.deps.onEnterCourse(course.id)
    })
    info.appendChild(enter)
    cardEl.appendChild(info)
    return cardEl
  }

  /* --------------------------- journal --------------------------- */

  showJournal(): void {
    const { t, lang } = this.deps
    const overlay = el('div', 'overlay panel-overlay')
    const card = el('div', 'card panel-card')
    card.appendChild(this.panelHeader(t('journal'), overlay))

    const list = el('div', 'journal-list')
    let any = false
    for (const lesson of this.rt.course.lessons) {
      const done = this.deps.isCompleted(lesson.step)
      const row = el('button', 'journal-row' + (done ? ' done' : ' locked'))
      row.style.setProperty('--accent', this.rt.levelColorOfStep(lesson.step))
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
    const course = this.rt.course
    const overlay = el('div', 'overlay completion-overlay')

    // celebratory confetti
    const confetti = el('div', 'confetti')
    const colors = course.levels.map((l) => l.color).concat('#f0b429')
    for (let i = 0; i < 36; i++) {
      const piece = el('i', 'confetti-piece')
      piece.style.left = `${Math.random() * 100}%`
      piece.style.background = colors[i % colors.length]
      piece.style.animationDelay = `${Math.random() * 2.4}s`
      piece.style.animationDuration = `${2.6 + Math.random() * 2}s`
      confetti.appendChild(piece)
    }
    overlay.appendChild(confetti)

    const card = el('div', 'card completion-card')
    card.appendChild(el('div', 'completion-star', '★'))
    card.appendChild(el('h2', 'completion-title', esc(t('summitTitle'))))
    const rank = this.deps.rank()
    card.appendChild(
      el(
        'p',
        'completion-stats',
        `${course.icon} ${esc(tr(course.name, lang()))} · ✦ ${this.deps.sparkCount()}/${this.deps.sparkTotal()} · ${rank.icon} ${esc(tr(rank.name, lang()))} · ⚡ ${this.deps.xp()} XP`,
      ),
    )
    card.appendChild(el('p', 'completion-sub', esc(t('summitSub'))))

    const grid = el('div', 'completion-grid')
    for (const lesson of course.lessons) {
      const item = el('div', 'completion-item')
      item.style.setProperty('--accent', this.rt.levelColorOfStep(lesson.step))
      item.appendChild(el('span', 'completion-item-icon', lesson.icon))
      item.appendChild(el('span', 'completion-item-text', esc(tr(lesson.title, lang()))))
      grid.appendChild(item)
    }
    card.appendChild(grid)

    /* certificate block */
    const certBlock = el('div', 'cert-block')
    const nameRow = el('div', 'cert-name-row')
    nameRow.appendChild(el('label', 'cert-name-label', esc(t('yourName'))))
    const nameInput = document.createElement('input')
    nameInput.className = 'cert-name-input'
    nameInput.type = 'text'
    nameInput.maxLength = 40
    nameInput.placeholder = t('namePlaceholder')
    nameInput.value = this.deps.playerName()
    nameInput.addEventListener('keydown', (e) => e.stopPropagation())
    nameRow.appendChild(nameInput)
    certBlock.appendChild(nameRow)

    const certActions = el('div', 'completion-actions')
    const download = el('button', 'btn btn-primary', '📜 ' + esc(t('downloadCert')))
    download.addEventListener('click', () => {
      this.deps.sfx.click()
      this.deps.setPlayerName(nameInput.value)
      const canvas = drawCertificate(course, lang(), {
        playerName: nameInput.value,
        sparks: this.deps.sparkCount(),
        sparkTotal: this.deps.sparkTotal(),
        xp: this.deps.xp(),
        rank: this.deps.rank(),
        date: new Date(),
      }, t)
      const a = document.createElement('a')
      a.download = `next-step-${course.id}-certificate.png`
      a.href = canvas.toDataURL('image/png')
      a.click()
    })
    certActions.appendChild(download)

    const share = el('button', 'btn', '🔗 ' + esc(t('shareCert')))
    share.addEventListener('click', async () => {
      this.deps.sfx.click()
      const text = t('shareText')
        .replace('{course}', tr(course.name, lang()))
        .replace('{steps}', String(course.lessons.length))
        .replace('{xp}', String(this.deps.xp()))
      try {
        if (navigator.share) {
          await navigator.share({ text })
        } else {
          await navigator.clipboard.writeText(text)
          this.deps.toast(t('copiedShare'))
        }
      } catch {
        /* user cancelled */
      }
    })
    certActions.appendChild(share)
    certBlock.appendChild(certActions)
    card.appendChild(certBlock)

    const row = el('div', 'completion-actions')
    const explore = el('button', 'btn', esc(t('keepExploring')))
    explore.addEventListener('click', () => {
      this.deps.sfx.click()
      this.closeCurrent(true)
      onKeepExploring()
    })
    const worlds = el('button', 'btn btn-primary', '🌍 ' + esc(t('otherWorlds')))
    worlds.addEventListener('click', () => {
      this.deps.sfx.click()
      this.showWorlds()
    })
    row.appendChild(worlds)
    row.appendChild(explore)
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
