import type { VueWrapper } from '@vue/test-utils'
import StudentToolsTracesActionButtons from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesActionButtons/StudentToolsTracesActionButtons.vue'
import { useTracesStore } from '@/store'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a student tools traces action buttons component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentToolsTracesActionButtons>>

  const stubs = {
    AvButton: {
      name: 'AvButton',
      props: ['label', 'size', 'variant', 'icon'],
      emits: ['click'],
      template: '<button @click="$emit(\'click\')">{{ label }}</button>'
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())

    wrapper = mountComponent(StudentToolsTracesActionButtons, {
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the add trace button', () => {
      const addButton = wrapper.findComponent({ name: 'AvButton' })

      expect(addButton.exists()).toBe(true)
      expect(addButton.props('label')).toBe('Ajouter une trace dans ma bibliothèque')
      expect(addButton.props('size')).toBe('small')
      expect(addButton.props('variant')).toBe('OUTLINED')
      expect(addButton.props('icon')).toBeDefined()
    })
  })

  BddTest().when('add trace button is clicked', () => {
    BddTest().then('it should update showCreateTraceDrawer state to true', async () => {
      const store = useTracesStore()
      const addButton = wrapper.find('button')

      expect(store.showCreateTraceDrawer).toBe(false)

      await addButton.trigger('click')

      expect(store.showCreateTraceDrawer).toBe(true)
    })
  })
})
