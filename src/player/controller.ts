import * as THREE from 'three'
import { islandPosition } from '../game/constants'

const GRAVITY = -22
const JUMP_V = 8.2
const MAX_SPEED = 8.5
const ACCEL = 32
const STEP_TOLERANCE = 1.1

/**
 * Character physics on floating islands: raycast ground snapping,
 * edge-guarded walking (you can't wander off a cliff — but you can jump),
 * and wind-catch respawn when you fall.
 */
export class PlayerController {
  readonly position = islandPosition(0).clone().add(new THREE.Vector3(0, 2, 0))
  readonly velocity = new THREE.Vector3()
  heading = 0
  grounded = false
  private vy = 0
  private lastSafe = this.position.clone()
  private ray = new THREE.Raycaster()
  private down = new THREE.Vector3(0, -1, 0)
  private justJumped = false
  onFall?: () => void
  onJump?: () => void
  onLand?: () => void

  private groundAt(x: number, z: number, fromY: number, walkables: THREE.Object3D[]): number | null {
    this.ray.set(new THREE.Vector3(x, fromY + 2.5, z), this.down)
    this.ray.far = 60
    const hits = this.ray.intersectObjects(walkables, false)
    if (hits.length === 0) return null
    return hits[0].point.y
  }

  get speed01(): number {
    return Math.min(this.velocity.length() / MAX_SPEED, 1)
  }

  get heightAboveGround(): number {
    return this.grounded ? 0 : 3
  }

  update(
    dt: number,
    move: { x: number; y: number },
    jump: boolean,
    cameraYaw: number,
    walkables: THREE.Object3D[],
  ): void {
    // desired velocity in world space, relative to camera yaw
    const sin = Math.sin(cameraYaw)
    const cos = Math.cos(cameraYaw)
    const wishX = move.x * cos - move.y * sin
    const wishZ = -move.x * sin - move.y * cos
    const wish = new THREE.Vector3(wishX, 0, wishZ)
    if (wish.lengthSq() > 1) wish.normalize()
    wish.multiplyScalar(MAX_SPEED)

    // accelerate toward wish
    const delta = wish.clone().sub(new THREE.Vector3(this.velocity.x, 0, this.velocity.z))
    const maxDelta = ACCEL * dt
    if (delta.length() > maxDelta) delta.setLength(maxDelta)
    this.velocity.x += delta.x
    this.velocity.z += delta.z

    // face movement direction
    if (this.velocity.lengthSq() > 0.3) {
      const target = Math.atan2(this.velocity.x, this.velocity.z)
      let diff = target - this.heading
      while (diff > Math.PI) diff -= Math.PI * 2
      while (diff < -Math.PI) diff += Math.PI * 2
      this.heading += diff * (1 - Math.exp(-12 * dt))
    }

    // jumping
    if (jump && this.grounded) {
      this.vy = JUMP_V
      this.grounded = false
      this.justJumped = true
      this.onJump?.()
    }

    const stepX = this.velocity.x * dt
    const stepZ = this.velocity.z * dt

    if (this.grounded) {
      // edge-guarded walk: only move where there is ground
      const tryMove = (dx: number, dz: number): boolean => {
        const g = this.groundAt(this.position.x + dx, this.position.z + dz, this.position.y, walkables)
        if (g !== null && Math.abs(g - this.position.y) < STEP_TOLERANCE) {
          this.position.x += dx
          this.position.z += dz
          this.position.y = g
          return true
        }
        return false
      }
      if (!tryMove(stepX, stepZ)) {
        // slide along whichever axis still has ground
        const movedX = tryMove(stepX, 0)
        const movedZ = tryMove(0, stepZ)
        if (!movedX && !movedZ) {
          this.velocity.x *= 0.4
          this.velocity.z *= 0.4
        }
      }
      this.lastSafe.copy(this.position)
    } else {
      // airborne
      this.vy += GRAVITY * dt
      this.position.x += stepX
      this.position.z += stepZ
      this.position.y += this.vy * dt

      if (this.vy <= 0) {
        const g = this.groundAt(this.position.x, this.position.z, this.position.y + 2, walkables)
        if (g !== null && this.position.y <= g + 0.08) {
          this.position.y = g
          this.vy = 0
          this.grounded = true
          this.justJumped = false
          this.onLand?.()
        }
      }

      // fell off the world — the wind catches you
      if (this.position.y < this.lastSafe.y - 26) {
        this.respawn()
      }
    }

    // safety: if grounded but ground vanished (shouldn't happen), go airborne
    if (this.grounded && !this.justJumped) {
      const g = this.groundAt(this.position.x, this.position.z, this.position.y, walkables)
      if (g === null) this.grounded = false
    }
  }

  respawn(): void {
    this.position.copy(this.lastSafe).add(new THREE.Vector3(0, 1.5, 0))
    this.velocity.set(0, 0, 0)
    this.vy = 0
    this.grounded = false
    this.onFall?.()
  }

  /** Snap onto the ground once the world exists (spawn / teleport). */
  snapToGround(walkables: THREE.Object3D[]): void {
    const g = this.groundAt(this.position.x, this.position.z, this.position.y + 4, walkables)
    if (g !== null) {
      this.position.y = g
      this.grounded = true
      this.lastSafe.copy(this.position)
    }
  }

  teleport(pos: THREE.Vector3, walkables: THREE.Object3D[]): void {
    this.position.copy(pos)
    this.velocity.set(0, 0, 0)
    this.vy = 0
    this.snapToGround(walkables)
  }
}
