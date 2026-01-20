import ManageDeclaredProgramDropdown from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/components/ManageDeclaredProgramDropdown/ManageDeclaredProgramDropdown.vue'
import { AvDropdownStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a manage declared program dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof ManageDeclaredProgramDropdown>>

  const stubs = {
    AvDropdown: AvDropdownStub
  }

  beforeEach(() => {
    wrapper = mount(ManageDeclaredProgramDropdown, { global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the dropdown with two menu items', () => {
      const dropdown = wrapper.findComponent(AvDropdownStub)
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props('items')).toHaveLength(2)
    })

    BddTest().then('it should pass correct props to dropdown', () => {
      const dropdown = wrapper.findComponent(AvDropdownStub)
      expect(dropdown.props('triggerAriaLabel')).toBe('Gérer ma formation')
      expect(dropdown.props('triggerLabel')).toBe('Gérer ma formation')
    })
  })

  BddTest().when('the update button is clicked', () => {
    BddTest().then('it should emit the updateSelected event', async () => {
      const updateButton = wrapper.find('[data-name="update"]')
      await updateButton.trigger('click')
      expect(wrapper.emitted('updateSelected')).toHaveLength(1)
    })
  })

  BddTest().when('the delete button is clicked', () => {
    BddTest().then('it should emit the deleteSelected event', async () => {
      const deleteButton = wrapper.find('[data-name="delete"]')
      await deleteButton.trigger('click')
      expect(wrapper.emitted('deleteSelected')).toHaveLength(1)
    })
  })
})
