import type { TraceOverviewDTO, TraceViewDTO } from '@avenirs-esr/shared/api/avenir-esr'

export function getTraceComplementaryInfo (trace: Pick<TraceOverviewDTO | TraceViewDTO, 'attachment' | 'link'>): string | undefined {
  return trace.attachment?.fileName || trace.link || undefined
}
