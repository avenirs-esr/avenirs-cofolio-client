import { createMockedDeclaredSkillProgressDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import { mockedTraceDetailedWithFile } from '@/__mocks__/fixtures/student/traces.fixtures'
import { EFeedbackStatus, type FeedbackDetailsDTO, type FeedbackStaffListItemDTO, type PagedResponseFeedbackStaffListItemDTO } from '@/api/avenir-esr'

const allFeedbacks: FeedbackStaffListItemDTO[] = [
  {
    id: 'feedback-1',
    status: EFeedbackStatus.NEW,
    iteration: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
  {
    id: 'feedback-2',
    status: EFeedbackStatus.IN_PROCESS,
    iteration: 2,
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2024-02-11T09:00:00Z',
  },
  {
    id: 'feedback-3',
    status: EFeedbackStatus.SUBMITTED,
    iteration: 3,
    createdAt: '2024-03-05T14:00:00Z',
    updatedAt: '2024-03-06T14:00:00Z',
  },
]

const mockedStudent = {
  id: 'student-1',
  firstName: 'Lucas',
  lastName: 'Tessier',
  email: 'lucas.tessier@university.com',
}

export const mockedFeedbackDetailsWithAssociations: FeedbackDetailsDTO = {
  id: 'feedback-with-associations',
  declaredActivityId: 'declared-activity-1',
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
