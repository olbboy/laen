import * as THREE from 'three'
import { zoneBlendAt, mulberry32 } from '../game/constants'

export class Sky {
  readonly group = new THREE.Group()
  private uniforms: { topColor: { value: THREE.Color }; bottomColor: { value: THREE.Color } }
  private stars: THREE.Points
  private starMat: THREE.PointsMaterial
  private clouds: THREE.Group

  constructor() {
    this.uniforms = {
      topColor: { value: new THREE.Color(0x6fb3e8) },
      bottomColor: { value: new THREE.Color(0xf6ead6) },
    }
    const skyMat = new THREE.ShaderMaterial({
      uniforms: this.uniforms as unknown as { [k: string]: THREE.IUniform },
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          vec4 pos = modelMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * viewMatrix * pos;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        varying vec3 vDir;
        void main() {
          float h = clamp(vDir.y * 0.62 + 0.34, 0.0, 1.0);
          vec3 col = mix(bottomColor, topColor, pow(h, 1.1));
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    })
    const sky = new THREE.Mesh(new THREE.SphereGeometry(780, 24, 16), skyMat)
    sky.frustumCulled = false
    this.group.add(sky)

    // stars — fade in at dusk altitudes
    const rnd = mulberry32(1234)
    const starCount = 700
    const positions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const theta = rnd() * Math.PI * 2
      const phi = Math.acos(1 - rnd() * 0.85) // bias to upper dome
      const r = 700
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.cos(phi)
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.starMat = new THREE.PointsMaterial({
      color: 0xfff6e0,
      size: 2.2,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      fog: false,
    })
    this.stars = new THREE.Points(starGeo, this.starMat)
    this.group.add(this.stars)

    // drifting low-poly clouds
    this.clouds = new THREE.Group()
    const cloudMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, fog: false })
    for (let i = 0; i < 18; i++) {
      const cluster = new THREE.Group()
      const blobs = 3 + Math.floor(rnd() * 3)
      for (let b = 0; b < blobs; b++) {
        const s = 3 + rnd() * 5
        const blob = new THREE.Mesh(new THREE.IcosahedronGeometry(s, 0), cloudMat)
        blob.position.set((b - blobs / 2) * s * 1.1, (rnd() - 0.5) * 2, (rnd() - 0.5) * 4)
        blob.scale.y = 0.42
        cluster.add(blob)
      }
      const angle = rnd() * Math.PI * 2
      const radius = 90 + rnd() * 160
      cluster.position.set(Math.cos(angle) * radius, 4 + rnd() * 85, Math.sin(angle) * radius)
      cluster.userData.speed = 0.004 + rnd() * 0.008
      this.clouds.add(cluster)
    }
    this.group.add(this.clouds)
  }

  /** Blend palette to the camera's altitude; returns colors others need. */
  update(dt: number, cameraY: number, cameraPos: THREE.Vector3): { fog: THREE.Color; sun: THREE.Color; grassA: THREE.Color } {
    const { a, b, t } = zoneBlendAt(cameraY)
    this.uniforms.topColor.value.copy(a.skyTop).lerp(b.skyTop, t)
    this.uniforms.bottomColor.value.copy(a.skyBottom).lerp(b.skyBottom, t)
    this.starMat.opacity = THREE.MathUtils.lerp(a.starAlpha, b.starAlpha, t) * 0.9
    this.group.position.set(cameraPos.x, 0, cameraPos.z)

    for (const c of this.clouds.children) {
      const speed = (c.userData.speed as number) ?? 0.005
      const p = c.position
      const angle = Math.atan2(p.z, p.x) + speed * dt
      const radius = Math.hypot(p.x, p.z)
      p.set(Math.cos(angle) * radius, p.y, Math.sin(angle) * radius)
    }

    const fog = a.skyBottom.clone().lerp(b.skyBottom, t)
    const sun = a.sun.clone().lerp(b.sun, t)
    const grassA = a.grass.clone().lerp(b.grass, t)
    return { fog, sun, grassA }
  }
}
