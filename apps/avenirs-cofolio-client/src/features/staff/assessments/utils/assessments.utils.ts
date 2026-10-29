import { EActivityAssessmentStatus } from '@/api/avenir-esr'

type TranslateFunction = (key: string) => string
type TranslationExistsFunction = (key: string) => boolean

const ASSESSMENT_STATUS_TRANSLATION_KEY = 'staff.assessments.badges.assessmentStatus'

export function getAssessmentStatusLabel (
  statusEnum: string,
  t: TranslateFunction,
  te: TranslationExistsFunction
): string {
  const key = `${ASSESSMENT_STATUS_TRANSLATION_KEY}.${statusEnum}`

  return te(key) ? t(key) : ''
}

export function getAssessmentStatusEnum (
  statusLabel: string,
  t: TranslateFunction,
  te: TranslationExistsFunction
): EActivityAssessmentStatus | null {
  return Object.values(EActivityAssessmentStatus).find(status => getAssessmentStatusLabel(status, t, te) === statusLabel) ?? null
}
