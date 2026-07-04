/**
 * Unified input: keyboard (WASD/arrows, Space, E), mouse drag + wheel for
 * the camera, and a virtual joystick + buttons on touch devices.
 */
export class Input {
  enabled = true
  readonly isTouch = matchMedia('(pointer: coarse)').matches

  private keys = new Set<string>()
  private jumpEdge = false
  private interactEdge = false

  /** camera orbit deltas, consumed each frame */
  dragX = 0
  dragY = 0
  zoomDelta = 0

  /** joystick axes in [-1, 1] */
  private joyX = 0
  private joyY = 0

  private joyEl?: HTMLElement
  private knobEl?: HTMLElement

  constructor(canvas: HTMLCanvasElement, uiRoot: HTMLElement) {
    window.addEventListener('keydown', (e) => {
      if (!this.enabled) return
      if (e.repeat) return
      this.keys.add(e.code)
      if (e.code === 'Space') {
        this.jumpEdge = true
        e.preventDefault()
      }
      if (e.code === 'KeyE') this.interactEdge = true
    })
    window.addEventListener('keyup', (e) => this.keys.delete(e.code))
    window.addEventListener('blur', () => this.keys.clear())

    // -- mouse / trackpad camera orbit ------------------------------
    let dragging = false
    let lastX = 0
    let lastY = 0
    canvas.addEventListener('pointerdown', (e) => {
      if (this.isTouch) return // touch camera handled below
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
      canvas.setPointerCapture(e.pointerId)
    })
    canvas.addEventListener('pointermove', (e) => {
      if (!dragging || this.isTouch) return
      this.dragX += e.clientX - lastX
      this.dragY += e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY
    })
    canvas.addEventListener('pointerup', () => (dragging = false))
    canvas.addEventListener('pointercancel', () => (dragging = false))
    canvas.addEventListener('wheel', (e) => {
      if (!this.enabled) return
      this.zoomDelta += e.deltaY
      e.preventDefault()
    }, { passive: false })

    if (this.isTouch) this.buildTouchControls(canvas, uiRoot)
  }

  private buildTouchControls(canvas: HTMLCanvasElement, uiRoot: HTMLElement): void {
    // Virtual joystick (left half) --------------------------------
    const joy = document.createElement('div')
    joy.className = 'joystick'
    const knob = document.createElement('div')
    knob.className = 'joystick-knob'
    joy.appendChild(knob)
    uiRoot.appendChild(joy)
    this.joyEl = joy
    this.knobEl = knob

    const RADIUS = 52
    let joyPointer = -1
    let cx = 0
    let cy = 0

    const setKnob = (dx: number, dy: number) => {
      knob.style.transform = `translate(${dx}px, ${dy}px)`
    }

    canvas.addEventListener('pointerdown', (e) => {
      if (!this.enabled) return
      if (e.clientX < window.innerWidth * 0.45 && joyPointer === -1) {
        joyPointer = e.pointerId
        cx = e.clientX
        cy = e.clientY
        joy.style.left = `${cx - 60}px`
        joy.style.top = `${cy - 60}px`
        joy.classList.add('active')
      } else {
        // right side: camera drag
        camPointer = e.pointerId
        camX = e.clientX
        camY = e.clientY
      }
    })

    let camPointer = -1
    let camX = 0
    let camY = 0

    canvas.addEventListener('pointermove', (e) => {
      if (e.pointerId === joyPointer) {
        let dx = e.clientX - cx
        let dy = e.clientY - cy
        const len = Math.hypot(dx, dy)
        if (len > RADIUS) {
          dx = (dx / len) * RADIUS
          dy = (dy / len) * RADIUS
        }
        setKnob(dx, dy)
        this.joyX = dx / RADIUS
        this.joyY = dy / RADIUS
      } else if (e.pointerId === camPointer) {
        this.dragX += e.clientX - camX
        this.dragY += e.clientY - camY
        camX = e.clientX
        camY = e.clientY
      }
    })

    const release = (e: PointerEvent) => {
      if (e.pointerId === joyPointer) {
        joyPointer = -1
        this.joyX = 0
        this.joyY = 0
        setKnob(0, 0)
        joy.classList.remove('active')
      }
      if (e.pointerId === camPointer) camPointer = -1
    }
    canvas.addEventListener('pointerup', release)
    canvas.addEventListener('pointercancel', release)

    // Jump button --------------------------------------------------
    const jump = document.createElement('button')
    jump.className = 'touch-btn touch-jump'
    jump.textContent = '⤒'
    jump.setAttribute('aria-label', 'jump')
    jump.addEventListener('pointerdown', (e) => {
      e.preventDefault()
      if (this.enabled) this.jumpEdge = true
    })
    uiRoot.appendChild(jump)
  }

  /** Movement axes in local screen space: x = strafe, y = forward. */
  moveAxes(): { x: number; y: number } {
    if (!this.enabled) return { x: 0, y: 0 }
    let x = 0
    let y = 0
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) y += 1
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) y -= 1
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) x -= 1
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) x += 1
    x += this.joyX
    y -= this.joyY
    const len = Math.hypot(x, y)
    if (len > 1) {
      x /= len
      y /= len
    }
    return { x, y }
  }

  consumeJump(): boolean {
    const j = this.jumpEdge && this.enabled
    this.jumpEdge = false
    return j
  }

  consumeInteract(): boolean {
    const i = this.interactEdge && this.enabled
    this.interactEdge = false
    return i
  }

  consumeDrag(): { x: number; y: number; zoom: number } {
    const d = { x: this.dragX, y: this.dragY, zoom: this.zoomDelta }
    this.dragX = 0
    this.dragY = 0
    this.zoomDelta = 0
    return d
  }

  setTouchVisible(v: boolean): void {
    if (this.joyEl) this.joyEl.style.display = v ? '' : 'none'
    if (this.knobEl) this.knobEl.style.transform = 'translate(0,0)'
    const btn = document.querySelector<HTMLElement>('.touch-jump')
    if (btn) btn.style.display = v ? '' : 'none'
  }
}
