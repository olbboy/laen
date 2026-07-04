import * as THREE from 'three'
import './styles/main.css'
import { Engine } from './core/engine'
import { Input } from './core/input'
import { AudioEngine } from './core/audio'
import { GameState } from './game/state'
import {
  islandPosition,
  levelOfStep,
  STEP_COUNT,
  SUMMIT_POS,
  tr,
  ZONE_CENTERS,
  ZONES,
} from './game/constants'
import { lessonOf } from './content/lessons'
import { makeT } from './content/i18n'
import { World } from './world/world'
import { Robot } from './player/robot'
import { PlayerController } from './player/controller'
import { ChaseCamera } from './player/camera'
import { Hud } from './ui/hud'
import { LessonModal } from './ui/lesson'
import { Screens } from './ui/screens'

/* ------------------------------------------------------------------ */
/* bootstrap                                                           */
/* ------------------------------------------------------------------ */

const canvas = document.getElementById('scene') as HTMLCanvasElement
const uiRoot = document.getElementById('ui') as HTMLElement

const state = new GameState()
const t = makeT(() => state.lang)
const engine = new Engine(canvas)
const audio = new AudioEngine()
const input = new Input(canvas, uiRoot)

const world = new World(
  engine.scene,
  (step) => state.isCompleted(step),
  (id) => state.hasSpark(id),
)

const robot = new Robot()
engine.scene.add(robot.group)
const player = new PlayerController()
player.snapToGround(world.walkables)

// face the first station on spawn
const toFirst = islandPosition(1).clone().sub(islandPosition(0)).setY(0).normalize()
const cam = new ChaseCamera(engine.camera, Math.atan2(-toFirst.x, -toFirst.z))

/* fade layer for respawns */
const fade = document.createElement('div')
fade.className = 'fade'
uiRoot.appendChild(fade)
const vignette = document.createElement('div')
vignette.className = 'vignette'
uiRoot.appendChild(vignette)

/* ------------------------------------------------------------------ */
/* UI                                                                  */
/* ------------------------------------------------------------------ */

let playing = false

const lessonModal = new LessonModal(uiRoot, {
  lang: () => state.lang,
  t,
  isCompleted: (s) => state.isCompleted(s),
  onComplete: (s) => finishStep(s),
  onClose: () => syncInput(),
  sfx: {
    open: () => audio.open(),
    close: () => audio.closeUi(),
    click: () => audio.click(),
    success: () => audio.success(),
    error: () => audio.error(),
  },
})

const screens = new Screens(uiRoot, {
  lang: () => state.lang,
  t,
  isCompleted: (s) => state.isCompleted(s),
  completedCount: () => state.save.completed.length,
  sparkCount: () => state.save.sparks.length,
  sparkTotal: () => world.sparks.total,
  soundOn: () => state.save.sound,
  quality: () => state.save.quality,
  setLang: (l) => state.setLang(l),
  setSound: (on) => state.setSound(on),
  setQuality: (q) => state.setQuality(q),
  resetProgress: () => state.resetProgress(),
  onOpenLesson: (s) => {
    lessonModal.open(s)
    syncInput()
  },
  sfx: { click: () => audio.click(), open: () => audio.open(), close: () => audio.closeUi() },
})

const hud = new Hud(uiRoot, {
  lang: () => state.lang,
  t,
  isCompleted: (s) => state.isCompleted(s),
  nextStep: () => state.nextStep,
  onOpenJournal: () => {
    screens.showJournal()
    syncInput()
  },
  onOpenSettings: () => {
    screens.showSettings()
    syncInput()
  },
  onLadderClick: (s) => {
    if (state.isCompleted(s)) {
      lessonModal.open(s)
      syncInput()
    }
  },
  onInteract: () => tryInteract(),
})
hud.setSparks(state.save.sparks.length, world.sparks.total)

function syncInput(): void {
  const uiOpen = lessonModal.isOpen || screens.isOpen || cinematic !== null || !playing
  input.enabled = !uiOpen
  input.setTouchVisible(!uiOpen)
}

/* ------------------------------------------------------------------ */
/* progression                                                         */
/* ------------------------------------------------------------------ */

function refreshStations(): void {
  for (const st of world.stations) {
    const lesson = lessonOf(st.step)
    const status = state.isCompleted(st.step) ? 'done' : st.step === state.nextStep ? 'next' : 'locked'
    st.setStatus(status, tr(lesson.to, state.lang))
  }
}
refreshStations()

function finishStep(step: number): void {
  state.completeStep(step)
}

