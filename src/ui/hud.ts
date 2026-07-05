import { tr, type Lang } from '../game/constants'
import type { Course } from '../content/types'
import type { CourseRuntime } from '../game/runtime'
import { el, esc } from './dom'

export interface HudDeps {
  lang: () => Lang
  t: (key: string) => string
  isCompleted: (step: number) => boolean
  nextStep: () => number
  onOpenWorlds: () => void
  onOpenJournal: () => void
  onOpenSettings: () => void
  onLadderClick: (step: number) => void
  onInteract: () => void
}

/** All persistent on-screen chrome: chips, spark counter, ladder, prompts. */
export class Hud {
  private stepChip: HTMLElement
  private sparkCounter: HTMLElement
  private prompt: HTMLElement
  private promptLabel: HTMLElement
  private edgeArrow: HTMLElement
  private hintBar: HTMLElement
  private toasts: HTMLElement
  private dots: HTMLElement[] = []
  private course: Course
  private rt: CourseRuntime

  constructor(
    root: HTMLElement,
    rt: CourseRuntime,
    private deps: HudDeps,
  ) {
    this.rt = rt
    this.course = rt.course
    const hud = el('div', 'hud')

    /* top-left: brand + current step */
    const topLeft = el('div', 'hud-topleft')
    topLeft.appendChild(el('div', 'hud-brand', 'NEXT<span>STEP</span>'))
    const worldChip = el('button', 'hud-world-chip', `${this.course.icon} ${esc(tr(this.course.name, deps.lang()))}`)
    worldChip.addEventListener('click', deps.onOpenWorlds)
    topLeft.appendChild(worldChip)
    this.stepChip = el('div', 'hud-step-chip')
    topLeft.appendChild(this.stepChip)
    hud.appendChild(topLeft)

    /* top-right: sparks + menu buttons */
    const topRight = el('div', 'hud-topright')
    this.sparkCounter = el('div', 'hud-sparks', '<span class="spark-icon">✦</span><span class="spark-count">0</span>')
    topRight.appendChild(this.sparkCounter)
    const worldsBtn = el('button', 'icon-btn', '🌍')
    worldsBtn.setAttribute('aria-label', 'worlds')
    worldsBtn.addEventListener('click', deps.onOpenWorlds)
    topRight.appendChild(worldsBtn)
    const journalBtn = el('button', 'icon-btn', '📖')
    journalBtn.setAttribute('aria-label', 'journal')
    journalBtn.addEventListener('click', deps.onOpenJournal)
    topRight.appendChild(journalBtn)
    const settingsBtn = el('button', 'icon-btn', '⚙')
    settingsBtn.setAttribute('aria-label', 'settings')
    settingsBtn.addEventListener('click', deps.onOpenSettings)
    topRight.appendChild(settingsBtn)
    hud.appendChild(topRight)

    /* right-edge ladder */
    const ladder = el('div', 'hud-ladder')
    for (let s = rt.stepCount; s >= 1; s--) {
      const dot = el('button', 'ladder-dot')
      dot.style.setProperty('--dot-color', rt.levelColorOfStep(s))
      dot.dataset.step = String(s)
      const tip = el('span', 'ladder-tip')
      dot.appendChild(tip)
      dot.addEventListener('click', () => this.deps.onLadderClick(s))
      ladder.appendChild(dot)
      this.dots[s] = dot
    }
    hud.appendChild(ladder)

    /* interact prompt (follows a station on screen) */
    this.prompt = el('div', 'interact-prompt')
    const key = el('span', 'prompt-key', 'E')
    this.promptLabel = el('span', 'prompt-label', '')
    this.prompt.appendChild(key)
    this.prompt.appendChild(this.promptLabel)
    this.prompt.addEventListener('pointerdown', (e) => {
      e.preventDefault()
      deps.onInteract()
    })
    hud.appendChild(this.prompt)

    /* off-screen objective arrow */
    this.edgeArrow = el('div', 'edge-arrow', '➤')
    hud.appendChild(this.edgeArrow)

    /* bottom hint bar */
    this.hintBar = el('div', 'hint-bar')
    hud.appendChild(this.hintBar)

    this.toasts = el('div', 'toasts')
    hud.appendChild(this.toasts)

    root.appendChild(hud)
    this.refresh()
  }

