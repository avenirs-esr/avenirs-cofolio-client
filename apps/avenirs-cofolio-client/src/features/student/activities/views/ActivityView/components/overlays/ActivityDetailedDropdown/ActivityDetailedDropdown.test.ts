import type { VueWrapper } from '@vue/test-utils'
import type { ActionItem } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import type { ActivityDetailedDropdownProps } from '@/features/student/activities/views/ActivityView/components/overlays/ActivityDetailedDropdown/ActivityDetailedDropdown.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { EActivityStatus, EAssociationContextType, EDeclaredActivityStatus } from '@avenirs-esr/shared/api/avenir-esr'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ActivityDetailedDropdown from '@/features/student/activities/views/ActivityView/components/overlays/ActivityDetailedDropdown/ActivityDetailedDropdown.vue'
import { ManageAssociableEntityDropdownStub } from '@/features/student/associations/components/overlays/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.stub'

BddTest().given('an activity detailed dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityDetailedDropdown>>

  const stubs = {
    ManageAssociableEntityDropdown: ManageAssociableEntityDropdownStub
  }

  const mountWith = (props: Partial<ActivityDetailedDropdownProps> = {}) => {
    wrapper = mount(ActivityDetailedDropdown, {
      props: {
        declaredActivityId: 'declared-activity-id',
        status: EDeclaredActivityStatus.SUBSCRIBED,
        activityStatus: EActivityStatus.PUBLISHED,
        ...props
      },
      global: { stubs }
    })
  }

  const getDropdown = () => wrapper.findComponent(ManageAssociableEntityDropdownStub)
  const getActionButton = (action: Action) => wrapper.find(`[data-testid="${action}"]`)

  const getAction = (action: Action) =>
    (getDropdown().props('actions') as ActionItem[]).find(item =>
      typeof item === 'string' ? item === action : item.type === action
    )

  BddTest().when('the declared activity is subscribed', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the associable entity dropdown', () => {
      expect(getDropdown().exists()).toBe(true)
    })

    BddTest().then('it should pass the declared activity identification to the dropdown', () => {
      expect(getDropdown().props('elementId')).toBe('declared-activity-id')
      expect(getDropdown().props('contextType')).toBe(EAssociationContextType.DECLARED_ACTIVITY)
      expect(getDropdown().props('entityName')).toBe('mon activité')
    })

    BddTest().then('it should render update, unsubscribe, and delete actions', () => {
      const actions = getDropdown().props('actions')

      expect(actions).toHaveLength(3)
      expect(getActionButton(Action.UPDATE).exists()).toBe(true)
      expect(getActionButton(Action.UNSUBSCRIBE).exists()).toBe(true)
      expect(getActionButton(Action.DELETE).exists()).toBe(true)
      expect(getActionButton(Action.RESUBSCRIBE).exists()).toBe(false)
    })

    BddTest().then('it should disable delete action with a tooltip', () => {
      const deleteAction = getAction(Action.DELETE)

      expect(getActionButton(Action.DELETE).attributes('disabled')).toBe('')
      expect(deleteAction).toMatchObject({
        disabled: true,
        disabledTooltip: expect.any(String)
      })
    })

    BddTest().then('it should enable association and dissociation interactions', () => {
      expect(getDropdown().props('associationInteractiveProps')).toEqual({
        disabled: false,
        disabledTooltip: undefined
      })
      expect(getDropdown().props('dissociationInteractiveProps')).toEqual({
        disabled: false,
        disabledTooltip: undefined
      })
    })

    BddTest().when('the update action is triggered', () => {
      BddTest().then('it should emit the update event', async () => {
        await getActionButton(Action.UPDATE).trigger('click')

        expect(wrapper.emitted('update')).toHaveLength(1)
      })
    })

    BddTest().when('the unsubscribe action is triggered', () => {
      BddTest().then('it should emit the unsubscribe event', async () => {
        await getActionButton(Action.UNSUBSCRIBE).trigger('click')

        expect(wrapper.emitted('unsubscribe')).toHaveLength(1)
      })
    })
  })

  BddTest().when('the declared activity is unsubscribed', () => {
    beforeEach(() => {
      mountWith({ status: EDeclaredActivityStatus.UNSUBSCRIBED })
    })

    BddTest().then('it should render delete and resubscribe actions', () => {
      const actions = getDropdown().props('actions')

      expect(actions).toHaveLength(2)
      expect(getActionButton(Action.DELETE).exists()).toBe(true)
      expect(getActionButton(Action.RESUBSCRIBE).exists()).toBe(true)
      expect(getActionButton(Action.UPDATE).exists()).toBe(false)
      expect(getActionButton(Action.UNSUBSCRIBE).exists()).toBe(false)
    })

    BddTest().then('it should enable delete action', () => {
      expect(getActionButton(Action.DELETE).attributes('disabled')).toBeUndefined()
      expect(getAction(Action.DELETE)).toMatchObject({
        disabled: false
      })
    })

    BddTest().then('it should disable association and dissociation interactions with a tooltip', () => {
      expect(getDropdown().props('associationInteractiveProps')).toMatchObject({
        disabled: true,
        disabledTooltip: expect.any(String)
      })
      expect(getDropdown().props('dissociationInteractiveProps')).toMatchObject({
        disabled: true,
        disabledTooltip: expect.any(String)
      })
    })

    BddTest().then('it should enable the resubscribe action when the activity is published', () => {
      expect(getAction(Action.RESUBSCRIBE)).toMatchObject({
        disabled: false,
        disabledTooltip: expect.any(String)
      })
    })

    BddTest().when('the resubscribe action is triggered', () => {
      BddTest().then('it should emit the resubscribe event', async () => {
        await getActionButton(Action.RESUBSCRIBE).trigger('click')

        expect(wrapper.emitted('resubscribe')).toHaveLength(1)
        expect(wrapper.emitted('delete')).toBeUndefined()
      })
    })

    BddTest().when('the delete action is triggered', () => {
      BddTest().then('it should emit the delete event', async () => {
        await getActionButton(Action.DELETE).trigger('click')

        expect(wrapper.emitted('delete')).toHaveLength(1)
      })
    })
  })

  BddTest().when('the declared activity is unsubscribed and the activity is unpublished', () => {
    beforeEach(() => {
      mountWith({
        status: EDeclaredActivityStatus.UNSUBSCRIBED,
        activityStatus: EActivityStatus.UNPUBLISHED
      })
    })

    BddTest().then('it should disable resubscribe action with a tooltip', () => {
      expect(getActionButton(Action.RESUBSCRIBE).attributes('disabled')).toBe('')
      expect(getAction(Action.RESUBSCRIBE)).toMatchObject({
        disabled: true,
        disabledTooltip: expect.any(String)
      })
    })
  })

  BddTest().when('the declared activity is completed', () => {
    beforeEach(() => {
      mountWith({ status: EDeclaredActivityStatus.COMPLETED })
    })

    BddTest().then('it should disable association and dissociation interactions with a tooltip', () => {
      expect(getDropdown().props('associationInteractiveProps')).toMatchObject({
        disabled: true,
        disabledTooltip: expect.any(String)
      })
      expect(getDropdown().props('dissociationInteractiveProps')).toMatchObject({
        disabled: true,
        disabledTooltip: expect.any(String)
      })
    })
  })

  BddTest().when('the declared activity is submitted for assessment', () => {
    beforeEach(() => {
      mountWith({ status: EDeclaredActivityStatus.SUBMITTED_FOR_ASSESSMENT })
    })

    BddTest().then('it should disable association and dissociation interactions with a tooltip', () => {
      expect(getDropdown().props('associationInteractiveProps')).toMatchObject({
        disabled: true,
        disabledTooltip: expect.any(String)
      })
      expect(getDropdown().props('dissociationInteractiveProps')).toMatchObject({
        disabled: true,
        disabledTooltip: expect.any(String)
      })
    })
  })
})
