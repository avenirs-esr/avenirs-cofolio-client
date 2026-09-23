import type { TracesSummaryDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { ManageEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.stub'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { useTracesStore } from '@/features/student/traces/stores/traces.store'
import { DeleteTracesModalStub } from '@/features/student/traces/views/StudentToolsTracesView/components/DeleteTracesModal/DeleteTracesModal.stub'
import StudentToolsTracesActionButtons from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesActionButtons/StudentToolsTracesActionButtons.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a student tools traces action buttons component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentToolsTracesActionButtons>>

  const tracesSummary: TracesSummaryDTO = {
    associated: 3,
    unassociated: 4,
    totalWarnings: 1,
    totalCriticals: 1
  }

  const stubs = {
    ManageEntityDropdown: ManageEntityDropdownStub,
    DeleteTracesModal: DeleteTracesModalStub
  }

  function mountStudentToolsTracesActionButtons (
    props: Partial<InstanceType<typeof StudentToolsTracesActionButtons>['$props']> = {
      tracesSummary
    }
  ) {
    wrapper = mountComponent(StudentToolsTracesActionButtons, {
      props,
      global: {
        stubs
      }
    })
  }

  const getDropdown = () => wrapper.findComponent(ManageEntityDropdownStub)
  const emitDropdownAction = (action: Action) => getDropdown().vm.$emit('actionSelected', action)

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())

    mountStudentToolsTracesActionButtons()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the manage trace dropdown', () => {
      expect(getDropdown().exists()).toBe(true)
      expect(getDropdown().props('entityName')).toBe('mes traces')
      expect(getDropdown().props('actions')).toEqual([Action.ADD, Action.DELETE])
    })

    BddTest().then('it should render the delete traces modal initially hidden with total count', () => {
      const modal = wrapper.findComponent(DeleteTracesModalStub)

      expect(modal.exists()).toBe(true)
      expect(modal.props('opened')).toBe(false)
      expect(modal.props('totalCount')).toBe(7)
    })
  })

  BddTest().when('add action is selected', () => {
    BddTest().then('it should update showCreateTraceDrawer state to true', async () => {
      const store = useTracesStore()

      expect(store.showCreateTraceDrawer).toBe(false)

      emitDropdownAction(Action.ADD)

      expect(store.showCreateTraceDrawer).toBe(true)
    })
  })

  BddTest().when('delete action is selected', () => {
    beforeEach(() => {
      emitDropdownAction(Action.DELETE)
    })

    BddTest().then('it should open the delete traces modal', () => {
      const modal = wrapper.findComponent(DeleteTracesModalStub)

      expect(modal.props('opened')).toBe(true)
      expect(modal.props('totalCount')).toBe(7)
    })
  })

  BddTest().when('delete traces modal emits cancel', () => {
    beforeEach(async () => {
      emitDropdownAction(Action.DELETE)

      await wrapper.findComponent(DeleteTracesModalStub).vm.$emit('cancel')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should close the delete traces modal', () => {
      expect(wrapper.findComponent(DeleteTracesModalStub).props('opened')).toBe(false)
    })
  })

  BddTest().when('delete traces modal emits deleted', () => {
    beforeEach(async () => {
      emitDropdownAction(Action.DELETE)

      await wrapper.findComponent(DeleteTracesModalStub).vm.$emit('deleted')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should close the delete traces modal', () => {
      expect(wrapper.findComponent(DeleteTracesModalStub).props('opened')).toBe(false)
    })
  })

  BddTest().when('traces summary is undefined', () => {
    beforeEach(() => {
      mountStudentToolsTracesActionButtons({})
    })

    BddTest().then('it should provide zero as total count to delete traces modal', () => {
      const modal = wrapper.findComponent(DeleteTracesModalStub)

      expect(modal.props('totalCount')).toBe(0)
    })
  })
})
