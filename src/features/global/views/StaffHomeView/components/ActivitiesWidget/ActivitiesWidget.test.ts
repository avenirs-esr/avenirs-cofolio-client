import { getStaffActivityWorkingSpaceErrorHandler, getStaffActivityWorkingSpaceOverviewHandler } from '@/__mocks__/msw/handlers/staffs/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { HomeWidgetStub } from '@/common/components/cards/HomeWidget/HomeWidget.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import ActivitiesWidget from '@/features/global/views/StaffHomeView/components/ActivitiesWidget/ActivitiesWidget.vue'
import { ActivityLongIconCardStub } from '@/features/global/views/StaffHomeView/components/ActivityLongIconCard/ActivityLongIconCard.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, vi } from 'vitest'

BddTest().given('an activities widget', async () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivitiesWidget>>

  const stubs = {
    HomeWidget: HomeWidgetStub,
    ActivityLongIconCard: ActivityLongIconCardStub,
    QuerySuspense: QuerySuspenseStub
  }

  BddTest().when('the component is mounted with isDraft prop', () => {
    const props = { isDraft: true }

    BddTest().and('the query succeeds', () => {
      beforeEach(async () => {
        vi.clearAllMocks()
        server.use(getStaffActivityWorkingSpaceOverviewHandler)

        wrapper = mountComponent(ActivitiesWidget, { props, global: { stubs } })

        await flushPromises()
      })

      BddTest().then('it should render the draft activities widget', () => {
        expect(wrapper.findComponent(HomeWidgetStub).exists()).toBe(true)
        expect(wrapper.find('[data-testid="draft-activities-widget"]').exists()).toBe(true)
      })

      BddTest().then('it should render the activity long icon cards', async () => {
        await vi.waitFor(() => {
          const cards = wrapper.findAllComponents(ActivityLongIconCardStub)
          expect(cards.length).toBeGreaterThan(0)
        })
      })
    })

    BddTest().and('the query fails', () => {
      beforeEach(async () => {
        vi.clearAllMocks()
        server.use(getStaffActivityWorkingSpaceErrorHandler)

        wrapper = mountComponent(ActivitiesWidget, { props, global: { stubs } })

        await flushPromises()
      })

      BddTest().then('it should render the draft activities widget', () => {
        expect(wrapper.findComponent(HomeWidgetStub).exists()).toBe(true)
        expect(wrapper.find('[data-testid="draft-activities-widget"]').exists()).toBe(true)
      })

      BddTest().then('it should render the query suspense error state', () => {
        expect(wrapper.find('[data-testid="query-suspense-error"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="query-suspense-error"]').text()).toContain('Une erreur est survenue lors de la récupération de vos activités modifiées.')
      })
    })
  })

  BddTest().when('the component is mounted without isDraft prop', () => {
    const props = { isDraft: false }

    BddTest().and('the query succeeds', () => {
      beforeEach(async () => {
        vi.clearAllMocks()
        server.use(getStaffActivityWorkingSpaceOverviewHandler)

        wrapper = mountComponent(ActivitiesWidget, { props, global: { stubs } })

        await flushPromises()
      })

      BddTest().then('it should render the published activities widget', () => {
        expect(wrapper.findComponent(HomeWidgetStub).exists()).toBe(true)
        expect(wrapper.find('[data-testid="published-activities-widget"]').exists()).toBe(true)
      })

      BddTest().then('it should render the activity long icon cards', async () => {
        await vi.waitFor(() => {
          const cards = wrapper.findAllComponents(ActivityLongIconCardStub)
          expect(cards.length).toBeGreaterThan(0)
        })
      })
    })

    BddTest().and('the query fails', () => {
      beforeEach(async () => {
        vi.clearAllMocks()
        server.use(getStaffActivityWorkingSpaceErrorHandler)

        wrapper = mountComponent(ActivitiesWidget, { props, global: { stubs } })

        await flushPromises()
      })

      BddTest().then('it should render the published activities widget', () => {
        expect(wrapper.findComponent(HomeWidgetStub).exists()).toBe(true)
        expect(wrapper.find('[data-testid="published-activities-widget"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="published-activities-widget"]').text()).toContain('Une erreur est survenue lors de la récupération de vos activités publiées.')
      })

      BddTest().then('it should render the query suspense error state', () => {
        expect(wrapper.find('[data-testid="query-suspense-error"]').exists()).toBe(true)
      })
    })
  })
})
