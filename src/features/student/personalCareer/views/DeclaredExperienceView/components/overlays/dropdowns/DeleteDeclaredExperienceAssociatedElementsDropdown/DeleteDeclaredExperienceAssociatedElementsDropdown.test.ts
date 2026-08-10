import DeleteDeclaredExperienceAssociatedElementsDropdown
  from '@/features/student/personalCareer/views/DeclaredExperienceView/components/overlays/dropdowns/DeleteDeclaredExperienceAssociatedElementsDropdown/DeleteDeclaredExperienceAssociatedElementsDropdown.vue'
import { AvDropdownStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a delete declared experience associated elements dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteDeclaredExperienceAssociatedElementsDropdown>>

  const stubs = {
    AvDropdown: AvDropdownStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(DeleteDeclaredExperienceAssociatedElementsDropdown, { global: { stubs } })
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

    BddTest().then('the traces menu item should be enabled', () => {
      expect(wrapper.find('[data-name="traces"]').attributes('disabled')).toBeUndefined()
    })

    BddTest().and('the traces button is clicked', () => {
      BddTest().then('it should emit the tracesSelected event', async () => {
        const tracesButton = wrapper.find('[data-name="traces"]')
        await tracesButton.trigger('click')
        expect(wrapper.emitted('tracesSelected')).toHaveLength(1)
      })
    })
  })

  BddTest().when('the component is mounted with traces disabled', () => {
    beforeEach(() => {
      wrapper = mount(DeleteDeclaredExperienceAssociatedElementsDropdown, {
        props: { tracesDisabled: true },
        global: { stubs }
      })
    })

    BddTest().then('the traces menu item should be disabled', () => {
      expect(wrapper.find('[data-name="traces"]').attributes('disabled')).toBeDefined()
    })
  })

  BddTest().when('the component is mounted with disabled=true', () => {
    beforeEach(() => {
      wrapper = mount(DeleteDeclaredExperienceAssociatedElementsDropdown, {
        props: { disabled: true },
        global: { stubs }
      })
    })

    BddTest().then('the traces menu item should be disabled', () => {
      expect(wrapper.find('[data-name="traces"]').attributes('disabled')).toBeDefined()
    })
  })
})
