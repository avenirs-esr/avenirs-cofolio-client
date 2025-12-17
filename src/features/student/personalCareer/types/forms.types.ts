import type {
  useAddDeclaredProgramForm
} from '@/features/student/personalCareer/components/overlays/AddDeclaredProgramDrawer/use-add-declared-program-form/use-add-declared-program-form'

export type AddDeclaredProgramForm = ReturnType<typeof useAddDeclaredProgramForm>['form']

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
