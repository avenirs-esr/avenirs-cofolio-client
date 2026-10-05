import type {
  ActivityContentDTO,
  ActivityDashboardDTO,
  ActivityDraftCreationResponse,
  ActivityDraftUpdateResponse,
  ActivityStaffOverviewDTO,
  AuthorDTO,
  FileDTO,
  InactiveStudentDTO,
  PagedResponseActivityStaffOverviewDTO
} from '@/api/avenir-esr'
import { mockedProfileOverview } from '@/__mocks__/fixtures/student/overviews.fixtures'
import { EActivityStatus, EActivityThematic, EFileType } from '@/api/avenir-esr'
import { getFileTypeFromFileName } from '@/common/utils/file/file'

export const ACTIVITY_WITH_ENROLLED_STUDENTS_ID
  = '8c5d1f77-2a9e-4b33-9f6c-1e4b7a2d9c11'

export const ACTIVITY_WITHOUT_ENROLLED_STUDENTS_ID
  = '2c9e4b77-6a1f-4d55-8b3c-7e2d1a9f4c22'

export const ACTIVITY_WITH_FILE_AND_LINK_ID
  = '3f7c9a2e-5d44-4b7a-9c6f-2a6e8e91b1a1'

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
export const mockedConnectedStaff: AuthorDTO = {
  userId: mockedProfileOverview.id,
  firstName: mockedProfileOverview.firstname,
  lastName: mockedProfileOverview.lastname,
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
  recommendedCompletionContexts: 'Semestre 1',
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
      uploadedAt: '2024-01-15T10:30:00'
    },
    {
      id: 'file-2',
      fileName: 'image.png',
      url: 'https://example.com/image.png',
      fileType: EFileType.PNG,
      fileSize: 204800,
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
  recommendedCompletionContexts: 'Semestre 1',
  enableReflection: false,
  traceAllowedAssociations: 3,
  feedbackAllowedIterations: 2,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
}

export const mockedActivityContentWithEnrolledStudent1: ActivityContentDTO = {
  id: ACTIVITY_WITH_ENROLLED_STUDENTS_ID,
  title: 'Activité "CV" : Construire son parcours',
  thematic: EActivityThematic.RESUMES,
  summary: 'Résumé de l\'activité de test',
  description: 'Description détaillée de l\'activité de test',
  recommendedCompletionContexts: 'Semestre 1',
  enableReflection: false,
  traceAllowedAssociations: 3,
  feedbackAllowedIterations: 2,
  hasEnrolledStudent: true,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
}

export const mockedActivityContentWithEnrolledStudent2: ActivityContentDTO = {
  id: '2a9f6c4d-8b1e-4d33-9c7a-5e2b8f1c6d77',
  title: 'Activité de test',
  thematic: EActivityThematic.TRANSVERSAL,
  summary: 'Résumé activité test',
  description: 'Description activité test',
  recommendedCompletionContexts: 'Semestre 1',
  enableReflection: false,
  traceAllowedAssociations: 3,
  feedbackAllowedIterations: 5,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-16T10:00:00Z',
}

export const mockedActivityContentWithEnrolledStudent3: ActivityContentDTO = {
  id: '7c1e4a2b-9d3f-4e5c-8a6b-1f2d3e4c5b6a',
  title: 'Bilan de compétences',
  thematic: EActivityThematic.SELF_KNOWLEDGE,
  summary: 'Résumé bilan de compétences',
  description: 'Description bilan de compétences',
  recommendedCompletionContexts: 'Semestre 1',
  enableReflection: true,
  traceAllowedAssociations: 2,
  feedbackAllowedIterations: 1,
  createdAt: '2024-02-01T09:00:00Z',
  updatedAt: '2024-02-02T09:00:00Z',
}

export const mockedActivityContentWithEnrolledStudent4: ActivityContentDTO = {
  id: '4f5e6d7c-8b9a-4c1d-9e2f-3a4b5c6d7e8f',
  title: 'Projet professionnel',
  thematic: EActivityThematic.FUTURE_PLANS,
  summary: 'Résumé projet professionnel',
  description: 'Description projet professionnel',
  recommendedCompletionContexts: 'Semestre 2',
  enableReflection: true,
  traceAllowedAssociations: 4,
  feedbackAllowedIterations: 3,
  createdAt: '2024-03-10T14:00:00Z',
  updatedAt: '2024-03-11T14:00:00Z',
}

