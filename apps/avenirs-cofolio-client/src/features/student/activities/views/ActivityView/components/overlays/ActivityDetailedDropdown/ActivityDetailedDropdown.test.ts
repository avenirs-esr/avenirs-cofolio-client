import type { VueWrapper } from '@vue/test-utils'
import type { ActionItem } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import type { ActivityDetailedDropdownProps } from '@/features/student/activities/views/ActivityView/components/overlays/ActivityDetailedDropdown/ActivityDetailedDropdown.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { EActivityStatus, EDeclaredActivityStatus } from '@/api/avenir-esr'
import { ManageEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.stub'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ActivityDetailedDropdown from '@/features/student/activities/views/ActivityView/components/overlays/ActivityDetailedDropdown/ActivityDetailedDropdown.vue'

BddTest().given('an activity dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityDetailedDropdown>>

  const stubs = {
    ManageEntityDropdown: ManageEntityDropdownStub
  }

  const mountWith = (props: Partial<ActivityDetailedDropdownProps> = {}) => {
    wrapper = mount(ActivityDetailedDropdown, {
      props: {
        status: EDeclaredActivityStatus.COMPLETED,
        activityStatus: EActivityStatus.PUBLISHED,
        ...props
      },
      global: { stubs }
    })
  }

  const getDropdown = () => wrapper.findComponent(ManageEntityDropdownStub)
  const getUpdateButton = () => wrapper.find(`[data-testid="${Action.UPDATE}"]`)
  const getUnsubscribeButton = () => wrapper.find(`[data-testid="${Action.UNSUBSCRIBE}"]`)
  const getResubscribeButton = () => wrapper.find(`[data-testid="${Action.RESUBSCRIBE}"]`)
  const getDeleteButton = () => wrapper.find(`[data-testid="${Action.DELETE}"]`)
  const getAssociate = () => wrapper.find(`[data-testid="${Action.ASSOCIATE}"]`)

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

      const deleteAction = (getDropdown().props('actions') as Array<ActionItem>).find(({ type }) => type === Action.DELETE)
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

    BddTest().then('it should enable associate action when activity is subscribed', () => {
      expect(getAssociate().exists()).toBe(true)
      expect(getAssociate().attributes('disabled')).toBeUndefined()

      const associateAction = (getDropdown().props('actions') as Array<ActionItem>)
        .find(({ type }) => type === Action.ASSOCIATE)

      expect(associateAction?.disabled).toBe(false)
      expect(associateAction?.disabledTooltip).toBeUndefined()
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

    BddTest().then('it should disable associate action when activity is unsubscribed', () => {
      expect(getAssociate().exists()).toBe(true)
      expect(getAssociate().attributes('disabled')).toBe('')
      const associateAction = (getDropdown().props('actions') as Array<ActionItem>)
        .find(({ type }) => type === Action.ASSOCIATE)
      expect(associateAction?.disabled).toBe(true)
      expect(associateAction?.disabledTooltip).toBeTruthy()
    })

    BddTest().when('the declared activity is submitted', () => {
      beforeEach(() => {
        mountWith({ status: EDeclaredActivityStatus.SUBMITTED })
      })
      BddTest().then('it should disable associate action when activity is submitted', () => {
        expect(getAssociate().exists()).toBe(true)
        expect(getAssociate().attributes('disabled')).toBe('')

        const associateAction = (getDropdown().props('actions') as Array<ActionItem>)
          .find(({ type }) => type === Action.ASSOCIATE)

        expect(associateAction?.disabled).toBe(true)
        expect(associateAction?.disabledTooltip).toBeTruthy()
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
