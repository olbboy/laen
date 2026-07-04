/**
 * Fully procedural audio: a soft ambient pad that shifts with altitude,
 * plus synthesized SFX. No samples, no downloads.
 */
export class AudioEngine {
  private ctx?: AudioContext
  private master?: GainNode
  private musicGain?: GainNode
  private sfxGain?: GainNode
  private enabled = true
  private nextChordAt = 0
  private chordIndex = 0

  /** Chord pools per zone (frequencies in Hz), drifting brighter as you rise. */
  private static CHORDS: number[][][] = [
    // zone 0 — gentle morning (C maj pentatonic colors)
    [
      [130.81, 196.0, 261.63, 392.0],
      [146.83, 220.0, 293.66, 440.0],
      [174.61, 261.63, 349.23, 523.25],
    ],
    // zone 1 — lifted (A min7 / F maj7 world)
    [
      [110.0, 164.81, 261.63, 329.63],
      [174.61, 261.63, 329.63, 523.25],
      [130.81, 196.0, 329.63, 493.88],
    ],
    // zone 2 — golden (D maj / B min warmth)
    [
      [146.83, 220.0, 293.66, 369.99],
      [123.47, 185.0, 246.94, 369.99],
      [164.81, 246.94, 329.63, 415.3],
    ],
    // zone 3 — dusk wonder (suspended, airy)
    [
      [98.0, 146.83, 196.0, 293.66],
      [110.0, 164.81, 220.0, 329.63],
      [87.31, 130.81, 174.61, 261.63],
    ],
  ]

  init(): void {
    if (this.ctx) return
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    this.ctx = new Ctx()
    this.master = this.ctx.createGain()
    this.master.gain.value = this.enabled ? 1 : 0
    this.master.connect(this.ctx.destination)
    this.musicGain = this.ctx.createGain()
    this.musicGain.gain.value = 0.16
    this.musicGain.connect(this.master)
    this.sfxGain = this.ctx.createGain()
    this.sfxGain.gain.value = 0.5
    this.sfxGain.connect(this.master)
    this.startWind()
  }

  setEnabled(on: boolean): void {
    this.enabled = on
    if (this.ctx && this.master) {
      this.master.gain.linearRampToValueAtTime(on ? 1 : 0, this.ctx.currentTime + 0.2)
    }
  }

  /** Called every frame; schedules ambient chords just-in-time. */
  update(zone: number): void {
    if (!this.ctx || !this.musicGain || !this.enabled) return
    const now = this.ctx.currentTime
    if (now < this.nextChordAt - 0.5) return
    const pool = AudioEngine.CHORDS[Math.min(zone, 3)]
    const chord = pool[this.chordIndex % pool.length]
    this.chordIndex++
    const dur = 9
    for (const [i, f] of chord.entries()) {
      const osc = this.ctx.createOscillator()
      osc.type = i % 2 === 0 ? 'sine' : 'triangle'
      osc.frequency.value = f
      osc.detune.value = (Math.random() - 0.5) * 10
      const g = this.ctx.createGain()
      const peak = 0.09 / (i * 0.4 + 1)
      g.gain.setValueAtTime(0, now)
      g.gain.linearRampToValueAtTime(peak, now + dur * 0.35)
      g.gain.linearRampToValueAtTime(0, now + dur)
      const lp = this.ctx.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 900
      osc.connect(g).connect(lp).connect(this.musicGain)
      osc.start(now)
      osc.stop(now + dur + 0.1)
    }
    this.nextChordAt = now + dur * 0.66
  }

  private startWind(): void {
    if (!this.ctx || !this.master) return
    const len = this.ctx.sampleRate * 2
    const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let last = 0
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 3
    }
    const src = this.ctx.createBufferSource()
    src.buffer = buffer
    src.loop = true
    const lp = this.ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 420
    const g = this.ctx.createGain()
    g.gain.value = 0.05
    src.connect(lp).connect(g).connect(this.master)
    src.start()
  }

  /* ------------------------------ SFX ------------------------------ */

  private tone(freq: number, dur: number, type: OscillatorType, vol: number, when = 0, slide = 0): void {
    if (!this.ctx || !this.sfxGain || !this.enabled) return
    const t = this.ctx.currentTime + when
    const osc = this.ctx.createOscillator()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t)
    if (slide !== 0) osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), t + dur)
    const g = this.ctx.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(vol, t + 0.012)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.connect(g).connect(this.sfxGain)
    osc.start(t)
    osc.stop(t + dur + 0.05)
  }

  click(): void {
    this.tone(880, 0.06, 'sine', 0.12)
  }

  open(): void {
    this.tone(440, 0.16, 'sine', 0.14, 0, 220)
    this.tone(660, 0.2, 'sine', 0.08, 0.05, 220)
  }

  closeUi(): void {
    this.tone(520, 0.12, 'sine', 0.1, 0, -180)
  }

  jump(): void {
    this.tone(300, 0.18, 'sine', 0.12, 0, 260)
  }

  land(): void {
    this.tone(160, 0.1, 'sine', 0.1, 0, -40)
  }

  /** rising pentatonic ding per pickup */
  collect(combo: number): void {
    const scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]
    const f = scale[Math.min(combo, scale.length - 1)]
    this.tone(f, 0.24, 'sine', 0.16)
    this.tone(f * 2, 0.18, 'sine', 0.05, 0.02)
  }

  success(): void {
    const notes = [523.25, 659.25, 783.99]
    notes.forEach((f, i) => this.tone(f, 0.35, 'triangle', 0.12, i * 0.07))
  }

  error(): void {
    this.tone(220, 0.16, 'triangle', 0.1, 0, -60)
  }

  /** big step-complete fanfare + bridge unlock whoosh */
  complete(): void {
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((f, i) => this.tone(f, 0.5, 'triangle', 0.14, i * 0.09))
    this.tone(1318.5, 0.8, 'sine', 0.08, 0.4)
    this.whoosh(0.55)
  }

  whoosh(when = 0): void {
    if (!this.ctx || !this.sfxGain || !this.enabled) return
    const t = this.ctx.currentTime + when
    const len = this.ctx.sampleRate * 0.7
    const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len)
    const src = this.ctx.createBufferSource()
    src.buffer = buffer
    const bp = this.ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.Q.value = 1.2
    bp.frequency.setValueAtTime(300, t)
    bp.frequency.exponentialRampToValueAtTime(2400, t + 0.6)
    const g = this.ctx.createGain()
    g.gain.setValueAtTime(0.16, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.7)
    src.connect(bp).connect(g).connect(this.sfxGain)
    src.start(t)
  }

  fanfare(): void {
    const melody = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5]
    melody.forEach((f, i) => this.tone(f, 0.4, 'triangle', 0.13, i * 0.14))
    this.whoosh(0.2)
    this.whoosh(0.9)
  }
}
