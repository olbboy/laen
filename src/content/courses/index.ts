import type { Course } from '../types'
import { AI_LADDER } from './ai-ladder'
import { PROMPT_DOJO } from './prompt-dojo'
import { SAFETY_LIGHTHOUSE } from './safety-lighthouse'

/**
 * The course registry. To add a new world:
 *  1. create src/content/courses/<your-course>.ts exporting a Course
 *  2. import and append it here
 * Everything else — the 3D map, ladder HUD, journal, certificate —
 * derives from the definition.
 */
export const COURSES: Course[] = [AI_LADDER, PROMPT_DOJO, SAFETY_LIGHTHOUSE]

export const DEFAULT_COURSE = AI_LADDER.id

export function getCourse(id: string | null | undefined): Course {
  return COURSES.find((c) => c.id === id) ?? AI_LADDER
}
