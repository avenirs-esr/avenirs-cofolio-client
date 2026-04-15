import type { IdTitle } from '@/types'

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

export interface TraceFormData {
  file: File | null
  traceName: string
  personalNote?: string
  isAuthentic: boolean
  isGroup: boolean
  useIA: boolean
  iaJustification?: string
  associationSelections?: Record<string, IdTitle[]>
}
