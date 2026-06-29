import type { VueWrapper } from '@vue/test-utils'
import { mockedFeedbackHistory } from '@/__mocks__/fixtures/staffs/feedbacks.fixtures'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { BaseApiException } from '@/common/exceptions'
import { FeedbackHistoryCardStub } from '@/features/staff/feedbacks/components/cards/FeedbackHistoryCard/FeedbackHistoryCard.stub'
import FeedbacksHistoryTab from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/interaction/tabs/FeedbacksHistoryTab/FeedbacksHistoryTab.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const feedbacks = mockedFeedbackHistory

const stubs = {
  QuerySuspense: QuerySuspenseStub,
  FeedbackHistoryCard: FeedbackHistoryCardStub,
}

BddTest().given('a feedback history tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof FeedbacksHistoryTab>>

  BddTest().when('the component is mounted with feedbacks', () => {
    beforeEach(() => {
      wrapper = mountComponent(FeedbacksHistoryTab, {
        props: { feedbacks, maxIterations: 3 },
        global: { stubs },
      })
    })

    BddTest().then('it should render a FeedbackHistoryCard for each feedback', () => {
      expect(wrapper.findAllComponents(FeedbackHistoryCardStub)).toHaveLength(feedbacks.length)
    })

    BddTest().then('it should pass the descending iteration to each card', () => {
      const cards = wrapper.findAllComponents(FeedbackHistoryCardStub)
      expect(cards[0].props('iteration')).toBe(3)
      expect(cards[1].props('iteration')).toBe(2)
      expect(cards[2].props('iteration')).toBe(1)
    })

    BddTest().then('it should forward feedback and maxIterations to each card', () => {
      const firstCard = wrapper.findAllComponents(FeedbackHistoryCardStub)[0]
      expect(firstCard.props('feedback')).toEqual(feedbacks[0])
      expect(firstCard.props('maxIterations')).toBe(3)
    })
  })

  BddTest().when('the component is mounted with an empty list', () => {
    beforeEach(() => {
      wrapper = mountComponent(FeedbacksHistoryTab, {
        props: { feedbacks: [] },
        global: { stubs },
      })
    })

    BddTest().then('it should render no card and show the empty state message', () => {
      expect(wrapper.findAllComponents(FeedbackHistoryCardStub)).toHaveLength(0)
      const emptyState = wrapper.find('[data-testid="query-suspense-empty"]')
      expect(emptyState.exists()).toBe(true)
      expect(emptyState.text()).toBe('Vous n\'avez aucun feedback précédent')
    })
  })

  BddTest().when('the component is loading', () => {
    beforeEach(() => {
      wrapper = mountComponent(FeedbacksHistoryTab, {
        props: { feedbacks: [], isLoading: true },
        global: { stubs },
      })
    })

    BddTest().then('it should show the loading state', () => {
      expect(wrapper.find('[data-testid="query-suspense-loading"]').exists()).toBe(true)
    })
  })

  BddTest().when('the component has an error', () => {
    beforeEach(() => {
      wrapper = mountComponent(FeedbacksHistoryTab, {
        props: { feedbacks: [], error: new BaseApiException('error') },
        global: { stubs },
      })
    })

    BddTest().then('it should show the error state', () => {
      expect(wrapper.find('[data-testid="query-suspense-error"]').exists()).toBe(true)
    })
  })
})
