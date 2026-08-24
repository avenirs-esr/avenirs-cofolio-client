import type { ETraceAuthorType } from '@/api/avenir-esr'
import type { Association } from '@/features/student/global/types/associations.types'

export enum TraceType {
  FILE = 'FILE',
  LINK = 'LINK'
}

export enum EAssociationTypeKey {
  DECLARED_SKILLS = 'declaredSkills',
  DECLARED_EXPERIENCES = 'declaredExperiences',
  ACTIVITIES = 'activities'
}

export interface AssociateElementTypeConfig {
  key: string
  label: string
  searchPlaceholder?: string
  subConfigs?: Omit<AssociateElementTypeConfig, 'subConfigs'>[]
}

interface TraceFormDataBase {
  traceType: TraceType
  traceName: string
  personalNote?: string
  authorType: ETraceAuthorType | null
  useIA: boolean
  valorized: boolean
  iaJustification?: string
  associationSelections?: Record<string, Association[]>
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
