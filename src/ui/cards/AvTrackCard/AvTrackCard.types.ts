import type { TrackDTO } from '@/types'
import type { RouteLocationRaw } from 'vue-router'

export interface AvTrackCardProps {
  track: TrackDTO
  to?: RouteLocationRaw
}
