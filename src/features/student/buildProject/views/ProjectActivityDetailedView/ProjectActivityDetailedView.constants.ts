export const ACTIVITY_DETAILED_SECTIONS = {
  ACTIVITY_DETAILED: 'activity-detailed',
  MY_PERSPECTIVE: 'my-perspective',
} as const

export type ActivityDetailedSection =
  typeof ACTIVITY_DETAILED_SECTIONS[keyof typeof ACTIVITY_DETAILED_SECTIONS]
