import * as THREE from 'three'

/** Smooth third-person chase camera with drag-orbit and wheel zoom. */
export class ChaseCamera {
  yaw: number
  pitch = 0.42
  distance = 11
  private currentPos = new THREE.Vector3()
  private currentLook = new THREE.Vector3()
  private initialized = false

  constructor(private camera: THREE.PerspectiveCamera, initialYaw = 0) {
    this.yaw = initialYaw
  }

  applyDrag(dx: number, dy: number, zoom: number): void {
    this.yaw -= dx * 0.0052
    this.pitch = THREE.MathUtils.clamp(this.pitch + dy * 0.004, 0.05, 1.15)
    this.distance = THREE.MathUtils.clamp(this.distance + zoom * 0.012, 6.5, 18)
  }

  update(dt: number, target: THREE.Vector3): void {
    const offset = new THREE.Vector3(
      Math.sin(this.yaw) * Math.cos(this.pitch),
      Math.sin(this.pitch),
      Math.cos(this.yaw) * Math.cos(this.pitch),
    ).multiplyScalar(this.distance)

    const desired = target.clone().add(offset).add(new THREE.Vector3(0, 1.4, 0))
    const look = target.clone().add(new THREE.Vector3(0, 1.7, 0))

    if (!this.initialized) {
      this.currentPos.copy(desired)
      this.currentLook.copy(look)
      this.initialized = true
    }
    const k = 1 - Math.exp(-7 * dt)
    this.currentPos.lerp(desired, k)
    this.currentLook.lerp(look, 1 - Math.exp(-10 * dt))

    this.camera.position.copy(this.currentPos)
    this.camera.lookAt(this.currentLook)
  }

  /** For cinematic moments: hard-set the camera, keep smoothing state. */
  setImmediate(pos: THREE.Vector3, look: THREE.Vector3): void {
    this.currentPos.copy(pos)
    this.currentLook.copy(look)
    this.initialized = true
    this.camera.position.copy(pos)
    this.camera.lookAt(look)
  }
}