state.on('step-completed', (step) => {
  const station = world.stationOf(step)
  const accent = ZONES[levelOfStep(step)].accent.getHex()
  world.particles.spawn(station.worldPos.clone().add(new THREE.Vector3(0, 3.2, 0)), accent, 42, 7, -5, 1.4, 0.7)
  world.particles.spawn(station.worldPos.clone().add(new THREE.Vector3(0, 3.2, 0)), 0xffd66b, 24, 4, -3, 1.8, 0.5)
  audio.complete()
  refreshStations()
  hud.refresh()

  if (step < STEP_COUNT) {
    world.openBridgeAfter(step, true)
    hud.toast(t('stepDone'))
    setTimeout(() => hud.toast(t('bridgeOpen')), 1400)
  } else {
    // summit!
    world.beacon.ignite()
    world.particles.spawn(SUMMIT_POS.clone(), 0xffd66b, 90, 12, -3, 2.6, 1.0)
    world.particles.spawn(SUMMIT_POS.clone(), 0xffffff, 40, 8, -2, 2.2, 0.7)
    audio.fanfare()
    setTimeout(() => {
      screens.showCompletion(() => syncInput())
      syncInput()
    }, 2000)
  }
})

state.on('spark-collected', (_id, total) => {
  hud.setSparks(total, world.sparks.total)
})

state.on('lang-changed', () => {
  hud.refresh()
  refreshStations()
})

state.on('sound-changed', (on) => audio.setEnabled(on))
state.on('quality-changed', (q) => engine.setQuality(q))
state.on('reset', () => location.reload())

player.onFall = () => {
  fade.classList.add('flash')
  setTimeout(() => fade.classList.remove('flash'), 700)
  hud.toast(t('fell'))
}
player.onJump = () => audio.jump()
player.onLand = () => audio.land()

/* ------------------------------------------------------------------ */
/* interaction                                                         */
/* ------------------------------------------------------------------ */

const INTERACT_RANGE = 5.2

function nearestStation(): { step: number; dist: number } | null {
  let best: { step: number; dist: number } | null = null
  for (const st of world.stations) {
    const d = st.worldPos.distanceTo(player.position)
    if (d < INTERACT_RANGE && (!best || d < best.dist)) best = { step: st.step, dist: d }
  }
  return best
}

function tryInteract(): void {
  if (lessonModal.isOpen || screens.isOpen) return
  const near = nearestStation()
  if (!near) return
  if (state.isUnlocked(near.step) || state.isCompleted(near.step)) {
    lessonModal.open(near.step)
    syncInput()
  } else {
    hud.toast(t('lockedStation'))
  }
}

/* ------------------------------------------------------------------ */
/* cinematic intro sweep                                               */
/* ------------------------------------------------------------------ */

let cinematic: { t: number; dur: number } | null = null

function chaseDesired(): { pos: THREE.Vector3; look: THREE.Vector3 } {
  const offset = new THREE.Vector3(
    Math.sin(cam.yaw) * Math.cos(cam.pitch),
    Math.sin(cam.pitch),
    Math.cos(cam.yaw) * Math.cos(cam.pitch),
  ).multiplyScalar(cam.distance)
  return {
    pos: player.position.clone().add(offset).add(new THREE.Vector3(0, 1.4, 0)),
    look: player.position.clone().add(new THREE.Vector3(0, 1.7, 0)),
  }
}

function startCinematic(): void {
  cinematic = { t: 0, dur: 5 }
  syncInput()
}

function updateCinematic(dt: number): void {
  if (!cinematic) return
  cinematic.t += dt
  const k = THREE.MathUtils.smootherstep(Math.min(cinematic.t / cinematic.dur, 1), 0, 1)
  const end = chaseDesired()
  const p0 = new THREE.Vector3(SUMMIT_POS.x + 30, SUMMIT_POS.y + 6, SUMMIT_POS.z + 30)
  const mid = p0.clone().lerp(end.pos, 0.5)
  mid.y += 18
  const outward = mid.clone().setY(0)
  if (outward.lengthSq() > 0.01) mid.addScaledVector(outward.normalize(), 22)
  // quadratic bezier sweep
  const a = p0.clone().lerp(mid, k)
  const b = mid.clone().lerp(end.pos, k)
  const pos = a.lerp(b, k)
  const look = SUMMIT_POS.clone().lerp(end.look, k)
  cam.setImmediate(pos, look)
  if (cinematic.t >= cinematic.dur) {
    cinematic = null
    syncInput()
  }
}

const skipCinematic = () => {
  if (cinematic && cinematic.t > 0.5) cinematic.t = cinematic.dur
}
window.addEventListener('pointerdown', skipCinematic)
window.addEventListener('keydown', skipCinematic)

/* ------------------------------------------------------------------ */
/* main loop                                                           */
/* ------------------------------------------------------------------ */

const proj = new THREE.Vector3()
let sparkCombo = 0
let sparkComboTimer = 0
let movedYet = false

