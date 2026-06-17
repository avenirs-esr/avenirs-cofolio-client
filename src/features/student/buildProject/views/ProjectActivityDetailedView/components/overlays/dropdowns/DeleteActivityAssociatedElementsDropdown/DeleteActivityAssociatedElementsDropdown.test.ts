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
      wrapper = mount(DeleteActivityAssociatedElementsDropdown, {
        props: {
          tracesDisabled: false
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render the dropdown with two menu items', () => {
      const dropdown = wrapper.findComponent(AvDropdownStub)
      const items = dropdown.props('items')

      expect(dropdown.exists()).toBe(true)
      expect(items).toHaveLength(2)
      expect(items[0].name).toBe('skills')
      expect(items[1].name).toBe('traces')
    })

    BddTest().then('it should pass correct props to dropdown', () => {
      const dropdown = wrapper.findComponent(AvDropdownStub)

      expect(dropdown.props('items')).toHaveLength(2)
      expect(dropdown.props('triggerAriaLabel')).toBe('Supprimer...')
      expect(dropdown.props('triggerLabel')).toBe('Supprimer...')
    })
  })

  BddTest().when('tracesDisabled is false', () => {
    beforeEach(() => {
      wrapper = mount(DeleteActivityAssociatedElementsDropdown, {
        props: {
          tracesDisabled: false
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass a non-disabled traces item', () => {
      const dropdown = wrapper.findComponent(AvDropdownStub)
      const items = dropdown.props('items')

      expect(items).toHaveLength(2)
      expect(items[1].name).toBe('traces')
      expect(items[1].disabled).toBe(false)
    })
  })

  BddTest().when('tracesDisabled is true', () => {
    beforeEach(() => {
      wrapper = mount(DeleteActivityAssociatedElementsDropdown, {
        props: {
          tracesDisabled: true
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass a disabled traces item', () => {
      const dropdown = wrapper.findComponent(AvDropdownStub)
      const items = dropdown.props('items')

      expect(items).toHaveLength(2)
      expect(items[1].name).toBe('traces')
      expect(items[1].disabled).toBe(true)
    })
  })

  BddTest().when('the traces button is clicked', () => {
    beforeEach(() => {
      wrapper = mount(DeleteActivityAssociatedElementsDropdown, {
        props: {
          tracesDisabled: false
        },
        global: { stubs }
      })
    })

    BddTest().then('it should emit the tracesSelected event', async () => {
      const tracesButton = wrapper.find('[data-name="traces"]')

      await tracesButton.trigger('click')

      expect(wrapper.emitted('tracesSelected')).toHaveLength(1)
    })
  })

  BddTest().when('the skills button is clicked', () => {
    beforeEach(() => {
      wrapper = mount(DeleteActivityAssociatedElementsDropdown, {
        props: {
          tracesDisabled: false
        },
        global: { stubs }
      })
    })

    BddTest().then('it should emit the skillsSelected event', async () => {
      const skillsButton = wrapper.find('[data-name="skills"]')

      await skillsButton.trigger('click')

      expect(wrapper.emitted('skillsSelected')).toHaveLength(1)
    })
  })
})
