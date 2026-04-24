import TraceAssociateElementsDropdown from '@/features/student/traces/views/StudentTraceView/components/overlays/dropdowns/TraceAssociateElementsDropdown/TraceAssociateElementsDropdown.vue'
import { AvDropdownStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a trace associate elements dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceAssociateElementsDropdown>>

  const stubs = {
    AvDropdown: AvDropdownStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(TraceAssociateElementsDropdown, { global: { stubs } })
    })

    BddTest().then('it should render the dropdown with two menu items', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })

      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props('items')).toHaveLength(3)
    })

    BddTest().then('it should pass correct props to dropdown', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })

      expect(dropdown.props('items')).toHaveLength(3)
      expect(dropdown.props('triggerAriaLabel')).toBe('Associer...')
      expect(dropdown.props('triggerLabel')).toBe('Associer...')
      expect(dropdown.props('triggerVariant')).toBe('FLAT')
    })

    BddTest().then('it should have activities as first item', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      const items = dropdown.props('items') as { name: string }[]

      expect(items[0].name).toBe('activities')
    })

    BddTest().then('it should have experiences as second item', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      const items = dropdown.props('items') as { name: string }[]

      expect(items[1].name).toBe('experiences')
    })

    BddTest().then('it should have skills as third item', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      const items = dropdown.props('items') as { name: string }[]

      expect(items[2].name).toBe('skills')
    })
  })

  BddTest().when('the activities button is clicked', () => {
    beforeEach(() => {
      wrapper = mount(TraceAssociateElementsDropdown, { global: { stubs } })
    })

    BddTest().then('it should emit the activitiesSelected event', async () => {
      const activitiesButton = wrapper.find('[data-name="activities"]')
      await activitiesButton.trigger('click')
      expect(wrapper.emitted('activitiesSelected')).toHaveLength(1)
    })
  })

  BddTest().when('the experiences button is clicked', () => {
    beforeEach(() => {
      wrapper = mount(TraceAssociateElementsDropdown, { global: { stubs } })
    })

    BddTest().then('it should emit the experiencesSelected event', async () => {
      const experiencesButton = wrapper.find('[data-name="experiences"]')
      await experiencesButton.trigger('click')
      expect(wrapper.emitted('experiencesSelected')).toHaveLength(1)
    })
  })

  BddTest().when('the skills button is clicked', () => {
    beforeEach(() => {
      wrapper = mount(TraceAssociateElementsDropdown, { global: { stubs } })
    })

    BddTest().then('it should emit the skillsSelected event', async () => {
      const skillsButton = wrapper.find('[data-name="skills"]')
      await skillsButton.trigger('click')
      expect(wrapper.emitted('skillsSelected')).toHaveLength(1)
    })
  })
})
