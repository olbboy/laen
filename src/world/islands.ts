import * as THREE from 'three'
import { mulberry32 } from '../game/constants'
import type { CourseRuntime, Zone } from '../game/runtime'
import type { Flavor } from '../content/types'

export interface Island {
  group: THREE.Group
  walkable: THREE.Mesh
  center: THREE.Vector3
  radius: number
}

/**
 * Builds one floating island: an organically jittered grass disc, a rocky
 * underside cone, rim glow, and theme-flavored decorations.
 */
export function buildIsland(i: number, rt: CourseRuntime): Island {
  const rnd = mulberry32(1000 + i * 77)
  const zone = rt.zoneOfIsland(i)
  const center = rt.islandPosition(i)
  const radius = rt.islandRadius(i)

  const group = new THREE.Group()
  group.position.copy(center)

  // --- grass top -------------------------------------------------
  const topGeo = new THREE.CylinderGeometry(radius, radius * 0.94, 1.4, 26, 1)
  jitterRim(topGeo, rnd, 0.1)
  const topMat = new THREE.MeshStandardMaterial({
    color: zone.grass,
    roughness: 0.95,
    flatShading: true,
  })
  const top = new THREE.Mesh(topGeo, topMat)
  top.position.y = -0.7
  top.receiveShadow = true
  group.add(top)

  // --- rocky underside -------------------------------------------
  const rockGeo = new THREE.ConeGeometry(radius * 0.92, radius * 1.5, 9, 3)
  const pos = rockGeo.attributes.position
  for (let v = 0; v < pos.count; v++) {
    const x = pos.getX(v)
    const z = pos.getZ(v)
    const y = pos.getY(v)
    if (Math.abs(y) < radius * 0.74) {
      const n = 1 + (rnd() - 0.5) * 0.34
      pos.setX(v, x * n)
      pos.setZ(v, z * n)
    }
  }
  rockGeo.computeVertexNormals()
  const rockMat = new THREE.MeshStandardMaterial({ color: zone.rock, roughness: 1, flatShading: true })
  const rock = new THREE.Mesh(rockGeo, rockMat)
  rock.rotation.x = Math.PI
  rock.position.y = -radius * 0.75 - 1.2
  group.add(rock)

  // --- rim glow ring ----------------------------------------------
  const ringMat = new THREE.MeshBasicMaterial({
    color: zone.accent,
    transparent: true,
    opacity: 0.5,
  })
  const ring = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.99, 0.09, 8, 48), ringMat)
  ring.rotation.x = Math.PI / 2
  ring.position.y = 0.02
  group.add(ring)

  // --- decorations -------------------------------------------------
  // keep clear of the station monument (placed 3.4 units inward)
  const stationLocal = i === 0 ? null : center.clone().setY(0).normalize().multiplyScalar(-3.4)
  decorate(group, rnd, radius, zone, stationLocal)

  // small drifting rocks around the island
  const orbiterMat = new THREE.MeshStandardMaterial({ color: zone.rock, roughness: 1, flatShading: true })
  for (let k = 0; k < 3; k++) {
    const s = 0.35 + rnd() * 0.6
    const orb = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), orbiterMat)
    const a = rnd() * Math.PI * 2
    const d = radius + 2.5 + rnd() * 3
    orb.position.set(Math.cos(a) * d, -1 - rnd() * 4, Math.sin(a) * d)
    orb.userData.bobPhase = rnd() * Math.PI * 2
    orb.userData.bobBase = orb.position.y
    orb.userData.orbiter = true
    group.add(orb)
  }

  return { group, walkable: top, center, radius }
}

function jitterRim(geo: THREE.CylinderGeometry, rnd: () => number, amount: number): void {
  const pos = geo.attributes.position
  const jitterByAngle = new Map<number, number>()
  for (let v = 0; v < pos.count; v++) {
    const x = pos.getX(v)
    const z = pos.getZ(v)
    const r = Math.hypot(x, z)
    if (r < 0.001) continue
    const key = Math.round(Math.atan2(z, x) * 100)
    if (!jitterByAngle.has(key)) jitterByAngle.set(key, 1 + (rnd() - 0.5) * 2 * amount)
    const n = jitterByAngle.get(key)!
    pos.setX(v, x * n)
    pos.setZ(v, z * n)
  }
  geo.computeVertexNormals()
}

