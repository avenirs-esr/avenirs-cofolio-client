import ActivityDetailedDropdown from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/ActivityDetailedDropdown/ActivityDetailedDropdown.vue'
import { AvDropdownStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an activity detailed dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityDetailedDropdown>>

  const stubs = {
    AvDropdown: AvDropdownStub
  }

  beforeEach(() => {
    wrapper = mount(ActivityDetailedDropdown, { global: { stubs } })
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
      expect(dropdown.props('triggerAriaLabel')).toBe('Gérer mon activité')
      expect(dropdown.props('triggerLabel')).toBe('Gérer mon activité')
    })
  })

  BddTest().when('the update button is clicked', () => {
    BddTest().then('it should emit the updateSelected event', async () => {
      const updateButton = wrapper.find('[data-name="update"]')
      await updateButton.trigger('click')
      expect(wrapper.emitted('updateSelected')).toHaveLength(1)
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
