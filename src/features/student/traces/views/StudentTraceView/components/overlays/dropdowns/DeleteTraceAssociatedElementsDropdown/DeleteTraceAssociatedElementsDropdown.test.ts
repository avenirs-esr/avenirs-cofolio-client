import DeleteTraceAssociatedElementsDropdown from '@/features/student/traces/views/StudentTraceView/components/overlays/dropdowns/DeleteTraceAssociatedElementsDropdown/DeleteTraceAssociatedElementsDropdown.vue'
import { AvDropdownStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a delete trace associated elements dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteTraceAssociatedElementsDropdown>>

  const stubs = {
    AvDropdown: AvDropdownStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(DeleteTraceAssociatedElementsDropdown, { global: { stubs } })
    })

    BddTest().then('it should render the dropdown with two menu items', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props('items')).toHaveLength(2)
    })

    BddTest().then('it should pass correct props to dropdown', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      expect(dropdown.props('items')).toHaveLength(2)
      expect(dropdown.props('triggerAriaLabel')).toBe('Supprimer...')
      expect(dropdown.props('triggerLabel')).toBe('Supprimer...')
    })

    BddTest().and('the skills button is clicked', () => {
      BddTest().then('it should emit the skillsSelected event', async () => {
        const skillsButton = wrapper.find('[data-name="skills"]')
        await skillsButton.trigger('click')
        expect(wrapper.emitted('skillsSelected')).toHaveLength(1)
      })
    })

    BddTest().and('the activities button is clicked', () => {
      BddTest().then('it should emit the activitiesSelected event', async () => {
        const activitiesButton = wrapper.find('[data-name="activities"]')
        await activitiesButton.trigger('click')
        expect(wrapper.emitted('activitiesSelected')).toHaveLength(1)
      })
    })
  })

  BddTest().when('the component is mounted with skills disabled', () => {
    beforeEach(() => {
      wrapper = mount(DeleteTraceAssociatedElementsDropdown, {
        props: { skillsDisabled: true },
        global: { stubs }
      })
    })

    BddTest().then('the skills menu item should be disabled', () => {
      const skillsButton = wrapper.find('[data-name="skills"]')
      expect(skillsButton.attributes('disabled')).toBeDefined()
    })
  })

  BddTest().when('the component is mounted with activities disabled', () => {
    beforeEach(() => {
      wrapper = mount(DeleteTraceAssociatedElementsDropdown, {
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
      wrapper = mount(DeleteTraceAssociatedElementsDropdown, {
        props: { disabled: true },
        global: { stubs }
      })
    })

    BddTest().then('the skills menu item should be disabled', () => {
      expect(wrapper.find('[data-name="skills"]').attributes('disabled')).toBeDefined()
    })

    BddTest().then('the activities menu item should be disabled', () => {
      expect(wrapper.find('[data-name="activities"]').attributes('disabled')).toBeDefined()
    })
  })

  BddTest().when('the component is mounted with disabled=true and skillsDisabled=false', () => {
    beforeEach(() => {
      wrapper = mount(DeleteTraceAssociatedElementsDropdown, {
        props: { disabled: true, skillsDisabled: false },
        global: { stubs }
      })
    })

    BddTest().then('the skills menu item should still be disabled', () => {
      expect(wrapper.find('[data-name="skills"]').attributes('disabled')).toBeDefined()
    })
  })
})
