import type { ETraceAuthorType } from '@/api/avenir-esr'
import type { AssociationSelections } from '@/features/student/associations/types/associations.types'

export enum TraceType {
  FILE = 'FILE',
  LINK = 'LINK'
}

interface TraceFormDataBase {
  traceType: TraceType
  traceName: string
  personalNote?: string
  authorType: ETraceAuthorType | null
  useIA: boolean
  valorized: boolean
  iaJustification?: string
  associationSelections?: AssociationSelections
}

export interface TraceFormDataFile extends TraceFormDataBase {
  traceType: TraceType.FILE
  file: File | null
}

export interface TraceFormDataLink extends TraceFormDataBase {
  traceType: TraceType.LINK
  link: string
}

export type TraceFormData = TraceFormDataFile | TraceFormDataLink
