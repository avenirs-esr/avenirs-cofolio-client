import type { AvDropdownItem } from '@avenirs-esr/avenirs-dsav'
import TraceSettingsDropdown from '@/features/student/traces/views/StudentTraceView/components/TraceSettingsDropdown/TraceSettingsDropdown.vue'
import { AvDropdownStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

vi.stubGlobal('__DEMO_MODE__', false)

BddTest().given('a setting popover', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceSettingsDropdown>>

  const stubs = {
    AvDropdown: AvDropdownStub
  }

  function mountComponent (props = {}) {
    wrapper = mount(TraceSettingsDropdown, {
      props,
      global: { stubs }
    })
  }

  beforeEach(() => {
    vi.stubGlobal('__DEMO_MODE__', false)
    mountComponent()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the dropdown with four menu items', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })

      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props('items')).toHaveLength(4)
    })

    BddTest().then('it should pass correct props to dropdown', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })

      expect(dropdown.props('triggerAriaLabel')).toBe('Plus d\'actions')
      expect(dropdown.props('triggerLabel')).toBe('Plus d\'actions')
    })

    BddTest().then('it should enable delete and download items by default', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      const items = dropdown.props('items') as AvDropdownItem[]

      expect(items.find(item => item.name === 'delete')?.disabled).toBe(false)
      expect(items.find(item => item.name === 'download')?.disabled).toBe(false)
    })
  })

  BddTest().when('the component is mounted in demo mode', () => {
    beforeEach(() => {
      vi.stubGlobal('__DEMO_MODE__', true)
      mountComponent()
    })

    BddTest().then('it should render the dropdown without associate item', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      const items = dropdown.props('items') as AvDropdownItem[]

      expect(items).toHaveLength(3)
      expect(items.some(item => item.name === 'associate')).toBe(false)
    })
  })

  BddTest().when('the trace is not deletable', () => {
    beforeEach(() => {
      mountComponent({ isDeletable: false })
    })

    BddTest().then('it should disable the delete item', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      const items = dropdown.props('items') as AvDropdownItem[]

      expect(items.find(item => item.name === 'delete')?.disabled).toBe(true)
    })
  })

  BddTest().when('the download is disabled', () => {
    beforeEach(() => {
      mountComponent({ downloadDisabled: true })
    })

    BddTest().then('it should disable the download item', () => {
      const dropdown = wrapper.findComponent({ name: 'AvDropdown' })
      const items = dropdown.props('items') as AvDropdownItem[]

      expect(items.find(item => item.name === 'download')?.disabled).toBe(true)
    })
  })

  BddTest().when('the delete button is clicked', () => {
    BddTest().then('it should emit the deleteSelected event', async () => {
      await wrapper.find('[data-name="delete"]').trigger('click')

      expect(wrapper.emitted('deleteSelected')).toHaveLength(1)
    })
  })

  BddTest().when('the associate button is clicked', () => {
    BddTest().then('it should emit the associateSelected event', async () => {
      await wrapper.find('[data-name="associate"]').trigger('click')

      expect(wrapper.emitted('associateSelected')).toHaveLength(1)
    })
  })

  BddTest().when('the update button is clicked', () => {
    BddTest().then('it should emit the updateSelected event', async () => {
      await wrapper.find('[data-name="update"]').trigger('click')

      expect(wrapper.emitted('updateSelected')).toHaveLength(1)
    })
  })

  BddTest().when('the download button is clicked', () => {
    BddTest().then('it should emit the downloadSelected event', async () => {
      await wrapper.find('[data-name="download"]').trigger('click')

      expect(wrapper.emitted('downloadSelected')).toHaveLength(1)
    })
  })
})
