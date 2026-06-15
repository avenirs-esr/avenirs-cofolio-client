import TracesActionsDropdown
  from '@/features/student/traces/views/StudentToolsTracesView/components/TracesActionsDropdown/TracesActionsDropdown.vue'
import { AvDropdownStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a traces actions dropdown', () => {
  let wrapper: VueWrapper

  const stubs = {
    AvDropdown: AvDropdownStub
  }

  function mountComponent () {
    wrapper = mount(TracesActionsDropdown, {
      global: { stubs }
    })
  }

  function dropdown () {
    return wrapper.findComponent({ name: 'AvDropdown' })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mountComponent()
  })

  BddTest().then('it should render the dropdown', () => {
    expect(dropdown().exists()).toBe(true)
  })

  BddTest().then('it should provide delete item to dropdown', () => {
    expect(dropdown().props('items')).toEqual([
      expect.objectContaining({
        name: 'delete',
        label: 'Supprimer des traces'
      })
    ])
  })

  BddTest().then('it should configure trigger labels', () => {
    expect(dropdown().props('triggerAriaLabel')).toBe('Plus d\'actions')
    expect(dropdown().props('triggerLabel')).toBe('Plus d\'actions')
  })

  BddTest().then('selecting delete item should emit deleteSelected', async () => {
    await dropdown().vm.$emit('itemSelected', 'delete')

    expect(wrapper.emitted('deleteSelected')).toHaveLength(1)
  })

  BddTest().then('selecting unknown item should not emit deleteSelected', async () => {
    await dropdown().vm.$emit('itemSelected', 'unknown')

    expect(wrapper.emitted('deleteSelected')).toBeUndefined()
  })
})
