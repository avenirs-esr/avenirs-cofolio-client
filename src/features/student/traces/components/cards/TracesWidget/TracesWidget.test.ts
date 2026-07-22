import { createTraceOverviewHandler, traceOverviewErrorHandler } from '@/__mocks__/msw/handlers/student/traces.handlers'
import { server } from '@/__mocks__/msw/server'
import { HomeWidgetStub } from '@/common/components/cards/HomeWidget/HomeWidget.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { TraceLongIconCardStub } from '@/features/student/global/views/StudentHomeView/components/TraceLongIconCard/TraceLongIconCard.stub'
import TracesWidget from '@/features/student/traces/components/cards/TracesWidget/TracesWidget.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, vi } from 'vitest'

BddTest().given('a student traces widget', async () => {
  let wrapper: VueWrapper

  const stubs = {
    HomeWidget: HomeWidgetStub,
    TraceLongIconCard: TraceLongIconCardStub,
    QuerySuspense: QuerySuspenseStub,
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    const handler = createTraceOverviewHandler()
    server.use(handler)

    wrapper = mountComponent(TracesWidget, {
      global: { stubs },
    })

    await vi.waitFor(() => {
      expect(wrapper.find('.home-main-widget').exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should display up to 3 traces', async () => {
      await vi.waitFor(() => {
        const traceLongIconCards = wrapper.findAllComponents({ name: 'TraceLongIconCard' })
        expect(traceLongIconCards).toHaveLength(3)
      })
    })
  })

  BddTest().when('the API returns an error', () => {
    beforeEach(async () => {
      server.use(traceOverviewErrorHandler)

      wrapper = mountComponent(TracesWidget, {
        global: { stubs },
      })

      await flushPromises()
    })

    BddTest().then('it should display the query suspense error state', async () => {
      await vi.waitFor(() => {
        expect(wrapper.findComponent(QuerySuspenseStub).exists()).toBe(true)
        expect(wrapper.find('[data-testid="query-suspense-error"]').exists()).toBe(true)
      })
    })
  })
})
