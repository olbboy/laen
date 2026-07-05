import type { Course } from '../types'
import { AI_LADDER_LESSONS } from '../lessons'

/** The original world: the eleven-rung "Your Next Step in AI" ladder. */
export const AI_LADDER: Course = {
  id: 'ai-ladder',
  icon: '🤖',
  name: { en: 'The AI Mastery Ascent', vi: 'Chinh phục AI' },
  tagline: {
    en: 'From chatting with AI to systems that work while you sleep.',
    vi: 'Từ trò chuyện với AI đến những hệ thống tự làm việc khi bạn ngủ.',
  },
  blurb: {
    en: 'The classic eleven-step ladder: coding agents, memory, projects, skills, connectors, Claude Code, sub-agents, agent teams and routines — one island at a time.',
    vi: 'Chiếc thang 11 bậc kinh điển: agent lập trình, memory, projects, skills, connectors, Claude Code, sub-agents, agent teams và routines — mỗi hòn đảo một bậc thang.',
  },
  minutes: 35,
  levels: [
    { name: { en: 'Get Going', vi: 'Khởi động' }, color: '#3e8dcc', steps: [1, 2, 3], zone: 0 },
    { name: { en: 'Power Up', vi: 'Tăng lực' }, color: '#2fa98c', steps: [4, 5, 6], zone: 1 },
    { name: { en: 'Go Pro', vi: 'Chuyên nghiệp' }, color: '#e9a13b', steps: [7, 8], zone: 2 },
    { name: { en: 'Automate', vi: 'Tự động hoá' }, color: '#d95b3f', steps: [9, 10, 11], zone: 3 },
  ],
  zones: [
    // fresh morning blue
    { skyTop: '#6fb3e8', skyBottom: '#f6ead6', grass: '#7ec578', rock: '#8d87a8', accent: '#3e8dcc', sun: '#fff3e0', starAlpha: 0, flavor: 'trees' },
    // mint noon
    { skyTop: '#62c1a6', skyBottom: '#f0eed6', grass: '#6bbd74', rock: '#7f8ba0', accent: '#2fa98c', sun: '#fff8e8', starAlpha: 0, flavor: 'trees' },
    // golden hour
    { skyTop: '#f0a95c', skyBottom: '#fbe3c0', grass: '#c4b05e', rock: '#9a7f92', accent: '#e9a13b', sun: '#ffe0b8', starAlpha: 0.25, flavor: 'bushes' },
    // violet dusk
    { skyTop: '#4c3d6e', skyBottom: '#ef8f6a', grass: '#8a76a6', rock: '#6b5f88', accent: '#d95b3f', sun: '#ffc9a0', starAlpha: 1, flavor: 'shards' },
  ],
  layout: { spiralDeg: 62, radius: 30, rise: 6, islandRadius: 8, startRadius: 10 },
  lessons: AI_LADDER_LESSONS,
}
