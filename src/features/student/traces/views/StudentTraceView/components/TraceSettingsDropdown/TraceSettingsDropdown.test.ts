import { ManageEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.stub'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import TraceSettingsDropdown, { type TraceSettingsDropdownProps } from '@/features/student/traces/views/StudentTraceView/components/TraceSettingsDropdown/TraceSettingsDropdown.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

vi.stubGlobal('__DEMO_MODE__', false)

BddTest().given('a setting popover', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceSettingsDropdown>>

  const stubs = {
    ManageEntityDropdown: ManageEntityDropdownStub
  }

  const mountWith = (props: Partial<TraceSettingsDropdownProps> = {}, demoMode: boolean = false) => {
    vi.stubGlobal('__DEMO_MODE__', demoMode)
    wrapper = mount(TraceSettingsDropdown, {
      props,
      global: { stubs }
    })
  }

  const getDropdown = () => wrapper.findComponent(ManageEntityDropdownStub)
  const getAssociateButton = () => wrapper.find(`[data-testid="${Action.ASSOCIATE}"]`)
  const getUpdateButton = () => wrapper.find(`[data-testid="${Action.UPDATE}"]`)
  const getDownloadButton = () => wrapper.find(`[data-testid="${Action.DOWNLOAD}"]`)
  const getDeleteButton = () => wrapper.find(`[data-testid="${Action.DELETE}"]`)

  const getActionItem = (action: Action) => {
    const item = getDropdown().props('actions').find(item => item === action || (typeof item === 'object' && item.type === action))
    return item === undefined ? undefined : (typeof item === 'object' ? item : { type: item })
  }

  beforeEach(() => {
    mountWith()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the dropdown with four menu items', () => {
      const dropdown = getDropdown()
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props('actions')).toHaveLength(4)
    })

    BddTest().then('it should pass correct props to dropdown', () => {
      expect(getDropdown().props('entityName')).toBe('ma trace')
    })

    BddTest().then('it should enable delete and download items by default', () => {
      expect(getActionItem(Action.DOWNLOAD)?.disabled).toBe(false)
    })
  })

  BddTest().when('the component is mounted in demo mode', () => {
    beforeEach(() => {
      mountWith({}, true)
    })

    BddTest().then('it should render the dropdown without associate action', () => {
      expect(getAssociateButton().exists()).toBe(false)
    })
  })

  BddTest().when('the download is disabled', () => {
    beforeEach(() => {
      mountWith({ downloadDisabled: true })
    })

    BddTest().then('it should disable the download item', () => {
      expect(getActionItem(Action.DOWNLOAD)?.disabled).toBe(true)
    })
  })

  BddTest().when('the delete button is clicked', () => {
    BddTest().then('it should emit the deleteSelected event', async () => {
      await getDeleteButton().trigger('click')
      expect(wrapper.emitted('deleteSelected')).toHaveLength(1)
    })
  })

  BddTest().when('the associate button is clicked', () => {
    BddTest().then('it should emit the associateSelected event', async () => {
      await getAssociateButton().trigger('click')
      expect(wrapper.emitted('associateSelected')).toHaveLength(1)
    })
  })

  BddTest().when('the update button is clicked', () => {
    BddTest().then('it should emit the updateSelected event', async () => {
      await getUpdateButton().trigger('click')
      expect(wrapper.emitted('updateSelected')).toHaveLength(1)
    })
  })

  BddTest().when('the download button is clicked', () => {
    BddTest().then('it should emit the downloadSelected event', async () => {
      await getDownloadButton().trigger('click')
      expect(wrapper.emitted('downloadSelected')).toHaveLength(1)
    })
  })
})
