import { createMockedDeclaredSkillProgressDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import { mockedTraceDetailedWithFile } from '@/__mocks__/fixtures/student/traces.fixtures'
import { type ActivityContentDTO, type DeclaredActivityDetailsDTO, EActivityThematic, EDeclaredActivityStatus, EFeedbackStatus, type FeedbackDashboardDTO, type FeedbackDetailsDTO, type FeedbackStaffListItemDTO, type PagedResponseFeedbackStaffListItemDTO, type UserInfoDTO } from '@/api/avenir-esr'

const mockedStudent: UserInfoDTO = {
  id: 'student-1',
  firstName: 'Lucas',
  lastName: 'Tessier',
  email: 'lucas.tessier@university.com',
}

const mockedActivity: ActivityContentDTO = {
  id: 'activity-1',
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

const mockedDeclaredActivity: DeclaredActivityDetailsDTO = {
  id: 'declared-activity-1',
  status: EDeclaredActivityStatus.IN_PROGRESS,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-16T10:00:00Z',
  activity: mockedActivity,
}

const allFeedbacks: FeedbackStaffListItemDTO[] = [
  {
    id: 'feedback-1',
    status: EFeedbackStatus.NEW,
    iteration: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
    student: mockedStudent,
    activity: mockedDeclaredActivity,
  },
  {
    id: 'feedback-2',
    status: EFeedbackStatus.NEW,
    iteration: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
    student: mockedStudent,
    activity: mockedDeclaredActivity,
  },
  {
    id: 'feedback-3',
    status: EFeedbackStatus.IN_PROCESS,
    iteration: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
    student: mockedStudent,
    activity: mockedDeclaredActivity,
  },
]

export const mockedFeedbackDetailsWithAssociations: FeedbackDetailsDTO = {
  id: 'feedback-with-associations',
  declaredActivityId: 'declared-activity-1',
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
