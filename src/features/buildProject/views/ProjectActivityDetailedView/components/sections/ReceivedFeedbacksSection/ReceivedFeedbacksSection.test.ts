import type { DeclaredActivityDetailsDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { mockedDeclaredActivityDetails } from '@/__mocks__/fixtures/student/activities.fixtures'
import { EFeedbackStatus } from '@/api/avenir-esr'
import { FeedbackCardStub } from '@/features/buildProject/views/ProjectActivityDetailedView/components/cards/FeedbackCard/FeedbackCard.stub'
import ReceivedFeedbacksSection from '@/features/buildProject/views/ProjectActivityDetailedView/components/sections/ReceivedFeedbacksSection/ReceivedFeedbacksSection.vue'
import { AvCardStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const submittedFeedback1 = {
  id: 'feedback-1',
  staff: { id: 'staff-1', email: 'staff@test.fr', firstName: 'Marc', lastName: 'Perceval' },
  student: { id: 'student-1', email: 'student@test.fr', firstName: 'Alice', lastName: 'Martin' },
  feedback: 'Premier feedback soumis',
  status: EFeedbackStatus.SUBMITTED,
  createdAt: '2025-05-05T10:00:00.000Z',
  updatedAt: '2025-05-05T10:00:00.000Z',
}

const submittedFeedback2 = {
  id: 'feedback-2',
  staff: { id: 'staff-1', email: 'staff@test.fr', firstName: 'Marc', lastName: 'Perceval' },
  student: { id: 'student-1', email: 'student@test.fr', firstName: 'Alice', lastName: 'Martin' },
  feedback: 'Deuxième feedback soumis',
  status: EFeedbackStatus.SUBMITTED,
  createdAt: '2025-06-01T10:00:00.000Z',
  updatedAt: '2025-06-01T10:00:00.000Z',
}

const nonSubmittedFeedback = {
  id: 'feedback-3',
  staff: { id: 'staff-1', email: 'staff@test.fr', firstName: 'Marc', lastName: 'Perceval' },
  student: { id: 'student-1', email: 'student@test.fr', firstName: 'Alice', lastName: 'Martin' },
  feedback: 'Feedback non soumis',
  status: EFeedbackStatus.NEW,
  createdAt: '2025-06-10T10:00:00.000Z',
  updatedAt: '2025-06-10T10:00:00.000Z',
}

const stubs = {
  FeedbackCard: FeedbackCardStub,
  AvCard: AvCardStub,
}

BddTest().given('a ReceivedFeedbacksSection component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ReceivedFeedbacksSection>>

  BddTest().when('feedbackAllowedIterations is limited and no submitted feedbacks', () => {
    beforeEach(() => {
      wrapper = mountComponent(ReceivedFeedbacksSection, {
        props: { declaredActivityDetails: mockedDeclaredActivityDetails },
        global: { stubs },
      })
    })

    BddTest().then('it should render the section', () => {
      expect(wrapper.find('[data-testid="received-feedbacks-section"]').exists()).toBe(true)
    })

    BddTest().then('it should render the title in plural with count 0 out of max', () => {
      expect(wrapper.find('[data-testid="received-feedbacks-section-title"]').text()).toBe('Feedbacks reçus (0/10)')
    })

    BddTest().then('it should not render any FeedbackCard', () => {
      expect(wrapper.findAllComponents(FeedbackCardStub)).toHaveLength(0)
    })

    BddTest().then('it should render the empty state', () => {
      expect(wrapper.find('[data-testid="received-feedbacks-section-empty"]').exists()).toBe(true)
    })

    BddTest().then('it should display the empty state message', () => {
      expect(wrapper.find('[data-testid="received-feedbacks-section-empty"]').text()).toContain('Vous n\'avez reçu aucun feedback pour le moment')
    })
  })

  BddTest().when('feedbackAllowedIterations is limited and only non-submitted feedbacks', () => {
    beforeEach(() => {
      wrapper = mountComponent(ReceivedFeedbacksSection, {
        props: {
          declaredActivityDetails: {
            ...mockedDeclaredActivityDetails,
            feedbacks: [nonSubmittedFeedback],
          },
        },
        global: { stubs },
      })
    })

    BddTest().then('it should not render any FeedbackCard', () => {
      expect(wrapper.findAllComponents(FeedbackCardStub)).toHaveLength(0)
    })

    BddTest().then('it should render the empty state', () => {
      expect(wrapper.find('[data-testid="received-feedbacks-section-empty"]').exists()).toBe(true)
    })
  })

  BddTest().when('feedbackAllowedIterations is limited and has submitted feedbacks', () => {
    const declaredActivityDetails: DeclaredActivityDetailsDTO = {
      ...mockedDeclaredActivityDetails,
      feedbacks: [submittedFeedback1, submittedFeedback2],
    }

    beforeEach(() => {
      wrapper = mountComponent(ReceivedFeedbacksSection, {
        props: { declaredActivityDetails },
        global: { stubs },
      })
    })

    BddTest().then('it should render the title in plural with submitted count and max', () => {
      expect(wrapper.find('[data-testid="received-feedbacks-section-title"]').text()).toBe('Feedbacks reçus (2/10)')
    })

    BddTest().then('it should render one FeedbackCard per submitted feedback', () => {
      expect(wrapper.findAllComponents(FeedbackCardStub)).toHaveLength(2)
    })

    BddTest().then('it should pass correct props to each FeedbackCard', () => {
      const cards = wrapper.findAllComponents(FeedbackCardStub)
      expect(cards[0].props('feedback')).toEqual(submittedFeedback1)
      expect(cards[1].props('feedback')).toEqual(submittedFeedback2)
    })

    BddTest().then('it should not render the empty state', () => {
      expect(wrapper.find('[data-testid="received-feedbacks-section-empty"]').exists()).toBe(false)
    })
  })

  BddTest().when('feedbackAllowedIterations is limited and has mixed feedback statuses', () => {
    beforeEach(() => {
      wrapper = mountComponent(ReceivedFeedbacksSection, {
        props: {
          declaredActivityDetails: {
            ...mockedDeclaredActivityDetails,
            feedbacks: [submittedFeedback1, nonSubmittedFeedback],
          },
        },
        global: { stubs },
      })
    })

    BddTest().then('it should count only submitted feedbacks in the title', () => {
      expect(wrapper.find('[data-testid="received-feedbacks-section-title"]').text()).toBe('Feedback reçu (1/10)')
    })

    BddTest().then('it should render only submitted FeedbackCards', () => {
      const cards = wrapper.findAllComponents(FeedbackCardStub)
      expect(cards).toHaveLength(1)
      expect(cards[0].props('feedback')).toEqual(submittedFeedback1)
    })
  })

  BddTest().when('feedbackAllowedIterations is unlimited (-1) and has submitted feedbacks', () => {
    beforeEach(() => {
      wrapper = mountComponent(ReceivedFeedbacksSection, {
        props: {
          declaredActivityDetails: {
            ...mockedDeclaredActivityDetails,
            activity: { ...mockedDeclaredActivityDetails.activity, feedbackAllowedIterations: -1 },
            feedbacks: [submittedFeedback1, submittedFeedback2],
          },
        },
        global: { stubs },
      })
    })

    BddTest().then('it should render the title in plural with count only', () => {
      expect(wrapper.find('[data-testid="received-feedbacks-section-title"]').text()).toBe('Feedbacks reçus (2)')
    })
  })
})
