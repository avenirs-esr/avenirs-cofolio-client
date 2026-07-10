import type {
  ActivityContentDTO,
  ActivityDraftCreationResponse,
  ActivityDraftUpdateResponse,
  ActivityStaffOverviewDTO,
  AuthorDTO,
  FileDTO,
  PagedResponseActivityStaffOverviewDTO
} from '@/api/avenir-esr'
import { EActivityStatus, EActivityThematic, EFileType } from '@/api/avenir-esr'
import { getFileTypeFromFileName } from '@/common/utils/file/file'

export const ACTIVITY_WITH_ENROLLED_STUDENTS_ID
  = '8c5d1f77-2a9e-4b33-9f6c-1e4b7a2d9c11'

export const ACTIVITY_WITHOUT_ENROLLED_STUDENTS_ID
  = '2c9e4b77-6a1f-4d55-8b3c-7e2d1a9f4c22'

export const ACTIVITY_WITH_FILE_AND_LINK_ID
  = '2c9e4b77-6a1f-4d55-8b3c-7e2d1a9f4c22'

export const mockedAuthor1: AuthorDTO = {
  userId: 'user-1',
  firstName: 'Jean',
  lastName: 'Dupont',
}

export const mockedAuthor2: AuthorDTO = {
  userId: 'user-2',
  firstName: 'Marie',
  lastName: 'Martin',
}

export const mockedActivityDraftCreationResponse: ActivityDraftCreationResponse = {
  draftId: '5046ec1c-c8f3-4d06-abf3-71ba4a73643c',
}

export const mockedActivityContentWithoutEnrolledStudent: ActivityContentDTO = {
  id: ACTIVITY_WITHOUT_ENROLLED_STUDENTS_ID,
  title: 'Activité publiée sans apprenant inscrit',
  thematic: EActivityThematic.SELF_KNOWLEDGE,
  summary: 'Résumé de l’activité publiée sans apprenant inscrit',
  description: 'Description de l’activité publiée sans apprenant inscrit',
  executionPeriodInfo: 'Semestre 1',
  enableReflection: true,
  traceAllowedAssociations: 3,
  feedbackAllowedIterations: 2,
  hasEnrolledStudent: false,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
  files: [
    {
      id: 'file-1',
      fileName: 'document.pdf',
      url: 'https://example.com/document.pdf',
      fileType: EFileType.PDF,
      fileSize: 102400,
      version: 1,
      uploadedAt: '2024-01-15T10:30:00'
    },
    {
      id: 'file-2',
      fileName: 'image.png',
      url: 'https://example.com/image.png',
      fileType: EFileType.PNG,
      fileSize: 204800,
      version: 1,
      uploadedAt: '2024-01-15T10:45:00'
    }
  ],
  links: ['http://example.com/resource1', 'http://example.com/resource2']
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

export const mockedActivityContentWithEnrolledStudent: ActivityContentDTO = {
  id: ACTIVITY_WITH_ENROLLED_STUDENTS_ID,
  title: 'Activité "CV" : Construire son parcours',
  thematic: EActivityThematic.RESUMES,
  summary: 'Résumé de l\'activité de test',
  description: 'Description détaillée de l\'activité de test',
  executionPeriodInfo: 'Semestre 1',
  enableReflection: false,
  traceAllowedAssociations: 3,
  feedbackAllowedIterations: 2,
  hasEnrolledStudent: true,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
}

export const mockedActivityContentWithFileAndLink: ActivityContentDTO = {
  id: ACTIVITY_WITH_FILE_AND_LINK_ID,
  title: 'Activité "CV" : Construire son parcours',
  thematic: EActivityThematic.TRANSVERSAL,
  summary: 'Résumé de l\'activité de test',
  description: 'Description détaillée de l\'activité de test',
  executionPeriodInfo: 'Semestre 1',
  enableReflection: false,
  traceAllowedAssociations: 3,
  feedbackAllowedIterations: 2,
  hasEnrolledStudent: true,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
  files: [
    {
      id: 'file-1',
      fileName: 'document.pdf',
      url: 'https://example.com/document.pdf',
      fileType: EFileType.PDF,
      fileSize: 102400,
      version: 1,
      uploadedAt: '2024-01-15T10:30:00'
    },
    {
      id: 'file-2',
      fileName: 'image.png',
      url: 'https://example.com/image.png',
      fileType: EFileType.PNG,
      fileSize: 204800,
      version: 1,
      uploadedAt: '2024-01-15T10:45:00'
    }
  ],
  links: ['http://example.com/resource1', 'http://example.com/resource2']
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
    author: mockedAuthor1,
  },
  {
    activityId: ACTIVITY_WITH_ENROLLED_STUDENTS_ID,
    title: 'Activité "CV" : Construire son parcours',
    thematic: EActivityThematic.RESUMES,
    activityStatus: EActivityStatus.PUBLISHED,
    updatedAt: '2024-02-10T09:00:00Z',
    author: mockedAuthor1,
  },
  {
    activityId: ACTIVITY_WITHOUT_ENROLLED_STUDENTS_ID,
    title: 'Activité publiée sans apprenant inscrit',
    thematic: EActivityThematic.SELF_KNOWLEDGE,
    activityStatus: EActivityStatus.PUBLISHED,
    updatedAt: '2024-02-15T09:00:00Z',
    author: mockedAuthor1,
  },
  {
    activityId: 'staff-activity-3',
    title: 'Activité "Trajectoires" : Explorer ses voies',
    thematic: EActivityThematic.TRAJECTORIES,
    activityStatus: EActivityStatus.PUBLISHED,
    updatedAt: '2024-03-05T14:00:00Z',
    author: mockedAuthor2,
  },
  {
    activityId: 'staff-activity-4',
    title: 'Activité "Expériences" : Valoriser ses expériences',
    thematic: EActivityThematic.EXPERIENCES,
    activityStatus: EActivityStatus.DRAFT,
    updatedAt: new Date().toISOString(),
    author: mockedAuthor2,
  },
  {
    activityId: 'staff-activity-5',
    title: 'Activité "Programmes" : Analyser son parcours',
    thematic: EActivityThematic.PROGRAMS,
    activityStatus: EActivityStatus.PUBLISHED,
    updatedAt: '2024-01-20T11:00:00Z',
    author: mockedAuthor1,
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