  refresh(): void {
    const { t, lang, nextStep } = this.deps
    const L = lang()
    const step = nextStep()

    const worldChip = document.querySelector('.hud-world-chip')
    if (worldChip) worldChip.innerHTML = `${this.course.icon} ${esc(tr(this.course.name, L))}`

    if (step > this.rt.stepCount) {
      this.stepChip.innerHTML = `<span class="chip chip-summit">★ ${esc(t('summitChip'))}</span>`
    } else {
      const lesson = this.rt.lessonOf(step)
      const color = this.rt.levelColorOfStep(step)
      this.stepChip.innerHTML = `
        <span class="chip chip-level" style="--accent:${color}">${esc(t('step'))} ${String(step).padStart(2, '0')} <span class="chip-dim">/ ${this.rt.stepCount}</span></span>
        <span class="hud-step-name">${esc(tr(lesson.from, L))} <span class="route-arrow">⟶</span> <b>${esc(tr(lesson.to, L))}</b></span>`
    }

    for (let s = 1; s <= this.rt.stepCount; s++) {
      const dot = this.dots[s]
      const lesson = this.rt.lessonOf(s)
      dot.classList.toggle('done', this.deps.isCompleted(s))
      dot.classList.toggle('current', s === step)
      const tip = dot.querySelector('.ladder-tip')!
      tip.textContent = `${String(s).padStart(2, '0')} · ${tr(lesson.to, L)}`
    }

    const kb = `<span class="kbd">W</span><span class="kbd">A</span><span class="kbd">S</span><span class="kbd">D</span> ${esc(t('introHintMove'))}
      · <span class="kbd">Space</span> ${esc(t('introHintJump'))}
      · <span class="kbd">E</span> ${esc(t('interact'))}`
    this.hintBar.innerHTML = kb
  }

  setSparks(n: number, total: number): void {
    this.sparkCounter.innerHTML = `<span class="spark-icon">✦</span><span class="spark-count">${n}<span class="spark-total">/${total}</span></span>`
    this.sparkCounter.classList.remove('pop')
    void this.sparkCounter.offsetWidth
    this.sparkCounter.classList.add('pop')
  }

  /** Position the interact prompt over a projected screen point. */
  showPrompt(x: number, y: number, label: string, isTouch: boolean): void {
    this.prompt.style.display = 'flex'
    this.prompt.style.left = `${x}px`
    this.prompt.style.top = `${y}px`
    this.promptLabel.textContent = label
    ;(this.prompt.querySelector('.prompt-key') as HTMLElement).style.display = isTouch ? 'none' : ''
  }

  hidePrompt(): void {
    this.prompt.style.display = 'none'
  }

  /** Edge chevron pointing toward the objective when it's off screen. */
  showEdgeArrow(angleRad: number, x: number, y: number): void {
    this.edgeArrow.style.display = 'block'
    this.edgeArrow.style.left = `${x}px`
    this.edgeArrow.style.top = `${y}px`
    this.edgeArrow.style.transform = `translate(-50%, -50%) rotate(${angleRad}rad)`
  }

  hideEdgeArrow(): void {
    this.edgeArrow.style.display = 'none'
  }

  toast(message: string): void {
    const node = el('div', 'toast', esc(message))
    this.toasts.appendChild(node)
    requestAnimationFrame(() => node.classList.add('visible'))
    setTimeout(() => {
      node.classList.remove('visible')
      setTimeout(() => node.remove(), 400)
    }, 3200)
  }

  fadeHints(): void {
    this.hintBar.classList.add('faded')
  }
}
