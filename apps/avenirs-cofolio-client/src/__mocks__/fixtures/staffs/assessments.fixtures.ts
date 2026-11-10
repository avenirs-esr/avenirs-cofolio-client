import type { DeclaredActivityAssessmentDetailsDTO, DeclaredActivityToAssessDTO, PagedResponseDeclaredActivityToAssessDTO } from '@avenirs-esr/shared/api/avenir-esr'
import { EActivityAssessmentStatus, EActivityAssessmentType, EDeclaredActivityStatus } from '@avenirs-esr/shared/api/avenir-esr'
import { mockedActivityContentWithEnrolledStudent1 } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { declaredExperienceViewDTOFixture } from '@/__mocks__/fixtures/student'
import { createMockedSkillProgressDetailsDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import { mockedTraceDetailedWithFile } from '@/__mocks__/fixtures/student/traces.fixtures'

export const mockedAssessmentDetailsWithAssociations: DeclaredActivityAssessmentDetailsDTO = {
  declaredActivityId: 'assessment-with-associations',
  activity: {
    ...mockedActivityContentWithEnrolledStudent1,
    enableReflection: true,
    assessment: { comment: true, grade: 20 }
  },
  student: {
    id: 'student-1',
    firstName: 'Lucas',
    lastName: 'Tessier',
    email: 'lucas.tessier@university.com',
  },
  reflexion: '<p>Ma prise de recul sur cette activité</p>',
  associations: {
    traces: [mockedTraceDetailedWithFile],
    skillProgresses: [createMockedSkillProgressDetailsDTO('declared-skill-assessment')],
    declaredExperiences: [declaredExperienceViewDTOFixture]
  },
  submittedAt: '2024-01-15T12:00:00Z',
  status: EActivityAssessmentStatus.OPENED,
}

export const mockedAssessmentDetailsWithoutAssociations: DeclaredActivityAssessmentDetailsDTO = {
  ...mockedAssessmentDetailsWithAssociations,
  declaredActivityId: 'assessment-without-associations',
  activity: {
    ...mockedActivityContentWithEnrolledStudent1,
    enableReflection: false,
    assessment: { comment: true, validation: true }
  },
  reflexion: undefined,
  associations: {
    traces: [],
    skillProgresses: [],
    declaredExperiences: []
  }
}

export const mockedAssessmentDetailsCommentOnly: DeclaredActivityAssessmentDetailsDTO = {
  ...mockedAssessmentDetailsWithAssociations,
  declaredActivityId: 'assessment-comment-only',
  activity: {
    ...mockedAssessmentDetailsWithAssociations.activity,
    assessment: { comment: true }
  },
}

export const mockedAssessmentDetailsGradeOnly: DeclaredActivityAssessmentDetailsDTO = {
  ...mockedAssessmentDetailsWithAssociations,
  declaredActivityId: 'assessment-grade-only',
  activity: {
    ...mockedAssessmentDetailsWithAssociations.activity,
    assessment: { grade: 10 }
  },
}

export const mockedAssessmentDetailsValidationOnly: DeclaredActivityAssessmentDetailsDTO = {
  ...mockedAssessmentDetailsWithAssociations,
  declaredActivityId: 'assessment-validation-only',
  activity: {
    ...mockedAssessmentDetailsWithAssociations.activity,
    assessment: { validation: true }
  },
}

export const mockedAssessmentDetailsSent: DeclaredActivityAssessmentDetailsDTO = {
  ...mockedAssessmentDetailsWithAssociations,
  declaredActivityId: 'assessment-sent',
  assessment: {
    comment: 'Très bon travail, la prise de recul est pertinente.',
    grade: 16,
    requestedAt: '2024-01-15T12:00:00Z',
    assessedAt: '2024-01-20T09:30:00Z',
  },
  status: EActivityAssessmentStatus.SENT,
}

export const mockedDeclaredActivityToAssess1: DeclaredActivityToAssessDTO = {
  id: 'activity-to-assess-1',
  student: {
    id: 'student-1',
    firstName: 'Alice',
    lastName: 'Dupont',
    email: 'alice.dupont@test.fr',
  },
  activity: {
    id: 'activity-1',
    title: 'Activité 1',
  },
  submittedAt: '2024-01-15T12:00:00Z',
  assessmentTypes: [EActivityAssessmentType.COMMENT, EActivityAssessmentType.VALIDATION],
  declaredActivityStatus: EDeclaredActivityStatus.COMPLETED,
  assessmentStatus: EActivityAssessmentStatus.NEW,
}

export const mockedDeclaredActivityToAssess2: DeclaredActivityToAssessDTO = {
  id: 'activity-to-assess-2',
  student: {
    id: 'student-2',
    firstName: 'Bob',
    lastName: 'Martin',
    email: 'bob.martin@test.fr',
  },
  activity: {
    id: 'activity-2',
    title: 'Activité 2',
  },
  submittedAt: '2024-01-16T12:00:00Z',
  assessmentTypes: [EActivityAssessmentType.GRADE],
  declaredActivityStatus: EDeclaredActivityStatus.SUBMITTED_FOR_ASSESSMENT,
  assessmentStatus: EActivityAssessmentStatus.OPENED,
}

export const mockedDeclaredActivityToAssess3: DeclaredActivityToAssessDTO = {
  id: 'activity-to-assess-3',
  student: {
    id: 'student-3',
    firstName: 'Charlie',
    lastName: 'Durand',
    email: 'charlie.durand@test.fr',
  },
  activity: {
    id: 'activity-3',
    title: 'Activité 3',
  },
  submittedAt: '2024-01-17T12:00:00Z',
  assessmentTypes: [],
  declaredActivityStatus: EDeclaredActivityStatus.COMPLETED,
  assessmentStatus: EActivityAssessmentStatus.SENT,
}

export const allMockedDeclaredActivitiesToAssess: DeclaredActivityToAssessDTO[] = [
  mockedDeclaredActivityToAssess1,
  mockedDeclaredActivityToAssess2,
  mockedDeclaredActivityToAssess3,
]

export function createMockedPagedResponseDeclaredActivitiesToAssessDTO (
  pageSize: number = 12,
  page: number = 0,
  statuses?: EActivityAssessmentStatus[]
): PagedResponseDeclaredActivityToAssessDTO {
  let filtered = allMockedDeclaredActivitiesToAssess
  if (statuses && statuses.length > 0) {
    filtered = filtered.filter(item => statuses.includes(item.assessmentStatus))
  }
  const start = page * pageSize
  const end = start + pageSize
  const paginatedData = filtered.slice(start, end)
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))

  return {
    data: paginatedData,
    page: {
      pageSize,
      totalElements: filtered.length,
      totalPages,
      page,
    },
  }
}
