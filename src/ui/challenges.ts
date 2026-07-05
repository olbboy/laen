import type { ChallengeSpec } from '../content/types'
import { tr, type Lang } from '../game/constants'
import { el, esc, shuffled } from './dom'

export interface ChallengeCallbacks {
  onPass: () => void
  onWrong: () => void
  onClick: () => void
  t: (key: string) => string
}

/**
 * Renders one of the five interactive challenge engines into a container.
 * All engines: instant feedback, teaching on wrong answers, retry allowed.
 */
export function renderChallenge(spec: ChallengeSpec, lang: Lang, cb: ChallengeCallbacks): HTMLElement {
  switch (spec.kind) {
    case 'quiz':
      return renderQuiz(spec, lang, cb)
    case 'multi':
      return renderMulti(spec, lang, cb)
    case 'match':
      return renderMatch(spec, lang, cb)
    case 'order':
      return renderOrder(spec, lang, cb)
    case 'terminal':
      return renderTerminal(spec, lang, cb)
  }
}

/* ----------------------------- quiz ----------------------------- */

function renderQuiz(spec: Extract<ChallengeSpec, { kind: 'quiz' }>, lang: Lang, cb: ChallengeCallbacks): HTMLElement {
  const root = el('div', 'challenge')
  root.appendChild(el('p', 'challenge-prompt', esc(tr(spec.prompt, lang))))
  const list = el('div', 'quiz-options')
  let solved = false

  for (const opt of shuffled(spec.options)) {
    const btn = el('button', 'quiz-option')
    btn.appendChild(el('span', 'quiz-option-text', esc(tr(opt.text, lang))))
    const fb = el('div', 'option-feedback', esc(tr(opt.feedback, lang)))
    btn.appendChild(fb)
    btn.addEventListener('click', () => {
      if (solved) return
      cb.onClick()
      btn.classList.add('revealed')
      if (opt.correct) {
        solved = true
        btn.classList.add('correct')
        list.querySelectorAll('.quiz-option').forEach((o) => o.classList.add('done'))
        cb.onPass()
      } else {
        btn.classList.add('wrong')
        cb.onWrong()
      }
    })
    list.appendChild(btn)
  }
  root.appendChild(list)
  return root
}

/* -------------------------- multi-select ------------------------- */

function renderMulti(spec: Extract<ChallengeSpec, { kind: 'multi' }>, lang: Lang, cb: ChallengeCallbacks): HTMLElement {
  const root = el('div', 'challenge')
  root.appendChild(el('p', 'challenge-prompt', esc(tr(spec.prompt, lang))))
  root.appendChild(el('p', 'challenge-hint', esc(cb.t('multiHint'))))
  const list = el('div', 'multi-options')
  const options = shuffled(spec.options)
  const selected = new Set<number>()
  let solved = false

  options.forEach((opt, i) => {
    const btn = el('button', 'multi-option')
    btn.appendChild(el('span', 'multi-check'))
    btn.appendChild(el('span', 'multi-option-text', esc(tr(opt.text, lang))))
    const fb = el('div', 'option-feedback', esc(tr(opt.feedback, lang)))
    btn.appendChild(fb)
    btn.addEventListener('click', () => {
      if (solved) return
      cb.onClick()
      if (selected.has(i)) {
        selected.delete(i)
        btn.classList.remove('selected')
      } else {
        selected.add(i)
        btn.classList.add('selected')
      }
    })
    list.appendChild(btn)
  })
  root.appendChild(list)

  const check = el('button', 'btn btn-primary', esc(cb.t('checkAnswer')))
  const verdict = el('p', 'challenge-verdict')
  check.addEventListener('click', () => {
    if (solved) return
    cb.onClick()
    let allRight = true
    options.forEach((opt, i) => {
      const node = list.children[i] as HTMLElement
      node.classList.add('revealed')
      const chosen = selected.has(i)
      if (chosen !== opt.good) {
        allRight = false
        node.classList.add('wrong')
      } else if (opt.good) {
        node.classList.add('correct')
      }
    })
    if (allRight) {
      solved = true
      verdict.textContent = cb.t('perfect')
      verdict.className = 'challenge-verdict good'
      check.disabled = true
      cb.onPass()
    } else {
      verdict.textContent = cb.t('notQuite')
      verdict.className = 'challenge-verdict bad'
      cb.onWrong()
      // let them adjust: clear reveal after a beat
      setTimeout(() => {
        list.querySelectorAll('.multi-option').forEach((o) => o.classList.remove('revealed', 'wrong', 'correct'))
      }, 2600)
    }
  })
  root.appendChild(verdict)
  root.appendChild(check)
  return root
}

/* ----------------------------- match ----------------------------- */

