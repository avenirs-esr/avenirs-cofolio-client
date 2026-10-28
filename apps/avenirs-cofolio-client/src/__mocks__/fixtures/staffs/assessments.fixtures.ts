import type { DeclaredActivityAssessmentDetailsDTO } from '@/api/avenir-esr'
import { mockedActivityContentWithEnrolledStudent1 } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { declaredExperienceViewDTOFixture } from '@/__mocks__/fixtures/student'
import { createMockedSkillProgressDetailsDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import { mockedTraceDetailedWithFile } from '@/__mocks__/fixtures/student/traces.fixtures'
import { EDeclaredActivityStatus } from '@/api/avenir-esr'

export const mockedAssessmentDetailsWithAssociations: DeclaredActivityAssessmentDetailsDTO = {
  declaredActivityId: 'assessment-with-associations',
  activity: { ...mockedActivityContentWithEnrolledStudent1, enableReflection: true },
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
  status: EDeclaredActivityStatus.CONSULTED,
}

export const mockedAssessmentDetailsWithoutAssociations: DeclaredActivityAssessmentDetailsDTO = {
  ...mockedAssessmentDetailsWithAssociations,
  declaredActivityId: 'assessment-without-associations',
  activity: { ...mockedActivityContentWithEnrolledStudent1, enableReflection: false },
  reflexion: undefined,
  associations: {
    traces: [],
    skillProgresses: [],
    declaredExperiences: []
  }
}
