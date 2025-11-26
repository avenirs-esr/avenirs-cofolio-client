import { useTracesStore } from '@/features/student/traces/stores/traces.store'
import StudentToolsTracesViewContainer from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesViewContainer/StudentToolsTracesViewContainer.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { beforeEach, expect, vi } from 'vitest'

const stubs = {
  StudentToolsTracesViewTabs: {
    name: 'StudentToolsTracesViewTabs',
    props: ['trace'],
    template: '<div class="student-tools-traces-view-tabs-stub" />'
  },
  StudentToolsTracesActionButtons: {
    name: 'StudentToolsTracesActionButtons',
    template: '<div class="student-tools-traces-action-buttons-stub">Action Buttons</div>'
  },
  StudentToolsTracesAddTraceDrawer: {
    name: 'StudentToolsTracesAddTraceDrawer',
    template: '<div class="student-tools-traces-add-trace-drawer-stub">Drawer Content</div>'
  }
}

BddTest().given('a student tools traces view container', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentToolsTracesViewContainer>>

  BddTest().and('trace container is available', () => {
    beforeEach(() => {
      vi.clearAllMocks()

      wrapper = mount(StudentToolsTracesViewContainer, {
        global: {
          plugins: [createPinia()],
          stubs
        }
      })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should render the action buttons', () => {
        expect(wrapper.findComponent({ name: 'StudentToolsTracesActionButtons' }).exists()).toBe(true)
      })

      BddTest().then('it should render the traces tabs', () => {
        expect(wrapper.findComponent({ name: 'StudentToolsTracesViewTabs' }).exists()).toBe(true)
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
