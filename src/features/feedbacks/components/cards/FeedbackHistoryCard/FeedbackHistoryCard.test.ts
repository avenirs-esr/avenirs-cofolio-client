import type { FeedbackOverviewDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import type { PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { EFeedbackStatus } from '@/api/avenir-esr'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import { ROUTES } from '@/common/constants'
import { FeedbackIterationBadgeStub } from '@/features/feedbacks/components/badges/FeedbackIterationBadge/FeedbackIterationBadge.stub'
import FeedbackHistoryCard from '@/features/feedbacks/components/cards/FeedbackHistoryCard/FeedbackHistoryCard.vue'
import { AvButtonStub, AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const feedback: FeedbackOverviewDTO = {
  id: 'feedback-1',
  staff: {
    id: 'staff-1',
    email: 'staff@test.fr',
    firstName: 'Marc',
    lastName: 'Dupont',
  },
  student: {
    id: 'student-1',
    email: 'student@test.fr',
    firstName: 'Alice',
    lastName: 'Martin',
  },
  feedback: 'Il faudrait que vous puissiez citer vos références méthodologiques.',
  status: EFeedbackStatus.SUBMITTED,
  createdAt: '2025-12-12T10:00:00.000Z',
  updatedAt: '2026-02-07T10:00:00.000Z',
}

const AvButtonWithToStub = {
  ...AvButtonStub,
  props: {
    ...AvButtonStub.props,
    to: { type: [String, Object] as PropType<string | RouteLocationRaw> | undefined, default: undefined },
  },
}

const stubs = {
  Card: CardStub,
  AvIcon: AvIconStub,
  FeedbackIterationBadge: FeedbackIterationBadgeStub,
  AvButton: AvButtonWithToStub,
}

BddTest().given('a FeedbackHistoryCard component', () => {
  let wrapper: VueWrapper<InstanceType<typeof FeedbackHistoryCard>>

  BddTest().when('the component is mounted in collapsed state', () => {
    beforeEach(() => {
      wrapper = mountComponent(FeedbackHistoryCard, {
        props: { feedback, iteration: 1, maxIterations: 3, collapsed: true },
        global: { stubs },
      })
    })

    BddTest().then('it should render a collapsible card', () => {
      const card = wrapper.findComponent(CardStub)
      expect(card.exists()).toBe(true)
      expect(card.props('collapsible')).toBe(true)
      expect(card.props('collapsed')).toBe(true)
    })

    BddTest().then('it should render the iteration badge with correct props', () => {
      const badge = wrapper.findComponent(FeedbackIterationBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('iteration')).toBe(1)
      expect(badge.props('maxIterations')).toBe(3)
    })

    BddTest().then('it should render the createdAt date formatted', () => {
      expect(wrapper.find('[data-testid="feedback-history-card-date"]').text()).toBe('12/12/2025')
    })

    BddTest().then('it should render the author line with updatedAt date', () => {
      expect(wrapper.find('[data-testid="feedback-history-card-author"]').text()).toContain('07/02/2026')
    })

    BddTest().then('it should render the detail button with DEFAULT variant', () => {
      const button = wrapper.findComponent(AvButtonWithToStub)
      expect(button.exists()).toBe(true)
      expect(button.props('variant')).toBe('DEFAULT')
    })

    BddTest().then('it should render the detail button label with createdAt date', () => {
      const button = wrapper.findComponent(AvButtonWithToStub)
      expect(button.props('label')).toContain('12/12/2025')
    })
  })

  BddTest().when('the detail button is rendered', () => {
    beforeEach(() => {
      wrapper = mountComponent(FeedbackHistoryCard, {
        props: { feedback, iteration: 1, collapsed: false },
        global: { stubs },
      })
    })

    BddTest().then('it should link to the feedback details route', () => {
      const button = wrapper.findComponent(AvButtonWithToStub)
      expect(button.props('to')).toEqual({
        name: ROUTES.STAFF.STUDENT_TRACKING.ACTIVITY_FEEDBACK.name,
        params: { feedbackId: feedback.id },
      })
    })
  })

  BddTest().when('the component is mounted in expanded state', () => {
    beforeEach(() => {
      wrapper = mountComponent(FeedbackHistoryCard, {
        props: { feedback, iteration: 1, maxIterations: 3, collapsed: false },
        global: { stubs },
      })
    })

    BddTest().then('it should render the card as not collapsed', () => {
      const card = wrapper.findComponent(CardStub)
      expect(card.props('collapsed')).toBe(false)
    })

    BddTest().then('it should render the feedback content', () => {
      const content = wrapper.find('[data-testid="feedback-history-card-content"]')
      expect(content.exists()).toBe(true)
      expect(content.text()).toBe(feedback.feedback)
    })
  })

  BddTest().when('the component is mounted without feedback content', () => {
    beforeEach(() => {
      wrapper = mountComponent(FeedbackHistoryCard, {
        props: { feedback: { ...feedback, feedback: undefined }, iteration: 1, collapsed: false },
        global: { stubs },
      })
    })

    BddTest().then('it should not render the feedback content element', () => {
      expect(wrapper.find('[data-testid="feedback-history-card-content"]').exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted without maxIterations', () => {
    beforeEach(() => {
      wrapper = mountComponent(FeedbackHistoryCard, {
        props: { feedback, iteration: 2 },
        global: { stubs },
      })
    })

    BddTest().then('it should pass iteration to the badge without maxIterations', () => {
      const badge = wrapper.findComponent(FeedbackIterationBadgeStub)
      expect(badge.props('iteration')).toBe(2)
      expect(badge.props('maxIterations')).toBeUndefined()
    })
  })
})
