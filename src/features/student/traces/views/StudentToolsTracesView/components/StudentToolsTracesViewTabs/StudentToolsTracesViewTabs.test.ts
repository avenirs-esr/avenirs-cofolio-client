import type { TracesSummaryDTO } from '@/api/avenir-esr'
import {
  StudentToolsTracesViewAssociatedTabStub
} from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesViewAssociatedTab/StudentToolsTracesViewAssociatedTab.stub'
import StudentToolsTracesViewTabs from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesViewTabs/StudentToolsTracesViewTabs.vue'
import {
  StudentToolsTracesViewUnassociatedTabStub
} from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesViewUnassociatedTab/StudentToolsTracesViewUnassociatedTab.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const routeQueryValue = ref<string>('UNASSOCIATED_TRACES')

vi.mock('@vueuse/router', () => ({
  useRouteQuery: (_queryName: string, defaultValue: string) => {
    if (routeQueryValue.value === undefined) {
      routeQueryValue.value = defaultValue
    }
    return routeQueryValue
  },
}))

BddTest().given('a studentToolsTracesViewTabs', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentToolsTracesViewTabs>>

  const tracesSummary: TracesSummaryDTO = {
    associated: 24,
    unassociated: 20,
    totalWarnings: 5,
    totalCriticals: 2
  }

  const stubs = {
    RouterLink: RouterLinkStub,
    StudentToolsTracesViewUnassociatedTab: StudentToolsTracesViewUnassociatedTabStub,
    StudentToolsTracesViewAssociatedTab: StudentToolsTracesViewAssociatedTabStub,
  }

  function mountTabs (summary?: TracesSummaryDTO) {
    wrapper = mountComponent(StudentToolsTracesViewTabs, {
      props: {
        tracesSummary: summary
      },
      global: {
        stubs
      },
      useTanstack: true,
      usePinia: true
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    routeQueryValue.value = 'UNASSOCIATED_TRACES'
    mountTabs(tracesSummary)
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render two AvTab with correct titles and icon', async () => {
      await flushPromises()

      const tabs = wrapper.findAll('.av-tab-item__tab')

      expect(tabs).toHaveLength(2)
      expect(tabs[0].text()).toBe('Mes traces non associées (20)')
      expect(tabs[1].text()).toBe('Mes traces associées (24)')

      const avTabs = wrapper.findComponent({ name: 'AvTabs' })
      expect(avTabs.props('modelValue')).toBe(0)
    })

    BddTest().then('it should pass tracesSummary to the Unassociated container prop', async () => {
      await flushPromises()

      const container = wrapper.findComponent({ name: 'StudentToolsTracesViewUnassociatedTab' })

      expect(container.exists()).toBe(true)
      expect(container.props('tracesSummary')).toEqual(tracesSummary)
    })

    BddTest().then('it should find the associated traces container', async () => {
      await flushPromises()

      const tabs = wrapper.findAll('.av-tab-item__tab')
      await tabs[1].trigger('click')
      await wrapper.vm.$nextTick()

      const container = wrapper.findComponent({ name: 'StudentToolsTracesViewAssociatedTab' })

      expect(container.exists()).toBe(true)
    })
  })

  BddTest().when('user interacts with tabs', () => {
    BddTest().then('it should switch to second tab when clicked', async () => {
      await flushPromises()

      const tabs = wrapper.findAll('.av-tab-item__tab')
      await tabs[1].trigger('click')
      await wrapper.vm.$nextTick()

      const selectedTab = wrapper.find('.av-tab-item__tab[aria-selected="true"]')

      expect(selectedTab.text()).toBe('Mes traces associées (24)')
    })

    BddTest().then('it should switch back to first tab when clicked', async () => {
      await flushPromises()

      const tabs = wrapper.findAll('.av-tab-item__tab')

      await tabs[1].trigger('click')
      await wrapper.vm.$nextTick()

      await tabs[0].trigger('click')
      await wrapper.vm.$nextTick()

      const selectedTab = wrapper.find('.av-tab-item__tab[aria-selected="true"]')

      expect(selectedTab.text()).toBe('Mes traces non associées (20)')
    })
  })

  BddTest().when('tracesSummary has one associated and one unassociated trace', () => {
    beforeEach(() => {
      mountTabs({
        associated: 1,
        unassociated: 1,
        totalWarnings: 0,
        totalCriticals: 0
      })
    })

    BddTest().then('it should render singular titles', async () => {
      await flushPromises()

      const tabs = wrapper.findAll('.av-tab-item__tab')

      expect(tabs).toHaveLength(2)
      expect(tabs[0].text()).toBe('Ma trace non associée (1)')
      expect(tabs[1].text()).toBe('Ma trace associée (1)')
    })
  })

  BddTest().when('tracesSummary is undefined', () => {
    beforeEach(() => {
      mountTabs(undefined)
    })

    BddTest().then('titles should display 0 for both counts', async () => {
      await flushPromises()

      const tabs = wrapper.findAll('.av-tab-item__tab')

      expect(tabs[0].text()).toBe('Aucune trace non associée (0)')
      expect(tabs[1].text()).toBe('Aucune trace associée (0)')
    })
  })
})
