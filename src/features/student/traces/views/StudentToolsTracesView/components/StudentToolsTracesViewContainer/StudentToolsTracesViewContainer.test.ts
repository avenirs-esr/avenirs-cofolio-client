import type { TracesSummaryDTO } from '@/api/avenir-esr'
import { useTracesSummaryQuery } from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import { useTracesStore } from '@/features/student/traces/stores/traces.store'
import { StudentToolsTracesActionButtonsStub } from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesActionButtons/StudentToolsTracesActionButtons.stub'
import StudentToolsTracesViewContainer from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesViewContainer/StudentToolsTracesViewContainer.vue'
import { StudentToolsTracesViewTabsStub } from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesViewTabs/StudentToolsTracesViewTabs.stub'
import { TracesInformationStub } from '@/features/student/traces/views/StudentToolsTracesView/components/TracesInformation/TracesInformation.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { beforeEach, expect, type MockedFunction, vi } from 'vitest'

vi.mock('@/features/student/traces/queries/use-traces.query/use-traces.query', async (importActual) => {
  const actual = await importActual<typeof import('@/features/student/traces/queries/use-traces.query/use-traces.query')>()
  return {
    ...actual,
    useTracesSummaryQuery: vi.fn()
  }
})

BddTest().given('a student tools traces view container', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentToolsTracesViewContainer>>

  const tracesSummary: TracesSummaryDTO = {
    associated: 3,
    unassociated: 4,
    totalWarnings: 1,
    totalCriticals: 1
  }

  const mockedUseTracesSummaryQuery: MockedFunction<typeof useTracesSummaryQuery> = vi.mocked(useTracesSummaryQuery)

  const stubs = {
    StudentToolsTracesViewTabs: StudentToolsTracesViewTabsStub,
    StudentToolsTracesActionButtons: StudentToolsTracesActionButtonsStub,
    StudentToolsTracesAddTraceDrawer: {
      name: 'StudentToolsTracesAddTraceDrawer',
      template: '<div data-testid="student-tools-traces-add-trace-drawer" />'
    },
    TracesInformation: TracesInformationStub
  }

  BddTest().and('trace container is available', () => {
    beforeEach(() => {
      vi.clearAllMocks()

      mockedUseTracesSummaryQuery.mockReturnValue({
        data: ref(tracesSummary)
      } as ReturnType<typeof useTracesSummaryQuery>)

      wrapper = mount(StudentToolsTracesViewContainer, {
        global: {
          plugins: [createPinia()],
          stubs
        }
      })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should fetch traces summary', () => {
        expect(mockedUseTracesSummaryQuery).toHaveBeenCalled()
      })

      BddTest().then('it should render the traces information', () => {
        expect(wrapper.findComponent({ name: 'TracesInformation' }).exists()).toBe(true)
      })

      BddTest().then('it should render the action buttons with traces summary', () => {
        const actionButtons = wrapper.findComponent({ name: 'StudentToolsTracesActionButtons' })

        expect(actionButtons.exists()).toBe(true)
        expect(actionButtons.props('tracesSummary')).toEqual(tracesSummary)
      })

      BddTest().then('it should render the traces tabs with traces summary', () => {
        const tabs = wrapper.findComponent({ name: 'StudentToolsTracesViewTabs' })

        expect(tabs.exists()).toBe(true)
        expect(tabs.props('tracesSummary')).toEqual(tracesSummary)
      })

      BddTest().then('it should render the add trace drawer', () => {
        expect(wrapper.findComponent({ name: 'StudentToolsTracesAddTraceDrawer' }).exists()).toBe(true)
      })

      BddTest().then('it should not show the drawer initially', () => {
        const store = useTracesStore()
        expect(store.showCreateTraceDrawer).toBe(false)
      })
    })

    BddTest().when('displayCreateTraceDrawer is called', () => {
      beforeEach(async () => {
        const store = useTracesStore()
        store.displayCreateTraceDrawer()
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should display the create trace drawer', () => {
        const store = useTracesStore()
        expect(store.showCreateTraceDrawer).toBe(true)
      })

      BddTest().then('the store should have showCreateTraceDrawer set to true', async () => {
        await wrapper.vm.$nextTick()
        const store = useTracesStore()
        expect(store.showCreateTraceDrawer).toBe(true)
      })
    })

    BddTest().when('drawer is closed via store', () => {
      beforeEach(async () => {
        const store = useTracesStore()
        store.displayCreateTraceDrawer()
        await wrapper.vm.$nextTick()
        store.hideCreateTraceDrawer()
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should hide the create trace drawer', () => {
        const store = useTracesStore()
        expect(store.showCreateTraceDrawer).toBe(false)
      })
    })
  })
})