export const mockedActivityContentWithFileAndLink: ActivityContentDTO = {
  id: ACTIVITY_WITH_FILE_AND_LINK_ID,
  title: 'Activité "Connaissance de soi"\u00A0: Définir ses valeurs',
  thematic: EActivityThematic.SELF_KNOWLEDGE,
  summary: 'Résumé de l\'activité de test',
  description: 'Description détaillée de l\'activité de test',
  recommendedCompletionContexts: 'Semestre 1',
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
      uploadedAt: '2024-01-15T10:30:00'
    },
    {
      id: 'file-2',
      fileName: 'definir-ses-valeurs-exercices.docx',
      url: 'https://example.com/definir-ses-valeurs-exercices.docx',
      fileType: EFileType.DOCX,
      fileSize: 204800,
      uploadedAt: '2024-01-15T10:45:00'
    }
  ],
  links: ['http://example.com/resource1', 'https://example.com/definir-ses-valeurs']
}

export const mockedActivityDraftUpdateResponse: ActivityDraftUpdateResponse = {
  draftId: '5046ec1c-c8f3-4d06-abf3-71ba4a73643c',
}

export const allStaffActivities: ActivityStaffOverviewDTO[] = [
  {
    activityId: ACTIVITY_WITH_FILE_AND_LINK_ID,
    title: 'Activité "Connaissance de soi"\u00A0: Définir ses valeurs',
    thematic: EActivityThematic.SELF_KNOWLEDGE,
    activityStatus: EActivityStatus.PUBLISHED,
    updatedAt: '2024-01-15T10:00:00Z',
    author: mockedConnectedStaff,
  },
  {
    activityId: ACTIVITY_WITH_ENROLLED_STUDENTS_ID,
    title: 'Activité "CV" : Construire son parcours',
    thematic: EActivityThematic.RESUMES,
    activityStatus: EActivityStatus.PUBLISHED,
    updatedAt: '2024-02-10T09:00:00Z',
    author: mockedConnectedStaff,
  },
  {
    activityId: ACTIVITY_WITHOUT_ENROLLED_STUDENTS_ID,
    title: 'Activité publiée sans apprenant inscrit',
    thematic: EActivityThematic.SELF_KNOWLEDGE,
    activityStatus: EActivityStatus.PUBLISHED,
    updatedAt: '2024-02-15T09:00:00Z',
    author: mockedConnectedStaff,
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
    author: mockedConnectedStaff,
  },
  {
    activityId: 'staff-activity-5',
    title: 'Activité "Programmes" : Analyser son parcours',
    thematic: EActivityThematic.PROGRAMS,
    activityStatus: EActivityStatus.PUBLISHED,
    updatedAt: '2024-01-20T11:00:00Z',
    author: mockedConnectedStaff,
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
  page: number,
  status?: EActivityStatus | null
): PagedResponseActivityStaffOverviewDTO {
  const actualTotalElements = Math.min(totalElements, allStaffActivities.length)
  const start = page * pageSize
  const end = start + pageSize
  const paginatedActivities = allStaffActivities.slice(start, end).map((activity) => {
    return status ? { ...activity, activityStatus: status } : activity
  })
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
    url: 'exemple.com/image',
    uploadedAt: '2024-01-15T10:30:00'
  }
}

export function getMockedActivityDashboard (
  uniqueStudentViews: number,
  enrolledStudents: number,
  unsubscriptionsLast30Days: number,
  inactiveStudentsLast30Days: number
): ActivityDashboardDTO {
  return { uniqueStudentViews, enrolledStudents, unsubscriptionsLast30Days, inactiveStudentsLast30Days }
}

export const mockedActivityDashboard = getMockedActivityDashboard(128, 42, 3, 23)

export const mockedInactiveStudents: InactiveStudentDTO[] = [
  {
    student: {
      id: 'f1b9c6d2-8a47-4e31-9c25-7d0a3e5b1f84',
      firstName: 'Camille',
      lastName: 'Fontaine',
      email: 'camille.fontaine@exemple.fr',
    },
    enrolledAt: '2026-01-12T09:15:00Z',
    lastViewedAt: '2026-04-30T14:20:00Z',
  },
  {
    student: {
      id: '0d3a7e91-5c62-4b88-a1f4-9e2c6b7d0a35',
      firstName: 'Hugo',
      lastName: 'Berger',
      email: 'hugo.berger@exemple.fr',
    },
    enrolledAt: '2026-02-03T10:45:00Z',
    lastViewedAt: '2026-05-18T08:05:00Z',
  },
  {
    student: {
      id: '6b2f4c08-9d13-47ae-85c7-3a1e0f9b6d42',
      firstName: 'Sarah',
      lastName: 'Lemoine',
      email: 'sarah.lemoine@exemple.fr',
    },
    enrolledAt: '2026-03-21T16:30:00Z',
  },
]
