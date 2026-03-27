import DeleteActivityAssociatedElementsDropdown from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/dropdowns/DeleteActivityAssociatedElementsDropdown/DeleteActivityAssociatedElementsDropdown.vue'
import { AvDropdownStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a delete activity associated elements dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteActivityAssociatedElementsDropdown>>

  const stubs = {
    AvDropdown: AvDropdownStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(DeleteActivityAssociatedElementsDropdown, { global: { stubs } })
    })

    BddTest().then('it should render the dropdown with two menu items', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props('items')).toHaveLength(1)
    })

    BddTest().then('it should pass correct props to dropdown', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      expect(dropdown.props('items')).toHaveLength(1)
      expect(dropdown.props('triggerAriaLabel')).toBe('Supprimer...')
      expect(dropdown.props('triggerLabel')).toBe('Supprimer...')
    })
  })

  BddTest().when('the traces button is clicked', () => {
    BddTest().then('it should emit the tracesSelected event', async () => {
      const tracesButton = wrapper.find('[data-name="traces"]')
      await tracesButton.trigger('click')
      expect(wrapper.emitted('tracesSelected')).toHaveLength(1)
    })
  })
})
