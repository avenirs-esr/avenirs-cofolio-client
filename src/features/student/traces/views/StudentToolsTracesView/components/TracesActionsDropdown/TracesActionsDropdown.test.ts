import { ManageEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.stub'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import TracesActionsDropdown
  from '@/features/student/traces/views/StudentToolsTracesView/components/TracesActionsDropdown/TracesActionsDropdown.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a TracesActionsDropdown', () => {
  let wrapper: VueWrapper

  const stubs = {
    ManageEntityDropdown: ManageEntityDropdownStub
  }

  const mountWith = () => {
    vi.clearAllMocks()
    wrapper = mount(TracesActionsDropdown, {
      global: { stubs }
    })
  }

  const getDropdown = () => wrapper.findComponent(ManageEntityDropdownStub)
  const getDeleteButton = () => wrapper.find(`[data-testid="${Action.DELETE}"]`)

  beforeEach(() => {
    mountWith()
  })

  BddTest().then('it should render the dropdown', () => {
    expect(getDropdown().exists()).toBe(true)
  })

  BddTest().then('it should provide delete action to dropdown', () => {
    expect(getDropdown().props('actions')).toEqual([Action.DELETE])
  })

  BddTest().then('it should configure entity name', () => {
    expect(getDropdown().props('entityName')).toBe('ma trace')
  })

  BddTest().then('clicking the delete button should emit deleteSelected', async () => {
    await getDeleteButton().trigger('click')
    expect(wrapper.emitted('deleteSelected')).toHaveLength(1)
  })
})
