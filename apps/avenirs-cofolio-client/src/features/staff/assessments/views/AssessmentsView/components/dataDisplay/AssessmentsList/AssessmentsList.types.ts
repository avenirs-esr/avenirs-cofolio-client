import type { EActivityAssessmentStatus, EActivityAssessmentType, UserInfoDTO } from '@avenirs-esr/shared/api/avenir-esr'

export interface AssessmentTableRow {
  id: string
  learner: UserInfoDTO
  activityTitle: string
  types: EActivityAssessmentType[]
  submitDate: string
  status: EActivityAssessmentStatus
  actions: string
}
