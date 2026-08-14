import type { AnyFormApi } from '@/common/types'
import type { Association } from '@/features/student/global/types/associations.types'
import type {
  useAddDeclaredExperienceForm
} from '@/features/student/personalCareer/components/overlays/AddDeclaredExperienceDrawer/use-add-declared-experience-form/use-add-declared-experience-form'
import type {
  useAddDeclaredProgramForm
} from '@/features/student/personalCareer/components/overlays/AddDeclaredProgramDrawer/use-add-declared-program-form/use-add-declared-program-form'
import type { DeclaredExperienceAssociationContextType } from '@/features/student/personalCareer/types/declared-experience.types'
import type {
  useUpdateDeclaredExperienceForm
} from '@/features/student/personalCareer/views/DeclaredExperienceUpdateView/components/UpdateDeclaredExperienceForm/use-update-declared-experience-form/use-update-declared-experience-form'
import type {
  useUpdateDeclaredProgramForm
} from '@/features/student/personalCareer/views/DeclaredProgramUpdateView/components/use-update-declared-program-form/use-update-declared-program-form'

export type AddDeclaredProgramForm = ReturnType<typeof useAddDeclaredProgramForm>['form']
export type AddDeclaredExperienceForm = ReturnType<typeof useAddDeclaredExperienceForm>['form']
export type UpdateDeclaredExperienceForm = ReturnType<typeof useUpdateDeclaredExperienceForm>['form']
export type UpdateDeclaredProgramForm = ReturnType<typeof useUpdateDeclaredProgramForm>['form']

export interface DeclaredProgramFormData {
  title: string
  description: string
  organization: string
  result: string
  sourceOfInformation: string
  startDate: string
  endDate: string
  isOngoing: boolean
  valorized: boolean
}
export type DeclaredProgramFormApi = AnyFormApi<DeclaredProgramFormData>

export interface DeclaredExperienceFormData {
  title: string
  type: string
  organization: string
  activitySector: string
  location: string
  startDate: string
  endDate: string
  isOngoing: boolean
  sourceOfInformation: string
  description: string
  summary: string
  externalLink: string
  valorized: boolean
  associationSelections?: Partial<Record<DeclaredExperienceAssociationContextType, Association[]>>
}
