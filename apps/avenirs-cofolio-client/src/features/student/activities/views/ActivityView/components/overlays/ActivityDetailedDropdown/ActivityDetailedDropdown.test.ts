import type { VueWrapper } from '@vue/test-utils'
import type { ActionItem } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import type { ActivityDetailedDropdownProps } from '@/features/student/activities/views/ActivityView/components/overlays/ActivityDetailedDropdown/ActivityDetailedDropdown.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { EActivityStatus, EAssociationContextType, EDeclaredActivityStatus } from '@avenirs-esr/shared/api/avenir-esr'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { ManageAssociableEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.stub'
import { ManageEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.stub'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ActivityDetailedDropdown from '@/features/student/activities/views/ActivityView/components/overlays/ActivityDetailedDropdown/ActivityDetailedDropdown.vue'

BddTest().given('an activity dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityDetailedDropdown>>

  const stubs = {
    ManageEntityDropdown: ManageEntityDropdownStub,
    ManageAssociableEntityDropdown: ManageAssociableEntityDropdownStub
  }

  const mountWith = (props: Partial<ActivityDetailedDropdownProps> = {}) => {
    wrapper = mount(ActivityDetailedDropdown, {
      props: {
        status: EDeclaredActivityStatus.COMPLETED,
        activityStatus: EActivityStatus.PUBLISHED,
        elementId: 'declared-activity-1',
        hasAssociations: false,
        ...props
      },
      global: { stubs }
    })
  }

  const getDropdown = () => wrapper.findComponent(ManageEntityDropdownStub)
  const getAssociateDropdown = () => wrapper.findComponent(ManageAssociableEntityDropdownStub)
  const getActions = () => getDropdown().props('actions') as Array<ActionItem>
  const getUpdateButton = () => wrapper.find(`[data-testid="${Action.UPDATE}"]`)
  const getUnsubscribeButton = () => wrapper.find(`[data-testid="${Action.UNSUBSCRIBE}"]`)
  const getResubscribeButton = () => wrapper.find(`[data-testid="${Action.RESUBSCRIBE}"]`)
  const getDeleteButton = () => wrapper.find(`[data-testid="${Action.DELETE}"]`)

  const getAssociateOverride = () => getAssociateDropdown().props('associateOverride') as { disabled: boolean, disabledTooltip?: string }

  BddTest().then('it should forward context, element id and has-associations to the associable dropdown', () => {
    mountWith()
    const generic = getAssociateDropdown()
    expect(generic.props('contextType')).toBe(EAssociationContextType.DECLARED_ACTIVITY)
    expect(generic.props('elementId')).toBe('declared-activity-1')
    expect(generic.props('hasAssociations')).toBe(false)
  })

  BddTest().when('the declared activity is subscribed', () => {
    beforeEach(() => {
      mountWith({ status: EDeclaredActivityStatus.SUBSCRIBED })
    })

    BddTest().then('it should render update, unsubscribe, and delete menu items', () => {
      const dropdown = getDropdown()
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props('actions')).toHaveLength(5)
    })

    BddTest().then('it should pass the correct entity name to the dropdown', () => {
      expect(getDropdown().props('entityName')).toBe('mon activité')
    })

    BddTest().then('it should not render resubscribe and should disable delete', () => {
      expect(getResubscribeButton().exists()).toBe(false)
      expect(getDeleteButton().exists()).toBe(true)
      expect(getDeleteButton().attributes('disabled')).toBe('')

      const deleteAction = getActions().find(({ type }) => type === Action.DELETE)
      expect(deleteAction?.disabled).toBe(true)
      expect(deleteAction?.disabledTooltip).toBeTruthy()
    })

    BddTest().when('the update button is clicked', () => {
      BddTest().then('it should emit the update event', async () => {
        const updateButton = getUpdateButton()
        await updateButton.trigger('click')
        expect(wrapper.emitted('update')).toHaveLength(1)
      })
    })

    BddTest().when('the unsubscribe button is clicked', () => {
      BddTest().then('it should emit the unsubscribe event', async () => {
        const unsubscribeButton = getUnsubscribeButton()
        await unsubscribeButton.trigger('click')
        expect(wrapper.emitted('unsubscribe')).toHaveLength(1)
      })
    })

    BddTest().then('it should pass an enabled associate override', () => {
      const override = getAssociateOverride()
      expect(override.disabled).toBe(false)
      expect(override.disabledTooltip).toBeUndefined()
    })
  })

  BddTest().when('the associate button is clicked', () => {
    BddTest().then('it should not emit associate ', async () => {
      await wrapper.find(`[data-testid="${Action.ASSOCIATE}"]`).trigger('click')
      expect(wrapper.emitted('associate')).toBeUndefined()
    })
  })

  BddTest().when('the declared activity is unsubscribed', () => {
    beforeEach(() => {
      mountWith({ status: EDeclaredActivityStatus.UNSUBSCRIBED })
    })

    BddTest().then('it should render the dropdown with two menu items', () => {
      const dropdown = getDropdown()
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props('actions')).toHaveLength(4)
    })

    BddTest().then('it should not render update or unsubscribe and should enable delete', () => {
      expect(getUpdateButton().exists()).toBe(false)
      expect(getUnsubscribeButton().exists()).toBe(false)
      expect(getDeleteButton().exists()).toBe(true)
      expect(getDeleteButton().attributes('disabled')).toBeUndefined()
    })

    BddTest().then('it should pass a disabled associate override', () => {
      const override = getAssociateOverride()
      expect(override.disabled).toBe(true)
      expect(override.disabledTooltip).toBeTruthy()
    })

    BddTest().when('the declared activity is completed', () => {
      beforeEach(() => {
        mountWith({ status: EDeclaredActivityStatus.COMPLETED })
      })
      BddTest().then('it should pass a disabled associate override', () => {
        const override = getAssociateOverride()
        expect(override.disabled).toBe(true)
        expect(override.disabledTooltip).toBeTruthy()
      })
    })

    BddTest().when('the declared activity is submitted form assessment', () => {
      beforeEach(() => {
        mountWith({ status: EDeclaredActivityStatus.SUBMITTED_FOR_ASSESSMENT })
      })

      BddTest().then('it should pass a disabled associate override', () => {
        const override = getAssociateOverride()
        expect(override.disabled).toBe(true)
        expect(override.disabledTooltip).toBeTruthy()
      })
    })

    BddTest().when('the resubscribe button is clicked', () => {
      BddTest().then('it should emit the resubscribe event', async () => {
        const resubscribeButton = getResubscribeButton()
        await resubscribeButton.trigger('click')
        expect(wrapper.emitted('resubscribe')).toHaveLength(1)
        expect(wrapper.emitted('delete')).toBeUndefined()
      })
    })

    BddTest().when('the delete button is clicked', () => {
      BddTest().then('it should emit the delete event', async () => {
        const deleteButton = getDeleteButton()
        await deleteButton.trigger('click')
        expect(wrapper.emitted('delete')).toHaveLength(1)
      })
    })

    BddTest().then('it should enable the resubscribe action', () => {
      const resubscribeAction = (getDropdown().props('actions') as Array<ActionItem>).find(({ type }) => type === Action.RESUBSCRIBE)
      expect(resubscribeAction?.disabled).toBe(false)
    })
  })

  BddTest().when('the declared activity is unsubscribed and the activity is unpublished', () => {
    beforeEach(() => {
      mountWith({ status: EDeclaredActivityStatus.UNSUBSCRIBED, activityStatus: EActivityStatus.UNPUBLISHED })
    })

    BddTest().then('it should disable the resubscribe action with a tooltip', () => {
      const resubscribeAction = (getDropdown().props('actions') as Array<ActionItem>).find(({ type }) => type === Action.RESUBSCRIBE)
      expect(resubscribeAction?.disabled).toBe(true)
      expect(resubscribeAction?.disabledTooltip).toBeTruthy()
    })
  })
})
