import type { TrackDTO } from '@/types'
import type { RouteLocationRaw } from 'vue-router'

export interface StudentTrackCardProps {
  track: TrackDTO
  to?: RouteLocationRaw
}
