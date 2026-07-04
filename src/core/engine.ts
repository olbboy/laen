import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'

export class Engine {
  readonly renderer: THREE.WebGLRenderer
  readonly scene = new THREE.Scene()
  readonly camera: THREE.PerspectiveCamera
  private composer: EffectComposer
  private bloom: UnrealBloomPass
  private clock = new THREE.Clock()
  private updaters: Array<(dt: number, t: number) => void> = []
  private quality: 'high' | 'low' = 'high'

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    this.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 900)
    this.camera.position.set(0, 40, 80)

    const size = new THREE.Vector2()
    this.renderer.getSize(size)
    const rt = new THREE.WebGLRenderTarget(1, 1, { samples: 4, type: THREE.HalfFloatType })
    this.composer = new EffectComposer(this.renderer, rt)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.55, 0.65, 0.86)
    this.composer.addPass(this.bloom)
    this.composer.addPass(new OutputPass())

    window.addEventListener('resize', () => this.resize())
    this.resize()
  }

  setQuality(q: 'high' | 'low'): void {
    this.quality = q
    this.renderer.shadowMap.enabled = q === 'high'
    // force shadow refresh on material recompile
    this.scene.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | undefined
      if (m) m.needsUpdate = true
    })
    this.resize()
  }

  private resize(): void {
    const w = window.innerWidth
    const h = window.innerHeight
    const pr = Math.min(window.devicePixelRatio || 1, this.quality === 'high' ? 1.75 : 1)
    this.renderer.setPixelRatio(pr)
    this.renderer.setSize(w, h)
    this.composer.setPixelRatio(pr)
    this.composer.setSize(w, h)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  onFrame(cb: (dt: number, t: number) => void): void {
    this.updaters.push(cb)
  }

  start(): void {
    this.renderer.setAnimationLoop(() => {
      const dt = Math.min(this.clock.getDelta(), 0.05)
      const t = this.clock.elapsedTime
      for (const u of this.updaters) u(dt, t)
      if (this.quality === 'high') {
        this.composer.render()
      } else {
        this.renderer.render(this.scene, this.camera)
      }
    })
  }
}