/* ------------------------------------------------------------------ */
/* Decoration flavors                                                  */
/* ------------------------------------------------------------------ */

function decorate(
  group: THREE.Group,
  rnd: () => number,
  radius: number,
  zone: Zone,
  avoid: THREE.Vector3 | null,
): void {
  const place = (maxR: number) => {
    for (let attempt = 0; attempt < 8; attempt++) {
      const a = rnd() * Math.PI * 2
      const d = (0.45 + rnd() * 0.45) * maxR
      const p = new THREE.Vector3(Math.cos(a) * d, 0, Math.sin(a) * d)
      if (!avoid || p.distanceTo(avoid) > 3.0) return p
    }
    const away = avoid ? avoid.clone().multiplyScalar(-1).normalize() : new THREE.Vector3(1, 0, 0)
    return away.multiplyScalar(maxR * 0.85)
  }

  // crystals — every world's zone signature
  const crystalMat = new THREE.MeshStandardMaterial({
    color: zone.accent,
    emissive: zone.accent,
    emissiveIntensity: 0.85,
    roughness: 0.3,
    flatShading: true,
  })
  const crystalCount = 2 + Math.floor(rnd() * 2)
  for (let c = 0; c < crystalCount; c++) {
    const h = 0.5 + rnd() * 0.9
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(h * 0.42, 0), crystalMat)
    crystal.scale.y = 2.1
    const p = place(radius * 0.9)
    crystal.position.set(p.x, h * 0.62, p.z)
    crystal.rotation.y = rnd() * Math.PI
    crystal.rotation.z = (rnd() - 0.5) * 0.35
    crystal.castShadow = true
    group.add(crystal)
  }

  addFlavor(group, rnd, radius, zone.flavor, place)

  // scattered pebbles
  const pebbleMat = new THREE.MeshStandardMaterial({ color: 0x9a94ae, roughness: 1, flatShading: true })
  for (let p = 0; p < 4; p++) {
    const pebble = new THREE.Mesh(new THREE.DodecahedronGeometry(0.16 + rnd() * 0.2, 0), pebbleMat)
    const pos = place(radius * 0.92)
    pebble.position.set(pos.x, 0.1, pos.z)
    pebble.scale.y = 0.6
    group.add(pebble)
  }
}

type Placer = (maxR: number) => THREE.Vector3

