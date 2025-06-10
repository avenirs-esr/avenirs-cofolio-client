import type { TrackOverviewDTO } from '@/types'
import type { RouteLocationRaw } from 'vue-router'

export interface StudentTrackCardProps {
  track: TrackOverviewDTO
  to?: RouteLocationRaw
}