function renderMatch(spec: Extract<ChallengeSpec, { kind: 'match' }>, lang: Lang, cb: ChallengeCallbacks): HTMLElement {
  const root = el('div', 'challenge')
  root.appendChild(el('p', 'challenge-prompt', esc(tr(spec.prompt, lang))))
  root.appendChild(el('p', 'challenge-hint', esc(cb.t('matchHint'))))

  const grid = el('div', 'match-grid')
  const leftCol = el('div', 'match-col')
  const rightCol = el('div', 'match-col')
  grid.appendChild(leftCol)
  grid.appendChild(rightCol)

  const lefts = shuffled(spec.pairs.map((p, i) => ({ text: tr(p.left, lang), i })))
  const rights = shuffled(spec.pairs.map((p, i) => ({ text: tr(p.right, lang), i })))
  let activeLeft: { btn: HTMLButtonElement; i: number } | null = null
  let matched = 0

  for (const item of lefts) {
    const btn = el('button', 'match-item match-left', esc(item.text))
    btn.addEventListener('click', () => {
      if (btn.classList.contains('matched')) return
      cb.onClick()
      leftCol.querySelectorAll('.match-item').forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')
      activeLeft = { btn, i: item.i }
    })
    leftCol.appendChild(btn)
  }

  for (const item of rights) {
    const btn = el('button', 'match-item match-right', esc(item.text))
    btn.addEventListener('click', () => {
      if (btn.classList.contains('matched') || !activeLeft) return
      cb.onClick()
      if (activeLeft.i === item.i) {
        btn.classList.add('matched')
        activeLeft.btn.classList.add('matched')
        activeLeft.btn.classList.remove('active')
        activeLeft = null
        matched++
        if (matched === spec.pairs.length) cb.onPass()
      } else {
        btn.classList.add('shake')
        activeLeft.btn.classList.add('shake')
        const l = activeLeft.btn
        setTimeout(() => {
          btn.classList.remove('shake')
          l.classList.remove('shake')
        }, 420)
        cb.onWrong()
      }
    })
    rightCol.appendChild(btn)
  }

  root.appendChild(grid)
  return root
}

/* ----------------------------- order ----------------------------- */

function renderOrder(spec: Extract<ChallengeSpec, { kind: 'order' }>, lang: Lang, cb: ChallengeCallbacks): HTMLElement {
  const root = el('div', 'challenge')
  root.appendChild(el('p', 'challenge-prompt', esc(tr(spec.prompt, lang))))
  root.appendChild(el('p', 'challenge-hint', esc(cb.t('orderHint'))))
  const list = el('div', 'order-list')
  root.appendChild(list)
  let solved = false

  const build = () => {
    list.innerHTML = ''
    let next = 0
    for (const item of shuffled(spec.items.map((it, i) => ({ text: tr(it, lang), i })))) {
      const btn = el('button', 'order-item')
      btn.appendChild(el('span', 'order-badge', ''))
      btn.appendChild(el('span', 'order-text', esc(item.text)))
      btn.addEventListener('click', () => {
        if (solved || btn.classList.contains('picked')) return
        cb.onClick()
        if (item.i === next) {
          btn.classList.add('picked')
          const badge = btn.querySelector('.order-badge')!
          badge.textContent = String(next + 1)
          next++
          if (next === spec.items.length) {
            solved = true
            list.classList.add('done')
            cb.onPass()
          }
        } else {
          btn.classList.add('shake')
          setTimeout(() => btn.classList.remove('shake'), 420)
          cb.onWrong()
          // reset the sequence — order matters, start over
          setTimeout(() => {
            if (!solved) build()
          }, 500)
        }
      })
      list.appendChild(btn)
    }
  }
  build()
  return root
}

/* --------------------------- terminal ---------------------------- */

function renderTerminal(
  spec: Extract<ChallengeSpec, { kind: 'terminal' }>,
  lang: Lang,
  cb: ChallengeCallbacks,
): HTMLElement {
  const root = el('div', 'challenge')
  root.appendChild(el('p', 'challenge-prompt', esc(tr(spec.prompt, lang))))

  const term = el('div', 'terminal')
  const hist = el('div', 'terminal-history')
  hist.appendChild(el('div', 'terminal-line dim', '# ' + esc(tr(spec.hint, lang))))
  term.appendChild(hist)

  const inputRow = el('div', 'terminal-input-row')
  inputRow.appendChild(el('span', 'terminal-ps1', 'you@laen<span class="dim">:~$</span>'))
  const input = document.createElement('input')
  input.className = 'terminal-input'
  input.type = 'text'
  input.placeholder = spec.placeholder
  input.autocapitalize = 'off'
  input.autocomplete = 'off'
  input.spellcheck = false
  inputRow.appendChild(input)
  term.appendChild(inputRow)
  root.appendChild(term)

  const row = el('div', 'challenge-actions')
  const runBtn = el('button', 'btn btn-primary', esc(cb.t('run')))
  row.appendChild(runBtn)
  root.appendChild(row)

  const re = new RegExp(spec.pattern, 'i')
  let solved = false

  const submit = () => {
    if (solved) return
    const value = input.value.trim()
    if (!value) return
    cb.onClick()
    hist.appendChild(el('div', 'terminal-line', `<span class="dim">$</span> ${esc(value)}`))
    if (re.test(value)) {
      solved = true
      hist.appendChild(el('div', 'terminal-line ok', '✓ ' + esc(tr(spec.success, lang))))
      input.disabled = true
      runBtn.disabled = true
      cb.onPass()
    } else {
      hist.appendChild(el('div', 'terminal-line err', '✗ ' + esc(tr(spec.hint, lang))))
      cb.onWrong()
    }
    input.value = ''
    hist.scrollTop = hist.scrollHeight
  }

  runBtn.addEventListener('click', submit)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submit()
    e.stopPropagation()
  })
  setTimeout(() => input.focus(), 350)
  return root
}