function addFlavor(group: THREE.Group, rnd: () => number, radius: number, flavor: Flavor, place: Placer): void {
  switch (flavor) {
    case 'trees': {
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8a6a52, roughness: 1, flatShading: true })
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x53a468, roughness: 0.9, flatShading: true })
      for (let t = 0; t < 2; t++) {
        const tree = new THREE.Group()
        const h = 1.6 + rnd() * 1.2
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, h, 6), trunkMat)
        trunk.position.y = h / 2
        trunk.castShadow = true
        tree.add(trunk)
        for (let f = 0; f < 3; f++) {
          const s = 1.15 - f * 0.28
          const cone = new THREE.Mesh(new THREE.ConeGeometry(s, s * 1.2, 7), leafMat)
          cone.position.y = h * 0.66 + f * s * 0.75
          cone.castShadow = true
          tree.add(cone)
        }
        const p = place(radius * 0.8)
        tree.position.set(p.x, 0, p.z)
        group.add(tree)
      }
      break
    }
    case 'bushes': {
      const bushMat = new THREE.MeshStandardMaterial({ color: 0xd9a94e, roughness: 1, flatShading: true })
      for (let b = 0; b < 3; b++) {
        const bush = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4 + rnd() * 0.35, 0), bushMat)
        const p = place(radius * 0.85)
        bush.position.set(p.x, 0.3, p.z)
        bush.scale.y = 0.7
        bush.castShadow = true
        group.add(bush)
      }
      break
    }
    case 'shards': {
      const shardMat = new THREE.MeshStandardMaterial({
        color: 0x7a68a8,
        emissive: new THREE.Color(0xb08cff),
        emissiveIntensity: 0.55,
        roughness: 0.4,
        flatShading: true,
      })
      for (let s = 0; s < 3; s++) {
        const h = 1 + rnd() * 1.6
        const shard = new THREE.Mesh(new THREE.ConeGeometry(0.22, h, 5), shardMat)
        const p = place(radius * 0.85)
        shard.position.set(p.x, h / 2, p.z)
        shard.rotation.z = (rnd() - 0.5) * 0.3
        shard.castShadow = true
        group.add(shard)
      }
      break
    }
    case 'sakura': {
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6e4a44, roughness: 1, flatShading: true })
      const bloomMat = new THREE.MeshStandardMaterial({
        color: 0xf2a3c4,
        emissive: 0xf2a3c4,
        emissiveIntensity: 0.12,
        roughness: 0.85,
        flatShading: true,
      })
      for (let t = 0; t < 2; t++) {
        const tree = new THREE.Group()
        const h = 1.4 + rnd() * 1.0
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.17, h, 5), trunkMat)
        trunk.position.y = h / 2
        trunk.rotation.z = (rnd() - 0.5) * 0.25
        trunk.castShadow = true
        tree.add(trunk)
        const blobs = 3 + Math.floor(rnd() * 2)
        for (let b = 0; b < blobs; b++) {
          const s = 0.45 + rnd() * 0.4
          const bloom = new THREE.Mesh(new THREE.IcosahedronGeometry(s, 0), bloomMat)
          bloom.position.set((rnd() - 0.5) * 1.2, h + (rnd() - 0.3) * 0.7, (rnd() - 0.5) * 1.2)
          bloom.castShadow = true
          tree.add(bloom)
        }
        const p = place(radius * 0.8)
        tree.position.set(p.x, 0, p.z)
        group.add(tree)
      }
      break
    }
    case 'bamboo': {
      const stalkMat = new THREE.MeshStandardMaterial({ color: 0x57a86a, roughness: 0.8, flatShading: true })
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x6fc07a, roughness: 0.9, flatShading: true })
      for (let c = 0; c < 2; c++) {
        const cluster = new THREE.Group()
        const stalks = 3 + Math.floor(rnd() * 2)
        for (let s = 0; s < stalks; s++) {
          const h = 2 + rnd() * 1.5
          const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.075, h, 5), stalkMat)
          stalk.position.set((rnd() - 0.5) * 0.7, h / 2, (rnd() - 0.5) * 0.7)
          stalk.rotation.z = (rnd() - 0.5) * 0.12
          stalk.castShadow = true
          cluster.add(stalk)
          const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.5, 4), leafMat)
          leaf.position.set(stalk.position.x, h + 0.15, stalk.position.z)
          cluster.add(leaf)
        }
        const p = place(radius * 0.82)
        cluster.position.set(p.x, 0, p.z)
        group.add(cluster)
      }
      break
    }
    case 'lantern': {
      const stoneMat = new THREE.MeshStandardMaterial({ color: 0x8f8a9e, roughness: 1, flatShading: true })
      const glowMat = new THREE.MeshStandardMaterial({
        color: 0xfff1cf,
        emissive: 0xffd27a,
        emissiveIntensity: 1.5,
        roughness: 0.4,
      })
      for (let l = 0; l < 2; l++) {
        const lantern = new THREE.Group()
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.5, 6), stoneMat)
        base.position.y = 0.25
        lantern.add(base)
        const light = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.32, 0.36), glowMat)
        light.position.y = 0.72
        lantern.add(light)
        const cap = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.3, 4), stoneMat)
        cap.position.y = 1.02
        cap.rotation.y = Math.PI / 4
        lantern.add(cap)
        lantern.traverse((o) => ((o as THREE.Mesh).castShadow = true))
        const p = place(radius * 0.85)
        lantern.position.set(p.x, 0, p.z)
        group.add(lantern)
      }
      break
    }
    case 'reeds': {
      const reedMat = new THREE.MeshStandardMaterial({ color: 0x9aa86a, roughness: 1, flatShading: true })
      for (let c = 0; c < 3; c++) {
        const cluster = new THREE.Group()
        const reeds = 4 + Math.floor(rnd() * 3)
        for (let r = 0; r < reeds; r++) {
          const h = 0.8 + rnd() * 0.7
          const reed = new THREE.Mesh(new THREE.ConeGeometry(0.05, h, 4), reedMat)
          reed.position.set((rnd() - 0.5) * 0.5, h / 2, (rnd() - 0.5) * 0.5)
          reed.rotation.z = (rnd() - 0.5) * 0.3
          cluster.add(reed)
        }
        const p = place(radius * 0.88)
        cluster.position.set(p.x, 0, p.z)
        group.add(cluster)
      }
      break
    }
  }
}
