import { tr, type Lang } from '../game/constants'
import type { Course, Rank } from '../content/types'

export interface CertStats {
  playerName: string
  sparks: number
  sparkTotal: number
  xp: number
  rank: Rank
  date: Date
}

/**
 * Renders a shareable completion certificate as a canvas (1200×675 —
 * social-card ratio). Pure canvas drawing, theme-colored per course.
 */
export function drawCertificate(course: Course, lang: Lang, stats: CertStats, t: (k: string) => string): HTMLCanvasElement {
  const W = 1200
  const H = 675
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')!

  // themed sky backdrop: first → last zone gradient
  const zFirst = course.zones[0]
  const zLast = course.zones[course.zones.length - 1]
  const bg = g.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, zLast.skyTop)
  bg.addColorStop(1, zFirst.skyBottom)
  g.fillStyle = bg
  g.fillRect(0, 0, W, H)

  // faint island silhouettes
  g.fillStyle = 'rgba(35,40,56,0.14)'
  for (const [x, y, r] of [
    [150, 540, 90],
    [1020, 490, 110],
    [880, 590, 70],
    [300, 620, 120],
  ] as const) {
    g.beginPath()
    g.ellipse(x, y, r, r * 0.28, 0, 0, Math.PI * 2)
    g.fill()
    g.beginPath()
    g.moveTo(x - r * 0.8, y + 4)
    g.lineTo(x, y + r * 0.9)
    g.lineTo(x + r * 0.8, y + 4)
    g.closePath()
    g.fill()
  }

  // stars in the upper band
  g.fillStyle = 'rgba(255,246,224,0.8)'
  let seed = 7
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  for (let i = 0; i < 60; i++) {
    g.globalAlpha = 0.2 + rnd() * 0.7
    g.fillRect(rnd() * W, rnd() * H * 0.4, 2.2, 2.2)
  }
  g.globalAlpha = 1

  // paper card
  const cardX = 120
  const cardY = 80
  const cardW = W - 240
  const cardH = H - 160
  g.save()
  g.shadowColor = 'rgba(20,16,32,0.4)'
  g.shadowBlur = 50
  g.shadowOffsetY = 16
  g.beginPath()
  g.roundRect(cardX, cardY, cardW, cardH, 26)
  g.fillStyle = '#fffcf5'
  g.fill()
  g.restore()
  g.beginPath()
  g.roundRect(cardX + 12, cardY + 12, cardW - 24, cardH - 24, 18)
  g.strokeStyle = zFirst.accent
  g.lineWidth = 2.5
  g.stroke()

  const cx = W / 2

  // robot emblem
  const ry = cardY + 78
  g.fillStyle = '#e8674a'
  g.beginPath()
  g.roundRect(cx - 34, ry - 26, 68, 50, 13)
  g.fill()
  g.beginPath()
  g.roundRect(cx - 46, ry - 12, 10, 20, 4)
  g.fill()
  g.beginPath()
  g.roundRect(cx + 36, ry - 12, 10, 20, 4)
  g.fill()
  g.fillStyle = '#27222e'
  g.beginPath()
  g.roundRect(cx - 23, ry - 13, 46, 24, 8)
  g.fill()
  g.fillStyle = '#bff3ff'
  g.beginPath()
  g.roundRect(cx - 15, ry - 8, 10, 14, 5)
  g.fill()
  g.beginPath()
  g.roundRect(cx + 5, ry - 8, 10, 14, 5)
  g.fill()

  g.textAlign = 'center'
  g.fillStyle = '#9aa0b4'
  g.font = '800 20px system-ui, sans-serif'
  g.letterSpacing = '6px'
  g.fillText(t('certTitle'), cx, ry + 62)
  g.letterSpacing = '0px'

  // player name
  g.fillStyle = '#232838'
  g.font = '900 54px Georgia, "Times New Roman", serif'
  const name = stats.playerName.trim() || t('defaultClimber')
  g.fillText(name, cx, ry + 128)

  g.fillStyle = '#565d73'
  g.font = '600 21px system-ui, sans-serif'
  g.fillText(t('certCompleted'), cx, ry + 168)

  // course name in accent
  g.fillStyle = zFirst.accent
  g.font = '900 40px system-ui, sans-serif'
  g.fillText(`${course.icon}  ${tr(course.name, lang)}`, cx, ry + 218)

  // stats row
  const statsY = ry + 280
  const items = [
    `✓ ${course.lessons.length}/${course.lessons.length}`,
    `✦ ${stats.sparks}/${stats.sparkTotal}`,
    `${stats.rank.icon} ${tr(stats.rank.name, lang)}`,
    `⚡ ${stats.xp} XP`,
  ]
  g.font = '800 22px system-ui, sans-serif'
  const gap = cardW / (items.length + 1)
  items.forEach((s, i) => {
    const x = cardX + gap * (i + 1)
    g.fillStyle = '#232838'
    g.fillText(s, x, statsY)
  })

  // divider + footer
  g.strokeStyle = '#e8e2d5'
  g.lineWidth = 1.5
  g.beginPath()
  g.moveTo(cx - 200, statsY + 34)
  g.lineTo(cx + 200, statsY + 34)
  g.stroke()

  g.fillStyle = '#9aa0b4'
  g.font = '600 17px system-ui, sans-serif'
  const date = stats.date.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  g.fillText(date, cx, statsY + 68)
  g.font = '800 15px system-ui, sans-serif'
  g.fillStyle = '#e8674a'
  g.fillText('NEXT STEP — 3D Learning Worlds', cx, statsY + 96)

  return c
}
