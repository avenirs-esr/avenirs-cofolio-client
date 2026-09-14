import { EDeclaredActivityStatus } from '@/api/avenir-esr'
import { ManageEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.stub'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ActivityDetailedDropdown, { type ActivityDetailedDropdownProps } from '@/features/student/activities/views/ActivityView/components/overlays/ActivityDetailedDropdown/ActivityDetailedDropdown.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an activity dropdown', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityDetailedDropdown>>

  const stubs = {
    ManageEntityDropdown: ManageEntityDropdownStub
  }

  const mountWith = (props: Partial<ActivityDetailedDropdownProps> = {}) => {
    wrapper = mount(ActivityDetailedDropdown, {
      props: {
        status: EDeclaredActivityStatus.COMPLETED,
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

  BddTest().when('the declared activity is subscribed', () => {
    beforeEach(() => {
      mountWith({ status: EDeclaredActivityStatus.SUBSCRIBED })
    })

    BddTest().then('it should render the dropdown with two menu items', () => {
      const dropdown = getDropdown()
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props('actions')).toHaveLength(2)
    })

    BddTest().then('it should pass the correct entity name to the dropdown', () => {
      expect(getDropdown().props('entityName')).toBe('mon activité')
    })

    BddTest().then('it should not render the resubscribe or delete menu items', () => {
      expect(getResubscribeButton().exists()).toBe(false)
      expect(getDeleteButton().exists()).toBe(false)
    })

    BddTest().when('the update button is clicked', () => {
      BddTest().then('it should emit the updateSelected event', async () => {
        const updateButton = getUpdateButton()
        await updateButton.trigger('click')
        expect(wrapper.emitted('updateSelected')).toHaveLength(1)
      })
    })

    BddTest().when('the unsubscribe button is clicked', () => {
      BddTest().then('it should emit the unsubscribeSelected event', async () => {
        const unsubscribeButton = getUnsubscribeButton()
        await unsubscribeButton.trigger('click')
        expect(wrapper.emitted('unsubscribeSelected')).toHaveLength(1)
      })
    })
  })

  BddTest().when('the declared activity is unsubscribed', () => {
    beforeEach(() => {
      mountWith({ status: EDeclaredActivityStatus.UNSUBSCRIBED })
    })

    BddTest().then('it should render the dropdown with two menu items', () => {
      const dropdown = getDropdown()
      expect(dropdown.exists()).toBe(true)
      expect(dropdown.props('actions')).toHaveLength(2)
    })

    BddTest().then('it should not render the update or unsubscribe menu items', () => {
      expect(getUpdateButton().exists()).toBe(false)
      expect(getUnsubscribeButton().exists()).toBe(false)
    })

    BddTest().when('the resubscribe button is clicked', () => {
      BddTest().then('it should emit the resubscribeSelected event', async () => {
        const resubscribeButton = getResubscribeButton()
        await resubscribeButton.trigger('click')
        expect(wrapper.emitted('resubscribeSelected')).toHaveLength(1)
        expect(wrapper.emitted('deleteSelected')).toBeUndefined()
      })
    })

    BddTest().when('the delete button is clicked', () => {
      BddTest().then('it should emit the deleteSelected event', async () => {
        const deleteButton = getDeleteButton()
        await deleteButton.trigger('click')
        expect(wrapper.emitted('deleteSelected')).toHaveLength(1)
      })
    })
  })
})
