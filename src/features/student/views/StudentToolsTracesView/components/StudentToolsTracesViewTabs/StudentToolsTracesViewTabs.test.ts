import { createTracesSummaryHandler } from '@/__mocks__/msw/handlers/student/traces.handlers'
import { server } from '@/__mocks__/msw/server'

import StudentToolsTracesViewTabs from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesViewTabs/StudentToolsTracesViewTabs.vue'
import { flushPromises, RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { BddTest, mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a studentToolsTracesViewTabs', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentToolsTracesViewTabs>>

  const stubs = {
    RouterLink: RouterLinkStub,
    StudentToolsTracesViewUnassociatedTab: {
      name: 'StudentToolsTracesViewUnassociatedTab',
      props: ['tracesSummary'],
      template: '<div class="unassociated-tab-stub" />'
    },
    StudentToolsTracesViewAssociatedTab: {
      name: 'StudentToolsTracesViewAssociatedTab',
      template: '<div class="associated-tab-stub" />'
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mountComponent(StudentToolsTracesViewTabs, {
      global: {
        stubs
      },
      useTanstack: true,
      usePinia: true
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render two AvTab with correct titles and icon', async () => {
      await flushPromises()
      const tabs = wrapper.findAll('.fr-tabs__tab')
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
      expect(container.props('tracesSummary')).toEqual({ associated: 24, unassociated: 20, totalWarnings: 5, totalCriticals: 2 })
    })

    BddTest().then('it should find the associated traces container', () => {
      const container = wrapper.findComponent({ name: 'StudentToolsTracesViewAssociatedTab' })
      expect(container.exists()).toBe(true)
    })
  })

  BddTest().when('user interacts with tabs', () => {
    BddTest().then('it should switch to second tab when clicked', async () => {
      await flushPromises()
      const tabs = wrapper.findAll('.fr-tabs__tab')
      await tabs[1].trigger('click')
      await wrapper.vm.$nextTick()

      const selectedTab = wrapper.find('.fr-tabs__tab[aria-selected="true"]')
      expect(selectedTab.text()).toBe('Mes traces associées (24)')
    })

    BddTest().then('it should switch back to first tab when clicked', async () => {
      await flushPromises()
      const tabs = wrapper.findAll('.fr-tabs__tab')

      await tabs[1].trigger('click')
      await wrapper.vm.$nextTick()

      await tabs[0].trigger('click')
      await wrapper.vm.$nextTick()

      const selectedTab = wrapper.find('.fr-tabs__tab[aria-selected="true"]')
      expect(selectedTab.text()).toBe('Mes traces non associées (20)')
    })
  })

  BddTest().when('tracesSummary is undefined (fallback to 0)', () => {
    BddTest().then('it should render two AvTab with correct titles when have only one trace', async () => {
      const handler
      = createTracesSummaryHandler(
        { associated: 1, unassociated: 1, totalWarnings: 0, totalCriticals: 0 }
      )
      server.use(handler)
      wrapper = mountComponent(StudentToolsTracesViewTabs, {
        global: {
          stubs
        },
        useTanstack: true,
        usePinia: true
      })
      await vi.waitFor(() => {
        const tabs = wrapper.findAll('.fr-tabs__tab')
        expect(tabs).toHaveLength(2)

        expect(tabs[0].text()).toBe('Ma trace non associée (1)')
        expect(tabs[1].text()).toBe('Ma trace associée (1)')
      })
    })

    BddTest().then('titles should display 0 for both counts', async () => {
      const tabs = wrapper.findAll('.fr-tabs__tab')
      expect(tabs[0].text()).toBe('Aucune trace non associée (0)')
      expect(tabs[1].text()).toBe('Aucune trace associée (0)')
    })
  })
})
