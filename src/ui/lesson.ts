import { tr, type Lang } from '../game/constants'
import type { CourseRuntime } from '../game/runtime'
import { renderChallenge, type ChallengeCallbacks } from './challenges'
import { el, esc } from './dom'

export interface LessonModalDeps {
  lang: () => Lang
  t: (key: string) => string
  isCompleted: (step: number) => boolean
  onComplete: (step: number, perfect: boolean) => void
  onClose: () => void
  sfx: { open: () => void; close: () => void; click: () => void; success: () => void; error: () => void }
}

/** The full-screen learning card: lesson content + interactive challenge. */
export class LessonModal {
  private overlay: HTMLElement | null = null
  private escHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.close()
  }

  constructor(
    private root: HTMLElement,
    private rt: CourseRuntime,
    private deps: LessonModalDeps,
  ) {}

  get isOpen(): boolean {
    return this.overlay !== null
  }

  open(step: number): void {
    if (this.overlay) this.destroy()
    const { lang, t } = this.deps
    const lesson = this.rt.lessonOf(step)
    const levelIdx = this.rt.levelOfStep(step)
    const level = this.rt.course.levels[levelIdx]
    const review = this.deps.isCompleted(step)
    const L = lang()

    const overlay = el('div', 'overlay lesson-overlay')
    const card = el('div', 'card lesson-card')
    card.style.setProperty('--accent', level.color)

    /* header */
    const header = el('header', 'lesson-header')
    const chipRow = el('div', 'lesson-chips')
    chipRow.appendChild(
      el('span', 'chip chip-step', `${esc(t('step'))} ${String(step).padStart(2, '0')} <span class="chip-dim">/ ${this.rt.stepCount}</span>`),
    )
    chipRow.appendChild(
      el('span', 'chip chip-level', `${esc(t('levelLabel'))} ${levelIdx + 1} · ${esc(tr(level.name, L)).toUpperCase()}`),
    )
    if (review) chipRow.appendChild(el('span', 'chip chip-done', '✓ ' + esc(t('completed'))))
    header.appendChild(chipRow)

    header.appendChild(
      el(
        'div',
        'lesson-route',
        `<span class="route-from">${esc(tr(lesson.from, L))}</span>
         <span class="route-arrow">⟶</span>
         <span class="route-to">${esc(tr(lesson.to, L))}</span>`,
      ),
    )
    header.appendChild(el('h2', 'lesson-title', `<span class="lesson-icon">${lesson.icon}</span> ${esc(tr(lesson.title, L))}`))
    header.appendChild(el('p', 'lesson-tagline', esc(tr(lesson.tagline, L))))

    const closeBtn = el('button', 'icon-btn lesson-close', '✕')
    closeBtn.setAttribute('aria-label', t('close'))
    closeBtn.addEventListener('click', () => this.close())
    header.appendChild(closeBtn)
    card.appendChild(header)

    /* body */
    const body = el('div', 'lesson-body')
    body.appendChild(el('p', 'lesson-hook', esc(tr(lesson.hook, L))))
    for (const p of lesson.body) body.appendChild(el('p', 'lesson-p', esc(tr(p, L))))
    if (lesson.example) {
      const ex = el('div', 'lesson-example')
      ex.appendChild(el('div', 'example-label', esc(tr(lesson.example.label, L))))
      ex.appendChild(el('pre', 'example-code', esc(lesson.example.code)))
      body.appendChild(ex)
    }

    /* challenge */
    const challengeWrap = el('section', 'lesson-challenge')
    challengeWrap.appendChild(el('h3', 'challenge-heading', esc(t('challenge'))))
    let passed = review
    let mistakes = 0

    const footer = el('footer', 'lesson-footer')
    const action = el('div', 'lesson-action')
    action.appendChild(el('span', 'action-label', '⚡ ' + esc(t('tryToday'))))
    action.appendChild(el('p', 'action-text', esc(tr(lesson.action, L))))

    const completeBtn = el('button', 'btn btn-primary btn-complete', esc(review ? t('close') : t('completeStep')))
    completeBtn.disabled = !passed
    completeBtn.addEventListener('click', () => {
      if (!passed) return
      if (!review) this.deps.onComplete(step, mistakes === 0)
      this.close(!review)
    })

    const cbs: ChallengeCallbacks = {
      t,
      onClick: () => this.deps.sfx.click(),
      onWrong: () => {
        mistakes++
        this.deps.sfx.error()
      },
      onPass: () => {
        this.deps.sfx.success()
        passed = true
        completeBtn.disabled = false
        challengeWrap.classList.add('passed')
        completeBtn.classList.add('pulse')
      },
    }
    challengeWrap.appendChild(renderChallenge(lesson.challenge, L, cbs))
    body.appendChild(challengeWrap)
    card.appendChild(body)

    footer.appendChild(action)
    footer.appendChild(completeBtn)
    card.appendChild(footer)

    overlay.appendChild(card)
    overlay.addEventListener('pointerdown', (e) => {
      if (e.target === overlay) this.close()
    })
    this.root.appendChild(overlay)
    requestAnimationFrame(() => overlay.classList.add('visible'))
    window.addEventListener('keydown', this.escHandler)
    this.overlay = overlay
    this.deps.sfx.open()
  }

  close(silent = false): void {
    if (!this.overlay) return
    if (!silent) this.deps.sfx.close()
    const overlay = this.overlay
    overlay.classList.remove('visible')
    setTimeout(() => overlay.remove(), 260)
    this.overlay = null
    window.removeEventListener('keydown', this.escHandler)
    this.deps.onClose()
  }

  private destroy(): void {
    this.overlay?.remove()
    this.overlay = null
    window.removeEventListener('keydown', this.escHandler)
  }
}
