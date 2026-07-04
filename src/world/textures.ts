import * as THREE from 'three'

/** Soft radial glow — used for spark halos, thruster, blob shadow. */
export function radialTexture(inner: string, outer: string, size = 128): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, inner)
  grad.addColorStop(1, outer)
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Vertical gradient (bright bottom → transparent top) for light pillars. */
export function pillarTexture(color: string): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 4
  c.height = 128
  const g = c.getContext('2d')!
  const grad = g.createLinearGradient(0, 128, 0, 0)
  grad.addColorStop(0, color)
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 4, 128)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Station label sprite: big step number + name on a rounded card. */
export function labelTexture(num: string, title: string, accent: string): THREE.CanvasTexture {
  const w = 512
  const h = 168
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')!

  const r = 36
  g.beginPath()
  g.roundRect(6, 6, w - 12, h - 12, r)
  g.fillStyle = 'rgba(255, 252, 245, 0.94)'
  g.fill()
  g.lineWidth = 5
  g.strokeStyle = accent
  g.stroke()

  // number chip
  g.beginPath()
  g.arc(84, h / 2, 46, 0, Math.PI * 2)
  g.fillStyle = accent
  g.fill()
  g.fillStyle = '#fffdf8'
  g.font = '800 44px system-ui, sans-serif'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText(num, 84, h / 2 + 2)

  g.fillStyle = '#232838'
  g.font = '700 36px system-ui, sans-serif'
  g.textAlign = 'left'
  let label = title
  while (g.measureText(label).width > w - 172 && label.length > 4) label = label.slice(0, -2)
  if (label !== title) label += '…'
  g.fillText(label, 148, h / 2 + 2)

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}
