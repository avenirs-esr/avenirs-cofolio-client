import type { EActivityAssessmentStatus, UserInfoDTO } from '@/api/avenir-esr'

export interface AssessmentTableRow {
  id: string
  learner: UserInfoDTO
  activityTitle: string
  type: string
  submitDate: string
  status: EActivityAssessmentStatus
  actions: string
}
