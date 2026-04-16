import type { TraceFormData, TraceFormDataFile, TraceFormDataLink } from '@/features/student/traces/types/traces.types'
import { TraceType } from '@/features/student/traces/types/traces.types'

export function isTraceFileType (trace: TraceFormData): trace is TraceFormDataFile {
  return trace.traceType === TraceType.FILE
}

export function isTraceLinkType (trace: TraceFormData): trace is TraceFormDataLink {
  return trace.traceType === TraceType.LINK
}
