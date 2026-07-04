import * as THREE from 'three'
import { islandPosition, zoneOfStep } from '../game/constants'
import { labelTexture, pillarTexture, radialTexture } from './textures'

export type StationStatus = 'locked' | 'next' | 'done'

const GOLD = new THREE.Color(0xf7c948)
const LOCKED = new THREE.Color(0x9a94ae)

/**
 * A learning station: pedestal + floating crystal + label. The current
 * ("next") station projects a light pillar into the sky as a guide.
 */
export class Station {
  readonly group = new THREE.Group()
  readonly worldPos: THREE.Vector3
  status: StationStatus = 'locked'

  private crystal: THREE.Mesh
  private core: THREE.Mesh
  private crystalMat: THREE.MeshStandardMaterial
  private coreMat: THREE.MeshStandardMaterial
  private ring: THREE.Mesh
  private ringMat: THREE.MeshBasicMaterial
  private pillar: THREE.Mesh
  private pillarMat: THREE.MeshBasicMaterial
  private halo: THREE.Sprite
  private label: THREE.Sprite
  private accent: THREE.Color

  constructor(readonly step: number) {
    const zone = zoneOfStep(step)
    this.accent = zone.accent.clone()

    const islandC = islandPosition(step)
    // place the monument off-center, toward the world center (inner rim)
    const inward = islandC.clone().setY(0).normalize().multiplyScalar(-3.4)
    this.group.position.set(islandC.x + inward.x, islandC.y, islandC.z + inward.z)
    this.worldPos = this.group.position.clone()

    // pedestal: two stacked discs
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0xcfc8bd, roughness: 0.9, flatShading: true })
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.95, 0.5, 8), stoneMat)
    base.position.y = 0.25
    base.castShadow = true
    base.receiveShadow = true
    this.group.add(base)
    const mid = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.35, 0.45, 8), stoneMat)
    mid.position.y = 0.7
    mid.castShadow = true
    this.group.add(mid)

    // floating crystal + bright inner core
    this.crystalMat = new THREE.MeshStandardMaterial({
      color: LOCKED,
      emissive: LOCKED,
      emissiveIntensity: 0.25,
      roughness: 0.25,
      transparent: true,
      opacity: 0.92,
      flatShading: true,
    })
    this.crystal = new THREE.Mesh(new THREE.OctahedronGeometry(1.0, 0), this.crystalMat)
    this.crystal.scale.y = 1.65
    this.crystal.position.y = 3.1
    this.crystal.castShadow = true
    this.group.add(this.crystal)

    this.coreMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: LOCKED,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    })
    this.core = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), this.coreMat)
    this.core.scale.y = 1.65
    this.core.position.y = 3.1
    this.group.add(this.core)

    // orbit ring
    this.ringMat = new THREE.MeshBasicMaterial({ color: LOCKED, transparent: true, opacity: 0.5 })
    this.ring = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.05, 8, 40), this.ringMat)
    this.ring.position.y = 3.1
    this.ring.rotation.x = Math.PI / 2.4
    this.group.add(this.ring)

    // guide pillar (visible only for the "next" station)
    this.pillarMat = new THREE.MeshBasicMaterial({
      map: pillarTexture('rgba(255,255,255,0.55)'),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })
    this.pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.85, 42, 16, 1, true), this.pillarMat)
    this.pillar.position.y = 21
    this.group.add(this.pillar)

    // soft halo sprite behind the crystal
    const haloMat = new THREE.SpriteMaterial({
      map: radialTexture('rgba(255,240,210,0.6)', 'rgba(255,240,210,0)'),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    this.halo = new THREE.Sprite(haloMat)
    this.halo.scale.setScalar(6)
    this.halo.position.y = 3.1
    this.group.add(this.halo)

    // label card
    const labelMat = new THREE.SpriteMaterial({ map: labelTexture(String(step).padStart(2, '0'), '', '#9a94ae'), transparent: true })
    this.label = new THREE.Sprite(labelMat)
    this.label.scale.set(4.4, 1.44, 1)
    this.label.position.y = 5.6
    this.group.add(this.label)
  }

  setLabel(title: string): void {
    const status = this.status
    const accent = status === 'done' ? '#c99a17' : status === 'next' ? `#${this.accent.getHexString()}` : '#9a94ae'
    const mat = this.label.material as THREE.SpriteMaterial
    mat.map?.dispose()
    mat.map = labelTexture(String(this.step).padStart(2, '0'), title, accent)
    mat.needsUpdate = true
  }

  setStatus(status: StationStatus, title: string): void {
    this.status = status
    const color = status === 'done' ? GOLD : status === 'next' ? this.accent : LOCKED
    this.crystalMat.color.copy(color)
    this.crystalMat.emissive.copy(color)
    this.crystalMat.emissiveIntensity = status === 'locked' ? 0.2 : status === 'next' ? 1.15 : 0.75
    this.coreMat.emissive.copy(status === 'locked' ? LOCKED : color)
    this.coreMat.emissiveIntensity = status === 'next' ? 2.2 : status === 'done' ? 1.4 : 0.5
    this.ringMat.color.copy(color)
    this.ringMat.opacity = status === 'locked' ? 0.25 : 0.7
    this.pillarMat.color = new THREE.Color(status === 'next' ? color : color).clone() as THREE.Color
    this.pillarMat.opacity = status === 'next' ? 0.4 : 0
    const haloMat = this.halo.material as THREE.SpriteMaterial
    haloMat.color = color.clone()
    haloMat.opacity = status === 'locked' ? 0.25 : 0.8
    this.setLabel(title)
  }

  update(dt: number, t: number): void {
    const bob = Math.sin(t * 1.4 + this.step) * 0.14
    this.crystal.position.y = 3.1 + bob
    this.core.position.y = 3.1 + bob
    this.halo.position.y = 3.1 + bob
    const speed = this.status === 'next' ? 1.1 : 0.35
    this.crystal.rotation.y += dt * speed
    this.core.rotation.y -= dt * speed * 1.6
    this.ring.rotation.z += dt * 0.5
    if (this.status === 'next') {
      this.pillarMat.opacity = 0.26 + Math.sin(t * 2.4) * 0.08
      const s = 1 + Math.sin(t * 2.4) * 0.06
      this.ring.scale.setScalar(s)
    }
  }
}
