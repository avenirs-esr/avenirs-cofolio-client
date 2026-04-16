import type { IdTitle } from '@/types'

export enum TraceType {
  FILE = 'FILE',
  LINK = 'LINK'
}

export enum EAssociationTypeKey {
  DECLARED_SKILLS = 'declaredSkills',
  ACTIVITIES = 'activities'
}

export interface AssociateElementOption extends IdTitle {
  disabled?: boolean
}

export interface AssociateElementTypeConfig {
  key: string
  label: string
  searchPlaceholder: string
}

interface TraceFormDataBase {
  traceType: TraceType
  traceName: string
  personalNote?: string
  isAuthentic: boolean
  isGroup: boolean
  useIA: boolean
  iaJustification?: string
  associationSelections?: Record<string, IdTitle[]>
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
