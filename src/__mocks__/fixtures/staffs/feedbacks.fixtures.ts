import { createMockedDeclaredSkillProgressDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import { mockedTraceDetailedWithFile } from '@/__mocks__/fixtures/student/traces.fixtures'
import { type ActivityContentDTO, EActivityThematic, EFeedbackStatus, type FeedbackDashboardDTO, type FeedbackDetailsDTO, type FeedbackOverviewDTO, type FeedbackStaffListItemDTO, type PagedResponseFeedbackStaffListItemDTO, type UserInfoDTO } from '@/api/avenir-esr'

const mockedStudent: UserInfoDTO = {
  id: 'student-1',
  firstName: 'Lucas',
  lastName: 'Tessier',
  email: 'lucas.tessier@university.com',
}

const mockedStaff: UserInfoDTO = {
  id: 'staff-1',
  firstName: 'Marc',
  lastName: 'Dupont',
  email: 'marc.dupont@university.com',
}

const mockedActivity: ActivityContentDTO = {
  id: '2a9f6c4d-8b1e-4d33-9c7a-5e2b8f1c6d77',
  title: 'Activité de test',
  thematic: EActivityThematic.TRANSVERSAL,
  summary: 'Résumé activité test',
  description: 'Description activité test',
  executionPeriodInfo: 'Semestre 1',
  enableReflection: false,
  traceAllowedAssociations: 3,
  feedbackAllowedIterations: 5,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-16T10:00:00Z',
}

const allFeedbacks: FeedbackStaffListItemDTO[] = [
  {
    id: 'feedback-1',
    status: EFeedbackStatus.NEW,
    iteration: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
    student: mockedStudent,
    activity: mockedActivity,
  },
  {
    id: 'feedback-2',
    status: EFeedbackStatus.NEW,
    iteration: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
    student: mockedStudent,
    activity: mockedActivity,
  },
  {
    id: 'feedback-3',
    status: EFeedbackStatus.IN_PROCESS,
    iteration: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
    student: mockedStudent,
    activity: mockedActivity,
  },
  {
    id: 'feedback-submitted',
    status: EFeedbackStatus.SUBMITTED,
    iteration: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
    student: mockedStudent,
    activity: mockedActivity,
  },
]

export const mockedFeedbackDetailsWithAssociations: FeedbackDetailsDTO = {
  id: 'feedback-with-associations',
  declaredActivityId: 'declared-activity-id',
  activity: mockedActivity,
  feedback: 'This is a detailed feedback with associations',
  status: EFeedbackStatus.NEW,
  student: mockedStudent,
  associatedTraces: [mockedTraceDetailedWithFile],
  associatedDeclaredSkills: [createMockedDeclaredSkillProgressDTO()],
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-16T10:00:00Z',
}

export const mockedFeedbackDetailsWithoutAssociations: FeedbackDetailsDTO = {
  ...mockedFeedbackDetailsWithAssociations,
  id: 'feedback-without-associations',
  associatedTraces: [],
  associatedDeclaredSkills: [],
}

export const mockedFeedbackDetailsSubmitted: FeedbackDetailsDTO = {
  ...mockedFeedbackDetailsWithAssociations,
  status: EFeedbackStatus.SUBMITTED,
  id: 'feedback-submitted',
}

export const mockedFeedbackHistory: FeedbackOverviewDTO[] = [
  {
    id: 'feedback-overview-3',
    staff: mockedStaff,
    student: mockedStudent,
    feedback: 'Votre travail est bien structuré, continuez dans cette direction.',
    status: EFeedbackStatus.SUBMITTED,
    createdAt: '2026-03-05T10:00:00Z',
    updatedAt: '2026-05-09T10:00:00Z',
  },
  {
    id: 'feedback-overview-2',
    staff: mockedStaff,
    student: mockedStudent,
    feedback: 'Les références bibliographiques manquent de précision.',
    status: EFeedbackStatus.SUBMITTED,
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-02-02T10:00:00Z',
  },
  {
    id: 'feedback-overview-1',
    staff: mockedStaff,
    student: mockedStudent,
    feedback: 'Il faudrait que vous puissiez citer vos références méthodologiques.',
    status: EFeedbackStatus.IN_PROCESS,
    createdAt: '2025-12-12T10:00:00Z',
    updatedAt: '2026-02-07T10:00:00Z',
  },
]

export const mockedFeedbackDashboard: FeedbackDashboardDTO = {
  totalFeedbacks: 20,
  newFeedbacks: 4,
  pendingFeedbacks: 10,
  processedFeedbacks: 10,
}

export function createMockedPagedResponseFeedbackStaffListItemDTO (
  pageSize: number,
  totalElements: number,
  page: number
): PagedResponseFeedbackStaffListItemDTO {
  const actualTotalElements = Math.min(totalElements, allFeedbacks.length)
  const start = page * pageSize
  const end = start + pageSize
  const paginatedFeedbacks = allFeedbacks.slice(start, end)
  const totalPages = Math.ceil(actualTotalElements / pageSize)
  return {
    data: paginatedFeedbacks,
    page: { pageSize, totalElements: actualTotalElements, totalPages, page },
  }
}
