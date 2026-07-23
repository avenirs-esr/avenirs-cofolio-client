import { getStaffFeedbacksErrorHandler, getStaffFeedbacksOverviewHandler } from '@/__mocks__/msw/handlers/staffs/feedbacks.handlers'
import { server } from '@/__mocks__/msw/server'
import { HomeWidgetStub } from '@/common/components/cards/HomeWidget/HomeWidget.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { FeedbackLongIconCardStub } from '@/features/staff/global/views/StaffHomeView/components/FeedbackLongIconCard/FeedbackLongIconCard.stub'
import FeedbacksWidget from '@/features/staff/global/views/StaffHomeView/components/FeedbacksWidget/FeedbacksWidget.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, vi } from 'vitest'

BddTest().given('a feedbacks widget', async () => {
  let wrapper: VueWrapper<InstanceType<typeof FeedbacksWidget>>

  const stubs = {
    HomeWidget: HomeWidgetStub,
    FeedbackLongIconCard: FeedbackLongIconCardStub,
    QuerySuspense: QuerySuspenseStub
  }

  BddTest().when('the component is mounted', () => {
    const props = { isNew: true }

    BddTest().and('the query succeeds', () => {
      beforeEach(async () => {
        vi.clearAllMocks()
        server.use(getStaffFeedbacksOverviewHandler)

        wrapper = mountComponent(FeedbacksWidget, { props, global: { stubs } })

        await flushPromises()
      })

      BddTest().then('it should render the feedbacks widget', () => {
        expect(wrapper.findComponent(HomeWidgetStub).exists()).toBe(true)
        expect(wrapper.find('[data-testid="feedbacks-widget"]').exists()).toBe(true)
      })

      BddTest().then('it should render the feedback long icon cards', async () => {
        await vi.waitFor(() => {
          const cards = wrapper.findAllComponents(FeedbackLongIconCardStub)
          expect(cards.length).toBeGreaterThan(0)
        })
      })
    })

    BddTest().and('the query fails', () => {
      beforeEach(async () => {
        vi.clearAllMocks()
        server.use(getStaffFeedbacksErrorHandler)

        wrapper = mountComponent(FeedbacksWidget, { props, global: { stubs } })

        await flushPromises()
      })

      BddTest().then('it should render the feedbacks widget', () => {
        expect(wrapper.findComponent(HomeWidgetStub).exists()).toBe(true)
        expect(wrapper.find('[data-testid="feedbacks-widget"]').exists()).toBe(true)
      })

      BddTest().then('it should render the query suspense error state', () => {
        expect(wrapper.find('[data-testid="query-suspense-error"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="query-suspense-error"]').text()).toContain('Une erreur est survenue lors de la récupération de vos demandes de feedback.')
      })
    })
  })
})
