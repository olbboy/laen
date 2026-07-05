import * as THREE from 'three'
import type { CourseRuntime } from '../game/runtime'

export interface Bridge {
  group: THREE.Group
  deck: THREE.Mesh
  curve: THREE.CatmullRomCurve3
  /** true once walkable */
  open: boolean
  setOpen(open: boolean, animate: boolean): void
  update(dt: number, t: number): void
}

const UP = new THREE.Vector3(0, 1, 0)

/**
 * A curved ribbon bridge from island `i` to island `i+1`, with glowing
 * rails. Locked bridges render as faint ghosts and are not walkable.
 */
export function buildBridge(i: number, rt: CourseRuntime): Bridge {
  const from = rt.islandPosition(i)
  const to = rt.islandPosition(i + 1)
  const zone = rt.zoneOfStep(Math.min(i + 1, rt.stepCount))

  // path: leave the rim of island i, arc outward, land on rim of i+1
  const dir = to.clone().sub(from)
  dir.y = 0
  dir.normalize()
  const start = from.clone().addScaledVector(dir, rt.islandRadius(i) - 0.6)
  start.y = from.y
  const backDir = from.clone().sub(to)
  backDir.y = 0
  backDir.normalize()
  const end = to.clone().addScaledVector(backDir, rt.islandRadius(i + 1) - 0.6)
  end.y = to.y

  const mid1 = start.clone().lerp(end, 0.33)
  const mid2 = start.clone().lerp(end, 0.66)
  // bow outward from the world center for a graceful arc
  const outward = mid1.clone().setY(0).normalize()
  mid1.addScaledVector(outward, 2.4)
  mid2.addScaledVector(outward, 2.4)
  mid1.y = THREE.MathUtils.lerp(start.y, end.y, 0.3) - 0.4
  mid2.y = THREE.MathUtils.lerp(start.y, end.y, 0.72) + 0.2

  const curve = new THREE.CatmullRomCurve3([start, mid1, mid2, end], false, 'catmullrom', 0.6)

  const group = new THREE.Group()

  // --- ribbon deck ------------------------------------------------
  const SEGMENTS = 42
  const WIDTH = 3.2
  const points = curve.getSpacedPoints(SEGMENTS)
  const verts: number[] = []
  const norms: number[] = []
  const uvs: number[] = []
  const idx: number[] = []
  const side = new THREE.Vector3()
  const tangent = new THREE.Vector3()
  for (let s = 0; s <= SEGMENTS; s++) {
    const p = points[s]
    const pPrev = points[Math.max(0, s - 1)]
    const pNext = points[Math.min(SEGMENTS, s + 1)]
    tangent.subVectors(pNext, pPrev).normalize()
    side.crossVectors(tangent, UP).normalize()
    verts.push(p.x + side.x * WIDTH * 0.5, p.y, p.z + side.z * WIDTH * 0.5)
    verts.push(p.x - side.x * WIDTH * 0.5, p.y, p.z - side.z * WIDTH * 0.5)
    norms.push(0, 1, 0, 0, 1, 0)
    uvs.push(0, s / SEGMENTS, 1, s / SEGMENTS)
    if (s < SEGMENTS) {
      const a = s * 2
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
    }
  }
  const deckGeo = new THREE.BufferGeometry()
  deckGeo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  deckGeo.setAttribute('normal', new THREE.Float32BufferAttribute(norms, 3))
  deckGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  deckGeo.setIndex(idx)

  const deckMat = new THREE.MeshStandardMaterial({
    color: 0xf2ecdd,
    roughness: 0.75,
    transparent: true,
    opacity: 0.12,
    side: THREE.DoubleSide,
  })
  const deck = new THREE.Mesh(deckGeo, deckMat)
  deck.receiveShadow = true
  group.add(deck)

  // --- glowing rails ----------------------------------------------
  const railMat = new THREE.MeshBasicMaterial({
    color: zone.accent,
    transparent: true,
    opacity: 0.1,
  })
  for (const offset of [WIDTH * 0.5, -WIDTH * 0.5]) {
    const railPts: THREE.Vector3[] = []
    for (let s = 0; s <= SEGMENTS; s += 2) {
      const p = points[s]
      const pPrev = points[Math.max(0, s - 1)]
      const pNext = points[Math.min(SEGMENTS, s + 1)]
      tangent.subVectors(pNext, pPrev).normalize()
      side.crossVectors(tangent, UP).normalize()
      railPts.push(new THREE.Vector3(p.x + side.x * offset, p.y + 0.12, p.z + side.z * offset))
    }
    const railCurve = new THREE.CatmullRomCurve3(railPts)
    const rail = new THREE.Mesh(new THREE.TubeGeometry(railCurve, 30, 0.07, 6), railMat)
    group.add(rail)
  }

  // --- floating support stones under the deck ---------------------
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x8d87a8, roughness: 1, flatShading: true })
  for (const f of [0.28, 0.55, 0.8]) {
    const p = curve.getPointAt(f)
    const stone = new THREE.Mesh(new THREE.DodecahedronGeometry(0.8, 0), stoneMat)
    stone.position.set(p.x, p.y - 2.2 - f, p.z)
    stone.userData.bobPhase = f * 9
    stone.userData.bobBase = stone.position.y
    stone.userData.orbiter = true
    group.add(stone)
  }

  let openState = false
  let animT = -1

  const bridge: Bridge = {
    group,
    deck,
    curve,
    get open() {
      return openState
    },
    set open(v: boolean) {
      openState = v
    },
    setOpen(open: boolean, animate: boolean) {
      openState = open
      if (open && animate) {
        animT = 0
      } else {
        deckMat.opacity = open ? 1 : 0.12
        deckMat.transparent = !open
        railMat.opacity = open ? 0.9 : 0.1
      }
    },
    update(dt: number, t: number) {
      // shimmer while locked; brighten while unlocking
      if (animT >= 0) {
        animT += dt
        const k = Math.min(animT / 1.2, 1)
        deckMat.opacity = THREE.MathUtils.lerp(0.12, 1, k)
        railMat.opacity = THREE.MathUtils.lerp(0.1, 0.9, k) + Math.sin(t * 20) * 0.08 * (1 - k)
        if (k >= 1) {
          animT = -1
          deckMat.transparent = false
        }
      } else if (!openState) {
        railMat.opacity = 0.08 + Math.sin(t * 2.2 + i) * 0.04
      }
      for (const child of group.children) {
        if (child.userData.orbiter) {
          child.position.y = (child.userData.bobBase as number) + Math.sin(t * 0.7 + (child.userData.bobPhase as number)) * 0.35
          child.rotation.y += dt * 0.15
        }
      }
    },
  }
  return bridge
}
