import ActivityLibraryDropdown from '@/features/buildProject/views/ProjectActivitiesView/components/overlays/ActivityLibraryDropdown/ActivityLibraryDropdown.vue'
import { AvDropdownStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an activity library dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityLibraryDropdown>>

  const stubs = {
    AvDropdown: AvDropdownStub
  }

  beforeEach(() => {
    wrapper = mount(ActivityLibraryDropdown, { global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the dropdown with one menu item', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props('items')).toHaveLength(1)
    })

    BddTest().then('it should pass correct props to dropdown', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      expect(dropdown.props('items')).toHaveLength(1)
      expect(dropdown.props('triggerAriaLabel')).toBe('Plus d\'actions')
      expect(dropdown.props('triggerLabel')).toBe('Plus d\'actions')
    })
  })

  BddTest().when('the unsubscribe button is clicked', () => {
    BddTest().then('it should emit the unsubscribeSelected event', async () => {
      const unsubscribeButton = wrapper.find('[data-name="unsubscribe"]')
      await unsubscribeButton.trigger('click')
      expect(wrapper.emitted('unsubscribeSelected')).toHaveLength(1)
    })
  })
})
