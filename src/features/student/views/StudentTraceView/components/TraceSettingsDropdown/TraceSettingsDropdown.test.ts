import TraceSettingsDropdown from '@/features/student/views/StudentTraceView/components/TraceSettingsDropdown/TraceSettingsDropdown.vue'
import { AvDropdownStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a setting popover', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceSettingsDropdown>>

  const stubs = {
    AvDropdown: AvDropdownStub
  }

  beforeEach(() => {
    wrapper = mount(TraceSettingsDropdown, { global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the dropdown with three menu items', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props('items')).toHaveLength(3)
    })

    BddTest().then('it should pass correct props to dropdown', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      expect(dropdown.props('items')).toHaveLength(3)
      expect(dropdown.props('triggerAriaLabel')).toBe('Plus d\'actions')
      expect(dropdown.props('triggerLabel')).toBe('Plus d\'actions')
    })
  })

  BddTest().when('the delete button is clicked', () => {
    BddTest().then('it should emit the deleteSelected event', async () => {
      const deleteButton = wrapper.find('[data-name="delete"]')
      await deleteButton.trigger('click')
      expect(wrapper.emitted('deleteSelected')).toHaveLength(1)
    })
  })

  BddTest().when('the associate button is clicked', () => {
    BddTest().then('it should emit the associateSelected event', async () => {
      const associateButton = wrapper.find('[data-name="associate"]')
      await associateButton.trigger('click')
      expect(wrapper.emitted('associateSelected')).toHaveLength(1)
    })
  })

  BddTest().when('the update button is clicked', () => {
    BddTest().then('it should emit the updateSelected event', async () => {
      const updateButton = wrapper.find('[data-name="update"]')
      await updateButton.trigger('click')
      expect(wrapper.emitted('updateSelected')).toHaveLength(1)
    })
  })
})
