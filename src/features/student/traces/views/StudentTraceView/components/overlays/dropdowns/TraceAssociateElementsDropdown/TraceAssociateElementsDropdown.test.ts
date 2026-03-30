import TraceAssociateElementsDropdown from '@/features/student/traces/views/StudentTraceView/components/overlays/dropdowns/TraceAssociateElementsDropdown/TraceAssociateElementsDropdown.vue'
import { AvDropdownStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a trace associate elements dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceAssociateElementsDropdown>>

  const stubs = {
    AvDropdown: AvDropdownStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(TraceAssociateElementsDropdown, { global: { stubs } })
    })

    BddTest().then('it should render the dropdown with two menu items', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })

      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props('items')).toHaveLength(1)
    })

    BddTest().then('it should pass correct props to dropdown', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })

      expect(dropdown.props('items')).toHaveLength(1)
      expect(dropdown.props('triggerAriaLabel')).toBe('Associer...')
      expect(dropdown.props('triggerLabel')).toBe('Associer...')
      expect(dropdown.props('triggerVariant')).toBe('FLAT')
    })
  })

  BddTest().when('the activities button is clicked', () => {
    beforeEach(() => {
      wrapper = mount(TraceAssociateElementsDropdown, { global: { stubs } })
    })

    BddTest().then('it should emit the activitiesSelected event', async () => {
      const activitiesButton = wrapper.find('[data-name="activities"]')
      await activitiesButton.trigger('click')
      expect(wrapper.emitted('activitiesSelected')).toHaveLength(1)
    })
  })
})
