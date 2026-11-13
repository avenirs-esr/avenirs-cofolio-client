import type { VueWrapper } from '@vue/test-utils'
import type { TraceSettingsDropdownProps } from '@/features/student/traces/views/StudentTraceView/components/TraceSettingsDropdown/TraceSettingsDropdown.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { ManageAssociableEntityDropdownStub } from '@/features/student/associations/components/overlays/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.stub'
import TraceSettingsDropdown from '@/features/student/traces/views/StudentTraceView/components/TraceSettingsDropdown/TraceSettingsDropdown.vue'

BddTest().given('a trace settings dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceSettingsDropdown>>

  const traceId = 'trace-123'

  const stubs = {
    ManageAssociableEntityDropdown: ManageAssociableEntityDropdownStub,
  }

  const mountWith = (props: Partial<TraceSettingsDropdownProps> = {}) => {
    wrapper = mount(TraceSettingsDropdown, {
      props: {
        traceId,
        ...props,
      },
      global: { stubs },
    })
  }

  const getDropdown = () => wrapper.findComponent(ManageAssociableEntityDropdownStub)
  const getActionButton = (action: Action) => wrapper.find(`[data-testid="${action}"]`)

  const getActionItem = (action: Action) => {
    expect(getDropdown().props('actions')).toBeDefined()

    const item = getDropdown().props('actions')!.find(
      item => item === action || (typeof item === 'object' && item.type === action),
    )

    return item === undefined
      ? undefined
      : typeof item === 'object'
        ? item
        : { type: item }
  }

  beforeEach(() => {
    mountWith()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render ManageAssociableEntityDropdown', () => {
      expect(getDropdown().exists()).toBe(true)
    })

    BddTest().then('it should pass the trace identifier', () => {
      expect(getDropdown().props('elementId')).toBe(traceId)
    })

    BddTest().then('it should pass the trace association context', () => {
      expect(getDropdown().props('contextType')).toBe(EAssociationContextType.TRACE)
    })

    BddTest().then('it should pass the entity name', () => {
      expect(getDropdown().props('entityName')).toBe('ma trace')
    })

    BddTest().then('it should pass update, download and delete actions', () => {
      expect(getDropdown().props('actions')).toHaveLength(3)
      expect(getActionItem(Action.UPDATE)).toBeDefined()
      expect(getActionItem(Action.DOWNLOAD)).toBeDefined()
      expect(getActionItem(Action.DELETE)).toBeDefined()
    })

    BddTest().then('it should enable download by default', () => {
      expect(getActionItem(Action.DOWNLOAD)?.disabled).toBe(false)
    })
  })

  BddTest().when('the download is disabled', () => {
    beforeEach(() => {
      mountWith({ downloadDisabled: true })
    })

    BddTest().then('it should disable the download action', () => {
      expect(getActionItem(Action.DOWNLOAD)?.disabled).toBe(true)
    })

    BddTest().then('it should provide a disabled tooltip', () => {
      expect(getActionItem(Action.DOWNLOAD)?.disabledTooltip).toBe(
        'Le téléchargement est désactivé pour cette trace.',
      )
    })
  })

  BddTest().when('the update action is selected', () => {
    BddTest().then('it should emit the update event', async () => {
      await getActionButton(Action.UPDATE).trigger('click')

      expect(wrapper.emitted('update')).toHaveLength(1)
    })
  })

  BddTest().when('the download action is selected', () => {
    BddTest().then('it should emit the download event', async () => {
      await getActionButton(Action.DOWNLOAD).trigger('click')

      expect(wrapper.emitted('download')).toHaveLength(1)
    })
  })

  BddTest().when('the delete action is selected', () => {
    BddTest().then('it should emit the delete event', async () => {
      await getActionButton(Action.DELETE).trigger('click')

      expect(wrapper.emitted('delete')).toHaveLength(1)
    })
  })
})
