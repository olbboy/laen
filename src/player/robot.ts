import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { radialTexture } from '../world/textures'

/**
 * The hover-robot avatar — a boxy little mascot with side ears, glowing
 * eyes and a thruster. All procedural, all charm.
 */
export class Robot {
  readonly group = new THREE.Group()
  private body = new THREE.Group()
  private eyeL: THREE.Mesh
  private eyeR: THREE.Mesh
  private antennaTip: THREE.Mesh
  private antennaMat: THREE.MeshStandardMaterial
  private thruster: THREE.Sprite
  private shadow: THREE.Mesh
  private t = 0

  constructor() {
    const orange = new THREE.MeshStandardMaterial({ color: 0xe8674a, roughness: 0.55, metalness: 0.05 })
    const cream = new THREE.MeshStandardMaterial({ color: 0xfff3e2, roughness: 0.6 })
    const dark = new THREE.MeshStandardMaterial({ color: 0x27222e, roughness: 0.4 })

    // head (the mascot is mostly head)
    const head = new THREE.Mesh(new RoundedBoxGeometry(1.15, 0.85, 0.95, 4, 0.18), orange)
    head.position.y = 1.05
    head.castShadow = true
    this.body.add(head)

    // ears
    for (const s of [-1, 1]) {
      const ear = new THREE.Mesh(new RoundedBoxGeometry(0.18, 0.4, 0.42, 3, 0.07), orange)
      ear.position.set(s * 0.68, 1.05, 0)
      ear.castShadow = true
      this.body.add(ear)
    }

    // face panel
    const face = new THREE.Mesh(new RoundedBoxGeometry(0.82, 0.5, 0.1, 3, 0.05), dark)
    face.position.set(0, 1.03, 0.46)
    this.body.add(face)

    // eyes — bright, bloom-friendly
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xbff3ff,
      emissiveIntensity: 2.4,
      roughness: 0.2,
    })
    this.eyeL = new THREE.Mesh(new RoundedBoxGeometry(0.14, 0.24, 0.05, 2, 0.05), eyeMat)
    this.eyeL.position.set(-0.2, 1.05, 0.52)
    this.body.add(this.eyeL)
    this.eyeR = this.eyeL.clone()
    this.eyeR.position.x = 0.2
    this.body.add(this.eyeR)

    // torso
    const torso = new THREE.Mesh(new RoundedBoxGeometry(0.72, 0.5, 0.6, 3, 0.12), cream)
    torso.position.y = 0.42
    torso.castShadow = true
    this.body.add(torso)

    // belly light
    const belly = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 0.06, 12),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffc93c, emissiveIntensity: 1.6 }),
    )
    belly.rotation.x = Math.PI / 2
    belly.position.set(0, 0.42, 0.32)
    this.body.add(belly)

    // feet pads (tucked, we hover)
    for (const s of [-1, 1]) {
      const foot = new THREE.Mesh(new RoundedBoxGeometry(0.24, 0.14, 0.34, 2, 0.05), dark)
      foot.position.set(s * 0.22, 0.1, 0)
      this.body.add(foot)
    }

    // antenna
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.34, 6), dark)
    stem.position.y = 1.62
    this.body.add(stem)
    this.antennaMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x3e8dcc,
      emissiveIntensity: 2.0,
      roughness: 0.3,
    })
    this.antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), this.antennaMat)
    this.antennaTip.position.y = 1.83
    this.body.add(this.antennaTip)

    // thruster glow
    this.thruster = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: radialTexture('rgba(255,190,120,0.9)', 'rgba(255,190,120,0)'),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    )
    this.thruster.scale.setScalar(0.9)
    this.thruster.position.y = -0.05
    this.body.add(this.thruster)

    // fake blob shadow (reads even with real shadows off)
    this.shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.75, 24),
      new THREE.MeshBasicMaterial({
        map: radialTexture('rgba(20,16,28,0.4)', 'rgba(20,16,28,0)'),
        transparent: true,
        depthWrite: false,
      }),
    )
    this.shadow.rotation.x = -Math.PI / 2
    this.group.add(this.shadow)

    this.group.add(this.body)
  }

  /** Antenna glows in the color of the zone you're climbing. */
  setAntennaColor(color: THREE.Color): void {
    this.antennaMat.emissive.copy(color)
  }

  update(dt: number, speed01: number, grounded: boolean, heightAboveGround: number): void {
    this.t += dt
    // hover bob + slight forward lean with speed
    const bob = Math.sin(this.t * 4.2) * 0.08 + 0.18
    this.body.position.y = bob
    const lean = THREE.MathUtils.lerp(this.body.rotation.x, speed01 * 0.22, 1 - Math.exp(-8 * dt))
    this.body.rotation.x = lean

    // thruster flares with speed, flickers subtly
    const flicker = 0.85 + Math.sin(this.t * 31) * 0.15
    this.thruster.scale.setScalar((0.7 + speed01 * 0.7) * flicker)

    // blink every few seconds
    const blink = Math.sin(this.t * 0.9) > 0.997 ? 0.1 : 1
    this.eyeL.scale.y = blink
    this.eyeR.scale.y = blink

    // blob shadow hugs the ground
    const h = grounded ? 0 : Math.min(heightAboveGround, 6)
    this.shadow.position.y = -h + 0.02
    const shrink = THREE.MathUtils.clamp(1 - h * 0.12, 0.3, 1)
    this.shadow.scale.setScalar(shrink)
    ;(this.shadow.material as THREE.MeshBasicMaterial).opacity = shrink
  }
}
