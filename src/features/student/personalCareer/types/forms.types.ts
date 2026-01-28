import type {
  useAddDeclaredExperienceForm
} from '@/features/student/personalCareer/components/overlays/AddDeclaredExperienceDrawer/use-add-declared-experience-form/use-add-declared-experience-form'
import type {
  useAddDeclaredProgramForm
} from '@/features/student/personalCareer/components/overlays/AddDeclaredProgramDrawer/use-add-declared-program-form/use-add-declared-program-form'
import type { useUpdateDeclaredExperienceForm } from '@/features/student/personalCareer/views/DeclaredExperienceUpdateView/components/UpdateDeclaredExperienceForm/use-update-declared-experience-form/use-update-declared-experience-form'

export type AddDeclaredProgramForm = ReturnType<typeof useAddDeclaredProgramForm>['form']
export type AddDeclaredExperienceForm = ReturnType<typeof useAddDeclaredExperienceForm>['form']
export type UpdateDeclaredExperienceForm = ReturnType<typeof useUpdateDeclaredExperienceForm>['form']

export interface DeclaredProgramFormData {
  title: string
  description: string
  organization: string
  result: string
  sourceOfInformation: string
  link: string
  startDate: string
  endDate: string
  isOngoing: boolean
}

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
}
