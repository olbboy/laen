import * as THREE from 'three'
import { islandPosition, islandRadius, levelOfStep, mulberry32, ZONES } from '../game/constants'

export interface Island {
  group: THREE.Group
  walkable: THREE.Mesh
  center: THREE.Vector3
  radius: number
}

/** Zone palette for an island by its index (0 = start island → zone 0). */
function zoneOfIsland(i: number) {
  return ZONES[i === 0 ? 0 : levelOfStep(i)]
}

/**
 * Builds one floating island: an organically jittered grass disc, a rocky
 * underside cone, rim glow, and zone-appropriate decorations.
 */
export function buildIsland(i: number): Island {
  const rnd = mulberry32(1000 + i * 77)
  const zone = zoneOfIsland(i)
  const center = islandPosition(i)
  const radius = islandRadius(i)

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
  const stationLocal =
    i === 0 ? null : center.clone().setY(0).normalize().multiplyScalar(-3.4)
  const level = i === 0 ? 0 : levelOfStepSafe(i)
  decorate(group, rnd, radius, level, zone.accent, stationLocal)

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

function levelOfStepSafe(step: number): number {
  return levelOfStep(Math.min(Math.max(step, 1), 11))
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

function decorate(
  group: THREE.Group,
  rnd: () => number,
  radius: number,
  level: number,
  accent: THREE.Color,
  avoid: THREE.Vector3 | null,
): void {
  const place = (maxR: number) => {
    for (let attempt = 0; attempt < 8; attempt++) {
      const a = rnd() * Math.PI * 2
      const d = (0.45 + rnd() * 0.45) * maxR
      const p = new THREE.Vector3(Math.cos(a) * d, 0, Math.sin(a) * d)
      if (!avoid || p.distanceTo(avoid) > 3.0) return p
    }
    // fall back to the rim opposite the monument
    const away = avoid ? avoid.clone().multiplyScalar(-1).normalize() : new THREE.Vector3(1, 0, 0)
    return away.multiplyScalar(maxR * 0.85)
  }

  // crystals — everywhere, glow in zone accent
  const crystalMat = new THREE.MeshStandardMaterial({
    color: accent,
    emissive: accent,
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

  // level-flavored props
  if (level <= 1) {
    // trees for the fresh lowlands
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8a6a52, roughness: 1, flatShading: true })
    const leafMat = new THREE.MeshStandardMaterial({
      color: level === 0 ? 0x5aa860 : 0x4d9e79,
      roughness: 0.9,
      flatShading: true,
    })
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
  } else if (level === 2) {
    // dry golden bushes
    const bushMat = new THREE.MeshStandardMaterial({ color: 0xd9a94e, roughness: 1, flatShading: true })
    for (let b = 0; b < 3; b++) {
      const bush = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4 + rnd() * 0.35, 0), bushMat)
      const p = place(radius * 0.85)
      bush.position.set(p.x, 0.3, p.z)
      bush.scale.y = 0.7
      bush.castShadow = true
      group.add(bush)
    }
  } else {
    // dusk shards — tall glowing slivers
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
  }

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
