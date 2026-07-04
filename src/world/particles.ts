import * as THREE from 'three'
import { radialTexture } from './textures'

interface Burst {
  points: THREE.Points
  velocities: Float32Array
  life: number
  maxLife: number
  gravity: number
}

/** Lightweight CPU particle bursts (collect dings, step celebrations). */
export class Particles {
  readonly group = new THREE.Group()
  private bursts: Burst[] = []
  private tex = radialTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0)', 64)

  spawn(pos: THREE.Vector3, color: number, count = 24, speed = 5, gravity = -6, life = 1.1, size = 0.5): void {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = pos.x
      positions[i * 3 + 1] = pos.y
      positions[i * 3 + 2] = pos.z
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const v = speed * (0.4 + Math.random() * 0.6)
      velocities[i * 3] = v * Math.sin(phi) * Math.cos(theta)
      velocities[i * 3 + 1] = v * Math.abs(Math.cos(phi)) * 1.2
      velocities[i * 3 + 2] = v * Math.sin(phi) * Math.sin(theta)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const mat = new THREE.PointsMaterial({
      color,
      size,
      map: this.tex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const points = new THREE.Points(geo, mat)
    this.group.add(points)
    this.bursts.push({ points, velocities, life, maxLife: life, gravity })
  }

  update(dt: number): void {
    for (let b = this.bursts.length - 1; b >= 0; b--) {
      const burst = this.bursts[b]
      burst.life -= dt
      const posAttr = burst.points.geometry.attributes.position as THREE.BufferAttribute
      const arr = posAttr.array as Float32Array
      for (let i = 0; i < arr.length; i += 3) {
        burst.velocities[i + 1] += burst.gravity * dt
        arr[i] += burst.velocities[i] * dt
        arr[i + 1] += burst.velocities[i + 1] * dt
        arr[i + 2] += burst.velocities[i + 2] * dt
      }
      posAttr.needsUpdate = true
      const mat = burst.points.material as THREE.PointsMaterial
      mat.opacity = Math.max(burst.life / burst.maxLife, 0)
      if (burst.life <= 0) {
        this.group.remove(burst.points)
        burst.points.geometry.dispose()
        mat.dispose()
        this.bursts.splice(b, 1)
      }
    }
  }
}
