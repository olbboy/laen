import * as THREE from 'three'
import { mulberry32 } from '../game/constants'
import type { CourseRuntime } from '../game/runtime'
import { radialTexture } from './textures'
import type { Bridge } from './bridges'

interface Spark {
  id: string
  group: THREE.Group
  pos: THREE.Vector3
  collected: boolean
  /** only collectible once its bridge is open (bridge sparks) */
  bridgeIndex: number | null
  phase: number
}

/**
 * Collectible glowing sparks scattered along bridges and islands.
 * Nearby sparks are magnetically pulled to the player, then collected.
 */
export class Sparks {
  readonly group = new THREE.Group()
  private sparks: Spark[] = []
  total = 0

  constructor(bridges: Bridge[], isCollected: (id: string) => boolean, rt: CourseRuntime) {
    const geo = new THREE.OctahedronGeometry(0.22, 0)
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffd66b,
      emissive: 0xffc93c,
      emissiveIntensity: 1.6,
      roughness: 0.3,
    })
    const haloTex = radialTexture('rgba(255,214,107,0.7)', 'rgba(255,214,107,0)')

    const make = (id: string, pos: THREE.Vector3, bridgeIndex: number | null) => {
      this.total++
      if (isCollected(id)) return
      const g = new THREE.Group()
      const mesh = new THREE.Mesh(geo, mat)
      g.add(mesh)
      const halo = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: haloTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
      )
      halo.scale.setScalar(1.15)
      g.add(halo)
      g.position.copy(pos)
      this.group.add(g)
      this.sparks.push({ id, group: g, pos: pos.clone(), collected: false, bridgeIndex, phase: Math.random() * Math.PI * 2 })
    }

    // along each bridge
    bridges.forEach((b, i) => {
      for (const f of [0.3, 0.5, 0.7]) {
        const p = b.curve.getPointAt(f)
        make(`b${i}-${f}`, new THREE.Vector3(p.x, p.y + 1.1, p.z), i)
      }
    })

    // a few on each island
    for (let i = 0; i < rt.islandCount; i++) {
      const rnd = mulberry32(500 + i * 31)
      const c = rt.islandPosition(i)
      const r = rt.islandRadius(i)
      for (let k = 0; k < 2; k++) {
        const a = rnd() * Math.PI * 2
        const d = r * (0.45 + rnd() * 0.35)
        make(`i${i}-${k}`, new THREE.Vector3(c.x + Math.cos(a) * d, c.y + 1.0, c.z + Math.sin(a) * d), null)
      }
    }
  }

  /** Returns ids of sparks collected this frame. */
  update(dt: number, t: number, playerPos: THREE.Vector3, bridgeOpen: (i: number) => boolean): string[] {
    const collected: string[] = []
    for (const s of this.sparks) {
      if (s.collected) continue
      s.group.rotation.y += dt * 2
      s.group.position.y = s.pos.y + Math.sin(t * 2 + s.phase) * 0.16

      const reachable = s.bridgeIndex === null || bridgeOpen(s.bridgeIndex)
      if (!reachable) continue
      const dist = s.group.position.distanceTo(playerPos)
      if (dist < 3.2 && dist > 1.0) {
        // magnet
        s.group.position.lerp(playerPos.clone().add(new THREE.Vector3(0, 1, 0)), 1 - Math.exp(-6 * dt))
        s.pos.copy(s.group.position).setY(s.pos.y)
      }
      if (dist < 1.1) {
        s.collected = true
        this.group.remove(s.group)
        collected.push(s.id)
      }
    }
    return collected
  }
}
