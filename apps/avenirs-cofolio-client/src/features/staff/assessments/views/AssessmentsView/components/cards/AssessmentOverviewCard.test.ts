import type { VueWrapper } from '@vue/test-utils'
import type { AssessmentTableRow } from '@/features/staff/assessments/views/AssessmentsView/components/dataDisplay/AssessmentsList/AssessmentsList.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { EActivityAssessmentStatus } from '@/api/avenir-esr'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import { ROUTES } from '@/common/constants'
import { UserInfoStub } from '@/features/staff/admin/components/base/UserInfo/UserInfo.stub'
import { AssessmentStatusBadgeStub } from '@/features/staff/assessments/components/badges/AssessmentStatusBadge/AssessmentStatusBadge.stub'
import { AssessmentTypeBadgeStub } from '@/features/staff/assessments/components/badges/AssessmentTypeBadge/AssessmentTypeBadge.stub'
import { AssessmentActivityTitleStub } from '@/features/staff/assessments/views/AssessmentsView/components/AssessmentActivityTitle/AssessmentActivityTitle.stub'
import AssessmentOverviewCard from '@/features/staff/assessments/views/AssessmentsView/components/cards/AssessmentOverviewCard.vue'

const mockAssessment: AssessmentTableRow = {
  id: 'assessment-1',
  learner: {
    id: 'user-1',
    firstName: 'ALICE',
    lastName: 'DUPONT',
    email: 'alice.dupont@example.com',
  },
  activityTitle: 'Activité "Portfolio" : Valoriser ses expériences',
  type: 'default',
  submitDate: '2024-01-15T12:00:00Z',
  status: EActivityAssessmentStatus.NEW,
  actions: 'declared-activity-1',
}

BddTest().given('an assessment overview card', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssessmentOverviewCard>>

  const stubs = {
    RouterLink: RouterLinkStub,
    Card: CardStub,
    UserInfo: UserInfoStub,
    AssessmentActivityTitle: AssessmentActivityTitleStub,
    AssessmentTypeBadge: AssessmentTypeBadgeStub,
    AssessmentStatusBadge: AssessmentStatusBadgeStub,
  }

  const mountWith = (assessment: AssessmentTableRow = mockAssessment) => {
    wrapper = mount(AssessmentOverviewCard, {
      props: {
        assessment,
      },
      global: {
        stubs,
      },
    })
  }

  const getRouterLink = () => wrapper.findComponent(RouterLinkStub)
  const getCard = () => wrapper.findComponent(CardStub)
  const getUserInfo = () => wrapper.findComponent(UserInfoStub)
  const getActivityTitle = () => wrapper.findComponent(AssessmentActivityTitleStub)
  const getTypeBadge = () => wrapper.findComponent(AssessmentTypeBadgeStub)
  const getStatusBadge = () => wrapper.findComponent(AssessmentStatusBadgeStub)
  const getSubmitDate = () => wrapper.find('[data-testid="submitDate"]')

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should link to the activity assessment details page', () => {
      expect(getRouterLink().props('to')).toEqual({
        name: ROUTES.STAFF.ACTIVITY_ASSESSMENT.name,
        params: { declaredActivityId: mockAssessment.actions },
      })
    })

    BddTest().then('it should render the card with the assessment id attribute', () => {
      expect(getCard().attributes('data-assessment-id')).toBe(mockAssessment.id)
    })

    BddTest().then('it should render the user information', () => {
      expect(getUserInfo().props('user')).toEqual(mockAssessment.learner)
    })

    BddTest().then('it should render the activity title', () => {
      expect(getActivityTitle().props('activityTitle')).toBe(mockAssessment.activityTitle)
    })

    BddTest().then('it should render the activity type badge', () => {
      expect(getTypeBadge().props('activityType')).toBe(mockAssessment.type)
    })

    BddTest().then('it should render the submit date formatted', () => {
      expect(getSubmitDate().text()).toContain('Date de dépôt\u00A0:')
    })

    BddTest().then('it should render the assessment status badge', () => {
      expect(getStatusBadge().props('assessmentStatus')).toBe(mockAssessment.status)
    })
  })

  BddTest().when('the submit date is empty', () => {
    beforeEach(() => {
      mountWith({
        ...mockAssessment,
        submitDate: '',
      })
    })

    BddTest().then('it should not crash and render empty date string', () => {
      expect(getSubmitDate().text()).toBe('Date de dépôt\u00A0:')
    })
  })
})