engine.onFrame((dt, time) => {
  /* camera input */
  const drag = input.consumeDrag()
  if (input.enabled) cam.applyDrag(drag.x, drag.y, drag.zoom)

  /* player */
  const move = input.moveAxes()
  if ((move.x !== 0 || move.y !== 0) && !movedYet) {
    movedYet = true
    setTimeout(() => hud.fadeHints(), 4000)
  }
  player.update(dt, move, input.consumeJump(), cam.yaw, world.walkables)
  robot.group.position.copy(player.position)
  robot.group.rotation.y = player.heading
  robot.update(dt, player.speed01, player.grounded, player.heightAboveGround)

  if (input.consumeInteract()) tryInteract()

  /* camera */
  if (cinematic) {
    updateCinematic(dt)
  } else {
    cam.update(dt, player.position)
  }

  /* world + audio */
  world.update(dt, time, player.position, engine.camera.position)
  const zoneIdx = ZONE_CENTERS.reduce(
    (best, c, i) => (Math.abs(player.position.y - c) < Math.abs(player.position.y - ZONE_CENTERS[best]) ? i : best),
    0,
  )
  audio.update(zoneIdx)
  robot.setAntennaColor(ZONES[levelOfStep(Math.min(state.nextStep, STEP_COUNT))].accent)

  /* sparks */
  sparkComboTimer -= dt
  if (sparkComboTimer <= 0) sparkCombo = 0
  const collectedIds = world.sparks.update(dt, time, player.position, (i) => world.bridges[i]?.open ?? false)
  for (const id of collectedIds) {
    state.collectSpark(id)
    audio.collect(sparkCombo)
    sparkCombo++
    sparkComboTimer = 3
    world.particles.spawn(player.position.clone().add(new THREE.Vector3(0, 1.2, 0)), 0xffd66b, 14, 3.5, -4, 0.8, 0.4)
  }

  /* interact prompt + objective arrow */
  updatePrompt()
  updateEdgeArrow()
})

function updatePrompt(): void {
  if (!playing || lessonModal.isOpen || screens.isOpen || cinematic) {
    hud.hidePrompt()
    return
  }
  const near = nearestStation()
  if (!near || (!state.isUnlocked(near.step) && !state.isCompleted(near.step))) {
    hud.hidePrompt()
    return
  }
  const st = world.stationOf(near.step)
  proj.copy(st.worldPos).add(new THREE.Vector3(0, 4.4, 0)).project(engine.camera)
  if (proj.z > 1) {
    hud.hidePrompt()
    return
  }
  const x = (proj.x * 0.5 + 0.5) * window.innerWidth
  const y = (-proj.y * 0.5 + 0.5) * window.innerHeight
  hud.showPrompt(x, y, state.isCompleted(near.step) ? t('review') : t('learn'), input.isTouch)
}

function updateEdgeArrow(): void {
  if (!playing || lessonModal.isOpen || screens.isOpen || cinematic) {
    hud.hideEdgeArrow()
    return
  }
  const target = state.allDone ? SUMMIT_POS : world.stationOf(state.nextStep).worldPos
  if (target.distanceTo(player.position) < 14) {
    hud.hideEdgeArrow()
    return
  }
  proj.copy(target).add(new THREE.Vector3(0, 3, 0)).project(engine.camera)
  const behind = proj.z > 1
  let nx = proj.x
  let ny = proj.y
  if (behind) {
    nx = -nx
    ny = -ny
  }
  const onScreen = !behind && Math.abs(nx) < 0.86 && Math.abs(ny) < 0.8
  if (onScreen) {
    hud.hideEdgeArrow()
    return
  }
  // clamp to screen edge, keep direction
  const angle = Math.atan2(ny, nx)
  const ex = Math.cos(angle)
  const ey = Math.sin(angle)
  const scale = 0.82 / Math.max(Math.abs(ex), Math.abs(ey))
  const sx = (ex * scale * 0.5 + 0.5) * window.innerWidth
  const sy = (-ey * scale * 0.5 + 0.5) * window.innerHeight
  hud.showEdgeArrow(-angle, sx, sy)
}

/* ------------------------------------------------------------------ */
/* start                                                               */
/* ------------------------------------------------------------------ */

const hasProgress = state.save.completed.length > 0 || state.save.seenIntro
screens.showIntro(hasProgress, () => {
  audio.init()
  audio.setEnabled(state.save.sound)
  state.markIntroSeen()
  playing = true
  startCinematic()
})
syncInput()
engine.setQuality(state.save.quality)
engine.start()

/* debug hooks for automated testing */
declare global {
  interface Window {
    __game?: {
      state: GameState
      teleport: (step: number) => void
      openLesson: (step: number) => void
      completeStep: (step: number) => void
      skipIntro: () => void
    }
  }
}
window.__game = {
  state,
  teleport: (step: number) => {
    const pos = step === 0 ? islandPosition(0) : world.stationOf(step).worldPos.clone()
    player.teleport(pos.clone().add(new THREE.Vector3(2, 2, 0)), world.walkables)
  },
  openLesson: (step: number) => {
    lessonModal.open(step)
    syncInput()
  },
  completeStep: (step: number) => finishStep(step),
  skipIntro: () => {
    screens.closeCurrent(true)
    playing = true
    cinematic = null
    syncInput()
  },
}
