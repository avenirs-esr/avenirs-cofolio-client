import type { ActivityContentDTO, ActivityDraftCreationResponse, ActivityDraftUpdateResponse } from '@/api/avenir-esr'
import { EActivityThematic } from '@/api/avenir-esr'

export const mockedActivityDraftCreationResponse: ActivityDraftCreationResponse = {
  draftId: '5046ec1c-c8f3-4d06-abf3-71ba4a73643c',
}

export const mockedActivityContent: ActivityContentDTO = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  title: 'Activité nationale de test',
  thematic: EActivityThematic.TRANSVERSAL,
  summary: 'Résumé de l\'activité de test',
  description: 'Description détaillée de l\'activité de test',
  executionPeriodInfo: 'Semestre 1',
  enableReflection: false,
  traceAllowedAssociations: 3,
  feedbackAllowedIterations: 2,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
}

export const mockedActivityDraftUpdateResponse: ActivityDraftUpdateResponse = {
  draftId: '5046ec1c-c8f3-4d06-abf3-71ba4a73643c',
}
