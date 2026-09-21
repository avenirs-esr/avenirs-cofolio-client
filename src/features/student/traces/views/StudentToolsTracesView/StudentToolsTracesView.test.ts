import { createTracesSummaryHandler, tracesSummaryErrorHandler, } from '@/__mocks__/msw/handlers/student/traces.handlers'
import { server } from '@/__mocks__/msw/server'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { StudentToolsTracesActionButtonsStub } from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesActionButtons/StudentToolsTracesActionButtons.stub'
import StudentToolsTracesView from '@/features/student/traces/views/StudentToolsTracesView/StudentToolsTracesView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a student tools traces view component', () => {
  const commonStubs = {
    PageTitle: PageTitleStub,
    StudentToolsTracesViewContainer: {
      name: 'StudentToolsTracesViewContainer',
      template: '<div class="student-tools-traces-view-container-stub" />'
    },
    StudentToolsTracesActionButtons: StudentToolsTracesActionButtonsStub,
  }

  let wrapper: VueWrapper<InstanceType<typeof StudentToolsTracesView>>

  const tracesSummary = {
    associated: 3,
    unassociated: 4,
    totalWarnings: 1,
    totalCriticals: 1
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    setActivePinia(createPinia())

    server.use(createTracesSummaryHandler(tracesSummary))

    wrapper = mountComponent(StudentToolsTracesView, {
      global: {
        stubs: commonStubs
      },
      useTanstack: true,
      usePinia: true
    })

    await flushPromises()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.exists()).toBe(true)
      expect(pageTitle.props('title')).toBe('Ma bibliothèque de traces')
      expect(pageTitle.props('trailingLinks')).toBeUndefined()
    })

    BddTest().then('it should render StudentToolsTracesViewContainer', () => {
      const container = wrapper.findComponent({ name: 'StudentToolsTracesViewContainer' })
      expect(container.exists()).toBe(true)
    })

    BddTest().then('it should render the correct structure', () => {
      expect(wrapper.findComponent({ name: 'PageTitle' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'StudentToolsTracesViewContainer' }).exists()).toBe(true)
    })

    BddTest().then('it should render the action buttons with traces summary', () => {
      const actionButtons = wrapper.findComponent({ name: 'StudentToolsTracesActionButtons' })

      expect(actionButtons.exists()).toBe(true)
      expect(actionButtons.props('tracesSummary')).toEqual(tracesSummary)
    })
  })

  BddTest().and('no configuration', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      setActivePinia(createPinia())

      server.use(createTracesSummaryHandler(tracesSummary))

      wrapper = mountComponent(StudentToolsTracesView, {
        global: {
          stubs: commonStubs
        },
        useTanstack: true,
        usePinia: true
      })

      await flushPromises()
    })

    BddTest().when('the component is mounted with null configuration', () => {
      BddTest().then('it should still render all components', () => {
        expect(wrapper.findComponent({ name: 'PageTitle' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'StudentToolsTracesViewContainer' }).exists()).toBe(true)
      })
    })
  })

  BddTest().and('no traces summary', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      setActivePinia(createPinia())

      server.use(tracesSummaryErrorHandler)

      wrapper = mountComponent(StudentToolsTracesView, {
        global: {
          stubs: commonStubs
        },
        useTanstack: true,
        usePinia: true
      })

      await flushPromises()
    })

    BddTest().when('the component is mounted with empty traces summary', () => {
      BddTest().then('it should still render essential components', () => {
        expect(wrapper.findComponent({ name: 'PageTitle' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'StudentToolsTracesViewContainer' }).exists()).toBe(true)
      })
    })
  })
})
