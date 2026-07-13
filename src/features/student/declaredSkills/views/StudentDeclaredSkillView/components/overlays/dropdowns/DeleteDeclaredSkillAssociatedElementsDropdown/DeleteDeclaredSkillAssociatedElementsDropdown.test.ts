import DeleteDeclaredSkillAssociatedElementsDropdown from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/overlays/dropdowns/DeleteDeclaredSkillAssociatedElementsDropdown/DeleteDeclaredSkillAssociatedElementsDropdown.vue'
import { AvDropdownStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a delete declared skill associated elements dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteDeclaredSkillAssociatedElementsDropdown>>

  const stubs = {
    AvDropdown: AvDropdownStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(DeleteDeclaredSkillAssociatedElementsDropdown, { global: { stubs } })
    })

    BddTest().then('it should render the dropdown with a single menu item', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props('items')).toHaveLength(1)
    })

    BddTest().then('it should pass correct props to dropdown', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      expect(dropdown.props('triggerAriaLabel')).toBe('Supprimer...')
      expect(dropdown.props('triggerLabel')).toBe('Supprimer...')
    })

    BddTest().and('the activities button is clicked', () => {
      BddTest().then('it should emit the activitiesSelected event', async () => {
        const activitiesButton = wrapper.find('[data-name="activities"]')
        await activitiesButton.trigger('click')
        expect(wrapper.emitted('activitiesSelected')).toHaveLength(1)
      })
    })
  })

  BddTest().when('the component is mounted with activities disabled', () => {
    beforeEach(() => {
      wrapper = mount(DeleteDeclaredSkillAssociatedElementsDropdown, {
        props: { activitiesDisabled: true },
        global: { stubs }
      })
    })

    BddTest().then('the activities menu item should be disabled', () => {
      const activitiesButton = wrapper.find('[data-name="activities"]')
      expect(activitiesButton.attributes('disabled')).toBeDefined()
    })
  })

  BddTest().when('the component is mounted with disabled=true', () => {
    beforeEach(() => {
      wrapper = mount(DeleteDeclaredSkillAssociatedElementsDropdown, {
        props: { disabled: true },
        global: { stubs }
      })
    })

    BddTest().then('the activities menu item should be disabled', () => {
      expect(wrapper.find('[data-name="activities"]').attributes('disabled')).toBeDefined()
    })
  })
})
