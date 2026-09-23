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
    BddTest().then('it should render the dropdown with two menu items', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props('items')).toHaveLength(2)
    })

    BddTest().then('it should pass correct props to dropdown', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      expect(dropdown.props('items')).toHaveLength(2)
      expect(dropdown.props('triggerAriaLabel')).toBe('Gérer ma compétence')
      expect(dropdown.props('triggerLabel')).toBe('Gérer ma compétence')
    })
  })

  BddTest().when('the update button is clicked', () => {
    BddTest().then('it should emit the update  event', async () => {
      const updateButton = wrapper.find('[data-name="update"]')
      await updateButton.trigger('click')
      expect(wrapper.emitted('update')).toHaveLength(1)
    })
  })

  BddTest().when('the delete button is clicked', () => {
    BddTest().then('it should emit the delete event', async () => {
      const deleteButton = wrapper.find('[data-name="delete"]')
      await deleteButton.trigger('click')
      expect(wrapper.emitted('delete')).toHaveLength(1)
    })
  })
})
