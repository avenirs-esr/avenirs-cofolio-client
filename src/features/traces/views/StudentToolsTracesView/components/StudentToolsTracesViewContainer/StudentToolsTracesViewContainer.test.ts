import type { TracesSummaryDTO } from '@/api/avenir-esr'
import { createTracesSummaryHandler } from '@/__mocks__/msw/handlers/student/traces.handlers'
import { server } from '@/__mocks__/msw/server'
import { useTracesStore } from '@/features/traces/stores/traces.store'
import { StudentToolsTracesActionButtonsStub } from '@/features/traces/views/StudentToolsTracesView/components/StudentToolsTracesActionButtons/StudentToolsTracesActionButtons.stub'
import {
  StudentToolsTracesAddTraceDrawerStub
} from '@/features/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/StudentToolsTracesAddTraceDrawer.stub'
import StudentToolsTracesViewContainer
  from '@/features/traces/views/StudentToolsTracesView/components/StudentToolsTracesViewContainer/StudentToolsTracesViewContainer.vue'
import { StudentToolsTracesViewTabsStub } from '@/features/traces/views/StudentToolsTracesView/components/StudentToolsTracesViewTabs/StudentToolsTracesViewTabs.stub'
import { TracesInformationStub } from '@/features/traces/views/StudentToolsTracesView/components/TracesInformation/TracesInformation.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a student tools traces view container', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentToolsTracesViewContainer>>

  const tracesSummary: TracesSummaryDTO = {
    associated: 3,
    unassociated: 4,
    totalWarnings: 1,
    totalCriticals: 1
  }

  const stubs = {
    StudentToolsTracesViewTabs: StudentToolsTracesViewTabsStub,
    StudentToolsTracesActionButtons: StudentToolsTracesActionButtonsStub,
    StudentToolsTracesAddTraceDrawer: StudentToolsTracesAddTraceDrawerStub,
    TracesInformation: TracesInformationStub
  }

  BddTest().and('trace container is available', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      setActivePinia(createPinia())

      server.use(createTracesSummaryHandler(tracesSummary))

      wrapper = mountComponent(StudentToolsTracesViewContainer, {
        global: {
          stubs
        },
        useTanstack: true,
        usePinia: true
      })

      await flushPromises()
    })

    BddTest().when('the component is mounted', () => {
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
