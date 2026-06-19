import type { ActivityContentDTO, ActivityDraftCreationResponse, ActivityDraftUpdateResponse, ActivityStaffOverviewDTO, FileDTO, PagedResponseActivityStaffOverviewDTO } from '@/api/avenir-esr'
import { EActivityStatus, EActivityThematic } from '@/api/avenir-esr'
import { getFileTypeFromFileName } from '@/common/utils/filetype/filetype'

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

const allStaffActivities: ActivityStaffOverviewDTO[] = [
  {
    activityId: 'staff-activity-1',
    title: 'Activité "Connaissance de soi" : Définir ses valeurs',
    thematic: EActivityThematic.SELF_KNOWLEDGE,
    activityStatus: EActivityStatus.DRAFT,
    updatedAt: '2024-01-15T10:00:00Z',
    author: { userId: 'user-1', firstName: 'Jean', lastName: 'Dupont' },
  },
  {
    activityId: 'staff-activity-2',
    title: 'Activité "CV" : Construire son parcours',
    thematic: EActivityThematic.RESUMES,
    activityStatus: EActivityStatus.PUBLISHED,
    updatedAt: '2024-02-10T09:00:00Z',
    author: { userId: 'user-1', firstName: 'Jean', lastName: 'Dupont' },
  },
  {
    activityId: 'staff-activity-3',
    title: 'Activité "Trajectoires" : Explorer ses voies',
    thematic: EActivityThematic.TRAJECTORIES,
    activityStatus: EActivityStatus.PUBLISHED,
    updatedAt: '2024-03-05T14:00:00Z',
    author: { userId: 'user-2', firstName: 'Marie', lastName: 'Martin' },
  },
  {
    activityId: 'staff-activity-4',
    title: 'Activité "Expériences" : Valoriser ses expériences',
    thematic: EActivityThematic.EXPERIENCES,
    activityStatus: EActivityStatus.DRAFT,
    updatedAt: new Date().toISOString(),
    author: { userId: 'user-2', firstName: 'Marie', lastName: 'Martin' },
  },
  {
    activityId: 'staff-activity-5',
    title: 'Activité "Programmes" : Analyser son parcours',
    thematic: EActivityThematic.PROGRAMS,
    activityStatus: EActivityStatus.PUBLISHED,
    updatedAt: '2024-01-20T11:00:00Z',
    author: { userId: 'user-1', firstName: 'Jean', lastName: 'Dupont' },
  },
  {
    activityId: 'staff-activity-6',
    title: 'Activité "Transversal" : Développer ses compétences',
    thematic: EActivityThematic.TRANSVERSAL,
    activityStatus: EActivityStatus.DRAFT,
    updatedAt: '2024-04-01T08:00:00Z',
    author: { userId: 'user-3', firstName: 'Pierre', lastName: 'Durand' },
  },
]

export function createMockedPagedResponseActivityStaffOverviewDTO (
  pageSize: number,
  totalElements: number,
  page: number
): PagedResponseActivityStaffOverviewDTO {
  const actualTotalElements = Math.min(totalElements, allStaffActivities.length)
  const start = page * pageSize
  const end = start + pageSize
  const paginatedActivities = allStaffActivities.slice(start, end)
  const totalPages = Math.ceil(actualTotalElements / pageSize)

  return {
    data: paginatedActivities,
    page: { pageSize, totalElements: actualTotalElements, totalPages, page },
  }
}

export function createMockedBannerUploadResponse (activityId: string, file: File): FileDTO {
  return {
    id: `banner-${Date.now()}`,
    fileName: activityId,
    fileType: getFileTypeFromFileName(file.name),
    fileSize: file.size,
    version: 1,
    url: 'exemple.com/image',
    uploadedAt: '2024-01-15T10:30:00'
  }
}
