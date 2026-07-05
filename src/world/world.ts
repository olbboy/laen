import * as THREE from 'three'
import type { CourseRuntime } from '../game/runtime'
import { buildIsland, type Island } from './islands'
import { buildBridge, type Bridge } from './bridges'
import { Station } from './stations'
import { Sparks } from './sparks'
import { Particles } from './particles'
import { Beacon } from './beacon'
import { Sky } from './sky'

/**
 * Owns everything in the 3D scene except the player: terrain, bridges,
 * stations, lights, sky, pickups and ambient life. Fully derived from
 * the loaded course's runtime.
 */
export class World {
  readonly islands: Island[] = []
  readonly bridges: Bridge[] = []
  readonly stations: Station[] = []
  readonly sparks: Sparks
  readonly particles = new Particles()
  readonly beacon: Beacon
  readonly walkables: THREE.Object3D[] = []

  private sky: Sky
  private hemi: THREE.HemisphereLight
  private sun: THREE.DirectionalLight
  private dust: THREE.Points
  private scene: THREE.Scene

  constructor(
    scene: THREE.Scene,
    readonly rt: CourseRuntime,
    isCompleted: (step: number) => boolean,
    isSparkCollected: (id: string) => boolean,
  ) {
    this.scene = scene
    this.sky = new Sky(rt)
    scene.fog = new THREE.Fog(rt.zones[0].skyBottom.clone(), 70, 260)
    scene.add(this.sky.group)

    this.hemi = new THREE.HemisphereLight(0xcfe8ff, 0xe8d2b0, 0.9)
    scene.add(this.hemi)
    this.sun = new THREE.DirectionalLight(0xfff3e0, 2.0)
    this.sun.castShadow = true
    this.sun.shadow.mapSize.set(2048, 2048)
    this.sun.shadow.camera.near = 1
    this.sun.shadow.camera.far = 140
    const S = 34
    this.sun.shadow.camera.left = -S
    this.sun.shadow.camera.right = S
    this.sun.shadow.camera.top = S
    this.sun.shadow.camera.bottom = -S
    this.sun.shadow.bias = -0.0004
    scene.add(this.sun)
    scene.add(this.sun.target)

    // islands
    for (let i = 0; i < rt.islandCount; i++) {
      const island = buildIsland(i, rt)
      this.islands.push(island)
      this.walkables.push(island.walkable)
      scene.add(island.group)
    }

    // bridges: island i → i+1; bridge 0 is open from the start
    for (let i = 0; i < rt.islandCount - 1; i++) {
      const bridge = buildBridge(i, rt)
      this.bridges.push(bridge)
      scene.add(bridge.group)
      const open = i === 0 || isCompleted(i)
      bridge.setOpen(open, false)
      if (open) this.walkables.push(bridge.deck)
    }

    // stations on islands 1..n
    for (let s = 1; s <= rt.stepCount; s++) {
      const station = new Station(s, rt)
      this.stations.push(station)
      scene.add(station.group)
    }

    this.beacon = new Beacon(rt.summitPos)
    scene.add(this.beacon.group)
    scene.add(this.particles.group)

    this.sparks = new Sparks(this.bridges, isSparkCollected, rt)
    scene.add(this.sparks.group)

    // ambient dust motes drifting around the camera
    const dustCount = 220
    const dustPos = new Float32Array(dustCount * 3)
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 90
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 50
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 90
    }
    const dustGeo = new THREE.BufferGeometry()
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
    this.dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        color: 0xfff2d8,
        size: 0.18,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    )
    scene.add(this.dust)
  }

  /** Opens the bridge that follows `step` (from island `step` to `step+1`). */
  openBridgeAfter(step: number, animate: boolean): void {
    const bridge = this.bridges[step]
    if (!bridge || bridge.open) return
    bridge.setOpen(true, animate)
    this.walkables.push(bridge.deck)
  }

  stationOf(step: number): Station {
    return this.stations[step - 1]
  }

  update(dt: number, t: number, playerPos: THREE.Vector3, cameraPos: THREE.Vector3): void {
    const { fog, sun } = this.sky.update(dt, cameraPos.y, cameraPos)
    ;(this.scene.fog as THREE.Fog).color.copy(fog)
    this.sun.color.copy(sun)

    const { a, b, t: zt } = this.rt.zoneBlendAt(cameraPos.y)
    this.hemi.color.copy(a.skyTop).lerp(b.skyTop, zt).lerp(new THREE.Color(0xffffff), 0.5)
    this.hemi.groundColor.copy(fog).multiplyScalar(0.9)

    // sun follows the player so the shadow frustum stays tight
    this.sun.position.set(playerPos.x + 26, playerPos.y + 42, playerPos.z + 18)
    this.sun.target.position.copy(playerPos)

    for (const st of this.stations) st.update(dt, t)
    for (const br of this.bridges) br.update(dt, t)
    this.beacon.update(dt, t)
    this.particles.update(dt)

    // islands: gentle bob of orbiter rocks
    for (const isl of this.islands) {
      for (const child of isl.group.children) {
        if (child.userData.orbiter) {
          child.position.y = (child.userData.bobBase as number) + Math.sin(t * 0.8 + (child.userData.bobPhase as number)) * 0.4
          child.rotation.y += dt * 0.2
        }
      }
    }

    // dust follows the camera, wrapping within its box
    this.dust.position.set(cameraPos.x, cameraPos.y, cameraPos.z)
    this.dust.rotation.y += dt * 0.01
  }
}
