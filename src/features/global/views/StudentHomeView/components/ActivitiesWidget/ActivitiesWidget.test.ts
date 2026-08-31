import { latestActivitiesErrorHandler, latestActivitiesOverviewHandler, libraryActivitiesErrorHandler } from '@/__mocks__/msw/handlers/student/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { HomeWidgetStub } from '@/common/components/cards/HomeWidget/HomeWidget.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import ActivitiesWidget from '@/features/global/views/StudentHomeView/components/ActivitiesWidget/ActivitiesWidget.vue'
import { ActivityLongIconCardStub } from '@/features/global/views/StudentHomeView/components/ActivityLongIconCard/ActivityLongIconCard.stub'
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

  BddTest().when('the component is mounted with isNew prop', () => {
    const props = { isNew: true }

    BddTest().and('the query succeeds', () => {
      beforeEach(async () => {
        vi.clearAllMocks()
        server.use(latestActivitiesOverviewHandler)

        wrapper = mountComponent(ActivitiesWidget, { props, global: { stubs } })

        await flushPromises()
      })

      BddTest().then('it should render the new activities widget', () => {
        expect(wrapper.findComponent(HomeWidgetStub).exists()).toBe(true)
        expect(wrapper.find('[data-testid="new-activities-widget"]').exists()).toBe(true)
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
        server.use(latestActivitiesErrorHandler)

        wrapper = mountComponent(ActivitiesWidget, { props, global: { stubs } })

        await flushPromises()
      })

      BddTest().then('it should render the new activities widget', () => {
        expect(wrapper.findComponent(HomeWidgetStub).exists()).toBe(true)
        expect(wrapper.find('[data-testid="new-activities-widget"]').exists()).toBe(true)
      })

      BddTest().then('it should render the query suspense error state', () => {
        expect(wrapper.find('[data-testid="query-suspense-error"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="query-suspense-error"]').text()).toContain('Une erreur est survenue lors du chargement des nouvelles activités.')
      })
    })
  })

  BddTest().when('the component is mounted without isNew prop', () => {
    const props = { isNew: false }

    BddTest().and('the query succeeds', () => {
      beforeEach(async () => {
        vi.clearAllMocks()
        server.use(latestActivitiesOverviewHandler)

        wrapper = mountComponent(ActivitiesWidget, { props, global: { stubs } })

        await flushPromises()
      })

      BddTest().then('it should render the library activities widget', () => {
        expect(wrapper.findComponent(HomeWidgetStub).exists()).toBe(true)
        expect(wrapper.find('[data-testid="library-activities-widget"]').exists()).toBe(true)
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
        server.use(libraryActivitiesErrorHandler)

        wrapper = mountComponent(ActivitiesWidget, { props, global: { stubs } })

        await flushPromises()
      })

      BddTest().then('it should render the library activities widget', () => {
        expect(wrapper.findComponent(HomeWidgetStub).exists()).toBe(true)
        expect(wrapper.find('[data-testid="library-activities-widget"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="library-activities-widget"]').text()).toContain('Une erreur est survenue lors du chargement de votre bibliothèque d\'activités.')
      })

      BddTest().then('it should render the query suspense error state', () => {
        expect(wrapper.find('[data-testid="query-suspense-error"]').exists()).toBe(true)
      })
    })
  })
})
