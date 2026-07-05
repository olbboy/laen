import * as THREE from 'three'
import { pillarTexture, radialTexture } from './textures'

/** The central column of light the whole spiral winds around. */
export class Beacon {
  readonly group = new THREE.Group()
  private rings: THREE.Mesh[] = []
  private core: THREE.Mesh
  private coreMat: THREE.MeshStandardMaterial
  private halo: THREE.Sprite
  private ignited = false

  constructor(SUMMIT_POS: THREE.Vector3) {
    const pillarMat = new THREE.MeshBasicMaterial({
      map: pillarTexture('rgba(255,236,200,0.5)'),
      color: 0xffe9c4,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.6, SUMMIT_POS.y + 20, 20, 1, true), pillarMat)
    pillar.position.y = (SUMMIT_POS.y + 20) / 2 - 10
    this.group.add(pillar)

    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffd9a0, transparent: true, opacity: 0.65 })
    for (let i = 0; i < 6; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(3 + (i % 3), 0.1, 8, 48), ringMat)
      ring.position.y = 6 + i * 13
      ring.rotation.x = Math.PI / 2
      ring.userData.speed = 0.2 + (i % 3) * 0.15
      this.rings.push(ring)
      this.group.add(ring)
    }

    this.coreMat = new THREE.MeshStandardMaterial({
      color: 0xfff3da,
      emissive: 0xffca66,
      emissiveIntensity: 0.7,
      roughness: 0.2,
      flatShading: true,
    })
    this.core = new THREE.Mesh(new THREE.IcosahedronGeometry(2.4, 0), this.coreMat)
    this.core.position.copy(SUMMIT_POS)
    this.group.add(this.core)

    this.halo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: radialTexture('rgba(255,214,140,0.75)', 'rgba(255,214,140,0)'),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    )
    this.halo.scale.setScalar(14)
    this.halo.position.copy(SUMMIT_POS)
    this.group.add(this.halo)
  }

  ignite(): void {
    this.ignited = true
    this.coreMat.emissiveIntensity = 3.2
    this.halo.scale.setScalar(30)
  }

  update(dt: number, t: number): void {
    for (const r of this.rings) {
      r.rotation.z += dt * (r.userData.speed as number)
      r.position.y += Math.sin(t * 0.6 + r.position.y) * dt * 0.4
    }
    this.core.rotation.y += dt * (this.ignited ? 1.4 : 0.3)
    this.core.rotation.x += dt * 0.12
    const pulse = this.ignited ? 1 + Math.sin(t * 3) * 0.12 : 1 + Math.sin(t * 1.2) * 0.05
    this.core.scale.setScalar(pulse)
  }
}
