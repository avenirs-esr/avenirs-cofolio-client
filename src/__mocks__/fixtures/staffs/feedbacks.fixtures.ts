import { mockedActivityContentWithEnrolledStudent1, mockedActivityContentWithEnrolledStudent2, mockedActivityContentWithEnrolledStudent3, mockedActivityContentWithEnrolledStudent4 } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { createMockedDeclaredSkillProgressDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import { mockedTraceDetailedWithFile } from '@/__mocks__/fixtures/student/traces.fixtures'
import { EFeedbackStatus, EFileType, type FeedbackDashboardDTO, type FeedbackDetailsDTO, type FeedbackOverviewDTO, type FeedbackStaffListItemDTO, type FileDTO, type PagedResponseFeedbackStaffListItemDTO, type PageInfoDTO, type UserInfoDTO } from '@/api/avenir-esr'

export const mockedFeedbackAttachment: FileDTO = {
  id: 'feedback-attachment-1',
  fileName: 'compte-rendu.pdf',
  fileType: EFileType.PDF,
  fileSize: 1024,
  url: 'https://example.com/compte-rendu.pdf',
  uploadedAt: '2026-01-01T10:00:00Z',
}

export const mockedUploadedFeedbackAttachment: FileDTO = {
  id: 'feedback-attachment-2',
  fileName: 'annexe.pdf',
  fileType: EFileType.PDF,
  fileSize: 2048,
  url: 'https://example.com/annexe.pdf',
  uploadedAt: '2026-01-02T10:00:00Z',
}

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

export const allFeedbacks: FeedbackStaffListItemDTO[] = [
  {
    id: 'feedback-1',
    status: EFeedbackStatus.NEW,
    iteration: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
    student: mockedStudent,
    activity: mockedActivityContentWithEnrolledStudent1,
  },
  {
    id: 'feedback-2',
    status: EFeedbackStatus.NEW,
    iteration: 1,
    createdAt: '2024-02-03T10:00:00Z',
    updatedAt: '2024-02-04T10:00:00Z',
    student: mockedStudent,
    activity: mockedActivityContentWithEnrolledStudent2,
  },
  {
    id: 'feedback-3',
    status: EFeedbackStatus.IN_PROCESS,
    iteration: 1,
    createdAt: '2024-03-12T10:00:00Z',
    updatedAt: '2024-03-13T10:00:00Z',
    student: mockedStudent,
    activity: mockedActivityContentWithEnrolledStudent3,
  },
  {
    id: 'feedback-submitted',
    status: EFeedbackStatus.SUBMITTED,
    iteration: 2,
    createdAt: '2024-03-14T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
    student: mockedStudent,
    activity: mockedActivityContentWithEnrolledStudent3,
  },
  {
    id: 'feedback-seen',
    status: EFeedbackStatus.SEEN,
    iteration: 1,
    createdAt: '2024-04-07T10:00:00Z',
    updatedAt: '2024-04-08T10:00:00Z',
    student: mockedStudent,
    activity: mockedActivityContentWithEnrolledStudent4,
  },
  {
    id: 'feedback-6',
    status: EFeedbackStatus.SUBMITTED,
    iteration: 2,
    createdAt: '2024-04-09T10:00:00Z',
    updatedAt: '2024-04-10T10:00:00Z',
    student: mockedStudent,
    activity: mockedActivityContentWithEnrolledStudent4,
  },
  {
    id: 'feedback-7',
    status: EFeedbackStatus.IN_PROCESS,
    iteration: 3,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z',
    student: mockedStudent,
    activity: mockedActivityContentWithEnrolledStudent1,
  },
  {
    id: 'feedback-8',
    status: EFeedbackStatus.SEEN,
    iteration: 3,
    createdAt: '2024-03-16T10:00:00Z',
    updatedAt: '2024-03-17T10:00:00Z',
    student: mockedStudent,
    activity: mockedActivityContentWithEnrolledStudent3,
  },
]

export const mockedFeedbackDetailsWithAssociations: FeedbackDetailsDTO = {
  id: 'feedback-with-associations',
  declaredActivityId: 'declared-activity-id',
  activity: mockedActivityContentWithEnrolledStudent1,
  feedback: 'This is a detailed feedback with associations',
  status: EFeedbackStatus.NEW,
  student: mockedStudent,
  associatedTraces: [mockedTraceDetailedWithFile],
  associatedDeclaredSkills: [createMockedDeclaredSkillProgressDTO()],
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-16T10:00:00Z'
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

export const mockedFeedbackDetailsSeen: FeedbackDetailsDTO = {
  ...mockedFeedbackDetailsWithAssociations,
  status: EFeedbackStatus.SEEN,
  id: 'feedback-seen',
}

export const mockedFeedbackHistory: FeedbackOverviewDTO[] = [
  {
    id: 'feedback-overview-4',
    staff: mockedStaff,
    student: mockedStudent,
    feedback: 'Peut mieux faire.',
    status: EFeedbackStatus.SEEN,
    createdAt: '2026-06-05T10:00:00Z',
    updatedAt: '2026-08-09T10:00:00Z',
  },
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

export function getMockedStaffFeedbacks ({ statuses, activityId }: { statuses?: EFeedbackStatus[], activityId?: string } = {}): FeedbackStaffListItemDTO[] {
  let feedbacks = [...allFeedbacks]

  if (statuses) {
    feedbacks = feedbacks.filter(feedback => statuses.includes(feedback.status!))
  }

  if (activityId) {
    feedbacks = feedbacks.filter(feedback => feedback.activity!.id === activityId)
  }

  // Keep the same ordering as the backend, which requires feedbacks to be
  // sorted by status first, then by creation date (see: #1648).
  return feedbacks.sort((a, b) => {
    if (a.status! === b.status!) {
      return new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
    }

    return a.status! < b.status! ? -1 : 1
  })
}

export function getMockedStaffFeedbacksPaginated ({ statuses, activityId, page, pageSize }: { statuses?: EFeedbackStatus[], activityId?: string, page?: number, pageSize?: number } = {}): PagedResponseFeedbackStaffListItemDTO {
  const feedbacks = getMockedStaffFeedbacks({ statuses, activityId })

  const pageInfo: PageInfoDTO = {
    page: page ?? 0,
    pageSize: pageSize ?? feedbacks.length,
    totalElements: feedbacks.length,
    totalPages: pageSize ? Math.ceil(feedbacks.length / pageSize) : 1
  }

  const start = pageInfo.page * pageInfo.pageSize
  const pagedFeedbacks = feedbacks.slice(start, start + pageInfo.pageSize)

  return {
    data: pagedFeedbacks,
    page: pageInfo
  }
}

export function getMockedFeedbackDashboard ({ activityId }: { activityId?: string } = {}): FeedbackDashboardDTO {
  const result: FeedbackDashboardDTO = {
    newFeedbacks: 0,
    pendingFeedbacks: 0,
    processedFeedbacks: 0,
    totalFeedbacks: 0
  }

  const feedbacks = activityId ? allFeedbacks.filter(feedback => feedback.activity!.id === activityId) : allFeedbacks

  feedbacks.forEach((feedback) => {
    switch (feedback.status!) {
      case EFeedbackStatus.NEW:
        ++result.newFeedbacks
        ++result.pendingFeedbacks
        break

      case EFeedbackStatus.IN_PROCESS:
        ++result.pendingFeedbacks
        break

      case EFeedbackStatus.SEEN:
      case EFeedbackStatus.SUBMITTED:
        ++result.processedFeedbacks
        break
    }
    ++result.totalFeedbacks
  })

  return result
}
