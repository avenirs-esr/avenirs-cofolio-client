import type { TraceOverviewDTO } from '@/types'
import type { RouteLocationRaw } from 'vue-router'

export interface StudentTraceCardProps {
  trace: TraceOverviewDTO
  to?: RouteLocationRaw
}
