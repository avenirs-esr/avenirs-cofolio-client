import type { TracesSummaryDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { useTracesStore } from '@/features/student/traces/stores/traces.store'
import { DeleteTracesModalStub } from '@/features/student/traces/views/StudentToolsTracesView/components/DeleteTracesModal/DeleteTracesModal.stub'
import StudentToolsTracesActionButtons from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesActionButtons/StudentToolsTracesActionButtons.vue'
import { TracesActionsDropdownStub } from '@/features/student/traces/views/StudentToolsTracesView/components/TracesActionsDropdown/TracesActionsDropdown.stub'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
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
    AvButton: AvButtonStub,
    TracesActionsDropdown: TracesActionsDropdownStub,
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

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())

    mountStudentToolsTracesActionButtons()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the add trace button', () => {
      const addButton = wrapper.findComponent({ name: 'AvButton' })

      expect(addButton.exists()).toBe(true)
      expect(addButton.props('label')).toBe('Ajouter une trace dans ma bibliothèque')
      expect(addButton.props('variant')).toBe('OUTLINED')
      expect(addButton.props('icon')).toBeDefined()
      expect(addButton.props('small')).toBe(true)
    })

    BddTest().then('it should render the traces actions dropdown', () => {
      expect(wrapper.findComponent({ name: 'TracesActionsDropdown' }).exists()).toBe(true)
    })

    BddTest().then('it should render the delete traces modal initially hidden with total count', () => {
      const modal = wrapper.findComponent({ name: 'DeleteTracesModal' })

      expect(modal.exists()).toBe(true)
      expect(modal.props('show')).toBe(false)
      expect(modal.props('totalCount')).toBe(7)
    })
  })

  BddTest().when('add trace button is clicked', () => {
    BddTest().then('it should update showCreateTraceDrawer state to true', async () => {
      const store = useTracesStore()
      const addButton = wrapper.findComponent({ name: 'AvButton' })

      expect(store.showCreateTraceDrawer).toBe(false)

      await addButton.vm.$emit('click')
      await wrapper.vm.$nextTick()

      expect(store.showCreateTraceDrawer).toBe(true)
    })
  })

  BddTest().when('delete action is selected', () => {
    beforeEach(async () => {
      await wrapper.findComponent({ name: 'TracesActionsDropdown' }).vm.$emit('deleteSelected')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should open the delete traces modal', () => {
      const modal = wrapper.findComponent({ name: 'DeleteTracesModal' })

      expect(modal.props('show')).toBe(true)
      expect(modal.props('totalCount')).toBe(7)
    })
  })

  BddTest().when('delete traces modal emits cancel', () => {
    beforeEach(async () => {
      await wrapper.findComponent({ name: 'TracesActionsDropdown' }).vm.$emit('deleteSelected')
      await wrapper.vm.$nextTick()

      await wrapper.findComponent({ name: 'DeleteTracesModal' }).vm.$emit('cancel')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should close the delete traces modal', () => {
      expect(wrapper.findComponent({ name: 'DeleteTracesModal' }).props('show')).toBe(false)
    })
  })

  BddTest().when('delete traces modal emits deleted', () => {
    beforeEach(async () => {
      await wrapper.findComponent({ name: 'TracesActionsDropdown' }).vm.$emit('deleteSelected')
      await wrapper.vm.$nextTick()

      await wrapper.findComponent({ name: 'DeleteTracesModal' }).vm.$emit('deleted')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should close the delete traces modal', () => {
      expect(wrapper.findComponent({ name: 'DeleteTracesModal' }).props('show')).toBe(false)
    })
  })

  BddTest().when('traces summary is undefined', () => {
    beforeEach(() => {
      mountStudentToolsTracesActionButtons({})
    })

    BddTest().then('it should provide zero as total count to delete traces modal', () => {
      const modal = wrapper.findComponent({ name: 'DeleteTracesModal' })

      expect(modal.props('totalCount')).toBe(0)
    })
  })
})
