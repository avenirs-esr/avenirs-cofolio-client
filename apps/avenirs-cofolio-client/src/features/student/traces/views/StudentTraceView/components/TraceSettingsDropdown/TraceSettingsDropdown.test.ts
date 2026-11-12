import type { VueWrapper } from '@vue/test-utils'
import type { TraceSettingsDropdownProps } from '@/features/student/traces/views/StudentTraceView/components/TraceSettingsDropdown/TraceSettingsDropdown.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { mockedTraceDetailed } from '@/__mocks__/fixtures/student'
import { EAssociationContextType } from '@/api/avenir-esr'
import { ManageAssociableEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.stub'
import { ManageEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.stub'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import TraceSettingsDropdown from '@/features/student/traces/views/StudentTraceView/components/TraceSettingsDropdown/TraceSettingsDropdown.vue'

BddTest().given('a setting popover', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceSettingsDropdown>>

  const elementId = mockedTraceDetailed.id

  const stubs = {
    ManageEntityDropdown: ManageEntityDropdownStub,
    ManageAssociableEntityDropdown: ManageAssociableEntityDropdownStub
  }

  const mountWith = (props: Partial<TraceSettingsDropdownProps> = {}) => {
    wrapper = mount(TraceSettingsDropdown, {
      props: {
        elementId,
        hasAssociations: true,
        ...props
      },
      global: { stubs }
    })
  }

  const getDropdown = () => wrapper.findComponent(ManageEntityDropdownStub)
  const getUpdateButton = () => wrapper.find(`[data-testid="${Action.UPDATE}"]`)
  const getDownloadButton = () => wrapper.find(`[data-testid="${Action.DOWNLOAD}"]`)
  const getDeleteButton = () => wrapper.find(`[data-testid="${Action.DELETE}"]`)
  const getAssociateDropdown = () => wrapper.findComponent(ManageAssociableEntityDropdownStub)

  const getActionItem = (action: Action) => {
    const item = getDropdown().props('actions').find(item => item === action || (typeof item === 'object' && item.type === action))
    return item === undefined ? undefined : (typeof item === 'object' ? item : { type: item })
  }

  beforeEach(() => {
    mountWith()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the dropdown with three menu items', () => {
      const dropdown = getDropdown()
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props('actions')).toHaveLength(5)
    })

    BddTest().then('it should pass correct props to dropdown', () => {
      expect(getDropdown().props('entityName')).toBe('ma trace')
    })

    BddTest().then('it should enable delete and download items by default', () => {
      expect(getActionItem(Action.DOWNLOAD)?.disabled).toBe(false)
    })

    BddTest().then('it should forward context, element id and has-associations to the associable dropdown', () => {
      const generic = getAssociateDropdown()
      expect(generic.props('contextType')).toBe(EAssociationContextType.TRACE)
      expect(generic.props('elementId')).toBe(elementId)
      expect(generic.props('hasAssociations')).toBe(true)
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
    BddTest().then('it should emit the delete event', async () => {
      await getDeleteButton().trigger('click')
      expect(wrapper.emitted('delete')).toHaveLength(1)
    })
  })

  BddTest().when('the update button is clicked', () => {
    BddTest().then('it should emit the update event', async () => {
      await getUpdateButton().trigger('click')
      expect(wrapper.emitted('update')).toHaveLength(1)
    })
  })

  BddTest().when('the download button is clicked', () => {
    BddTest().then('it should emit the download event', async () => {
      await getDownloadButton().trigger('click')
      expect(wrapper.emitted('download')).toHaveLength(1)
    })
  })
})
