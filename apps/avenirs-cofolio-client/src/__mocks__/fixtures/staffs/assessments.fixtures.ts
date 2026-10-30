import type { DeclaredActivityAssessmentDetailsDTO } from '@/api/avenir-esr'
import { mockedActivityContentWithEnrolledStudent1 } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { declaredExperienceViewDTOFixture } from '@/__mocks__/fixtures/student'
import { createMockedSkillProgressDetailsDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import { mockedTraceDetailedWithFile } from '@/__mocks__/fixtures/student/traces.fixtures'
import { EActivityAssessmentStatus } from '@/api/avenir-esr'

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
