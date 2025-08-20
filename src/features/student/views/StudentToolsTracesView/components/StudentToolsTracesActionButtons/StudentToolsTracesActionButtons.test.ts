import type { VueWrapper } from '@vue/test-utils'
import { useTracesStore } from '@/store'
import { createPinia, setActivePinia } from 'pinia'
import { mountComponent } from 'tests/utils'
import StudentToolsTracesActionButtons from './StudentToolsTracesActionButtons.vue'

const stubs = {
  AvButton: {
    name: 'AvButton',
    props: ['label', 'size', 'variant', 'icon'],
    emits: ['click'],
    template: '<button @click="$emit(\'click\')">{{ label }}</button>'
  }
}

describe('studentToolsTracesActionButtons', () => {
  describe('given a student tools traces action buttons component', () => {
    let wrapper: VueWrapper<InstanceType<typeof StudentToolsTracesActionButtons>>

    beforeEach(() => {
      vi.clearAllMocks()
      setActivePinia(createPinia())

      wrapper = mountComponent<typeof StudentToolsTracesActionButtons>(StudentToolsTracesActionButtons, {
        global: {
          stubs
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render the add trace button', () => {
        const addButton = wrapper.findComponent({ name: 'AvButton' })

        expect(addButton.exists()).toBe(true)
        expect(addButton.props('label')).toBe('AJOUTER UNE TRACE dans ma bibliothèque')
        expect(addButton.props('size')).toBe('small')
        expect(addButton.props('variant')).toBe('OUTLINED')
        expect(addButton.props('icon')).toBeDefined()
      })
    })

    describe('when add trace button is clicked', () => {
      it('then it should update showCreateTraceDrawer state to true', async () => {
        const store = useTracesStore()
        const addButton = wrapper.find('button')

        expect(store.showCreateTraceDrawer).toBe(false)

        await addButton.trigger('click')

        expect(store.showCreateTraceDrawer).toBe(true)
      })
    })
  })
})
