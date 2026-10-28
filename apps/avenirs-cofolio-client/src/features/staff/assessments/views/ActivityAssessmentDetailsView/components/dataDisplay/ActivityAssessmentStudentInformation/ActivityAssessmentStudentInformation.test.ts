import type { VueWrapper } from '@vue/test-utils'
import type { ActivityAssessmentStudentInformationProps } from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/components/dataDisplay/ActivityAssessmentStudentInformation/ActivityAssessmentStudentInformation.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'
import { EDeclaredActivityStatus } from '@/api/avenir-esr'
import { AssessmentStatusBadgeStub } from '@/features/staff/assessments/components/badges/AssessmentStatusBadge/AssessmentStatusBadge.stub'
import ActivityAssessmentStudentInformation from '@/features/staff/assessments/views/ActivityAssessmentDetailsView/components/dataDisplay/ActivityAssessmentStudentInformation/ActivityAssessmentStudentInformation.vue'

BddTest().given('an activity assessment student information', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityAssessmentStudentInformation>>

  const props: ActivityAssessmentStudentInformationProps = {
    student: {
      id: 'student-1',
      firstName: 'Lucas',
      lastName: 'Tessier',
      email: 'lucas.tessier@university.com',
    },
    submittedAt: '2024-01-15T12:00:00Z',
    status: EDeclaredActivityStatus.CONSULTED,
  }

  const stubs = { AssessmentStatusBadge: AssessmentStatusBadgeStub }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountComponent(ActivityAssessmentStudentInformation, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should render the learner full name', () => {
      expect(wrapper.find('[data-testid="activity-assessment-student-name"]').text()).toBe('Lucas Tessier')
    })

    BddTest().then('it should render the assessment status badge with the submission status', () => {
      expect(wrapper.findComponent(AssessmentStatusBadgeStub).props('assessmentStatus')).toBe(EDeclaredActivityStatus.CONSULTED)
    })

    BddTest().then('it should render the submission date', () => {
      expect(wrapper.find('[data-testid="activity-assessment-submission-details"]').text()).toContain('Soumise le 15 janvier 2024')
    })

    BddTest().then('it should render the learner email', () => {
      expect(wrapper.find('[data-testid="activity-assessment-submission-details"]').text()).toContain('lucas.tessier@university.com')
    })
  })
})
