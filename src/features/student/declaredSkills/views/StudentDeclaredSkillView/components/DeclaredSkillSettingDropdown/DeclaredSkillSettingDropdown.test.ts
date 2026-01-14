import DeclaredSkillSettingDropdown from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/DeclaredSkillSettingDropdown/DeclaredSkillSettingDropdown.vue'
import { AvDropdownStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a declared skill setting popover', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredSkillSettingDropdown>>

  const stubs = {
    AvDropdown: AvDropdownStub
  }

  beforeEach(() => {
    wrapper = mount(DeclaredSkillSettingDropdown, { global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the dropdown with three menu items', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props('items')).toHaveLength(2)
    })

    BddTest().then('it should pass correct props to dropdown', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      expect(dropdown.props('items')).toHaveLength(2)
      expect(dropdown.props('triggerAriaLabel')).toBe('Paramètres de la compétence déclarée')
      expect(dropdown.props('triggerLabel')).toBe('Paramètres de la compétence déclarée')
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
