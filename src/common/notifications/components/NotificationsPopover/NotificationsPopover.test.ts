import { EUserCategory } from '@/api/avenir-esr'
import NotificationsPopover from '@/common/notifications/components/NotificationsPopover/NotificationsPopover.vue'
import { NotificationsPopoverBodyStub } from '@/common/notifications/components/NotificationsPopoverBody/NotificationsPopoverBody.stub'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvButtonStub, AvPopoverStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { h } from 'vue'

BddTest().given('a notifications popover', () => {
  let wrapper: VueWrapper<InstanceType<typeof NotificationsPopover>>

  const stubs = {
    NotificationsPopoverBody: NotificationsPopoverBodyStub,
    AvPopover: AvPopoverStub,
    AvButton: AvButtonStub
  }

  const mountDefault = async (userCategory: EUserCategory = EUserCategory.STAFF) => {
    wrapper = mountComponent(NotificationsPopover, {
      props: { userCategory },
      slots: {
        default: ({ notification }) =>
          h('div', {
            'data-testid': 'notification',
            'data-id': notification.id
          })
      },
      global: { stubs }
    })
    await flushPromises()
  }

  const getTrigger = () => wrapper.findComponent('[data-testid="notifications-popover-trigger"]') as VueWrapper<InstanceType<typeof AvButtonStub>>
  const getBody = () => wrapper.findComponent(NotificationsPopoverBodyStub)

  BddTest().when('notifications are enabled', () => {
    beforeEach(() => mountDefault(EUserCategory.STAFF))

    BddTest().then('it should render trigger with unread counter', () => {
      const trigger = getTrigger()
      expect(trigger.exists()).toBe(true)
      expect(trigger.props('icon')).toBe(MDI_ICONS.BELL_NOTIFICATION)
      expect(trigger.props('label')).toBe('Notifications (10)')
    })

    BddTest().then('it should render body with correct props', () => {
      const body = getBody()
      expect(body.exists()).toBe(true)
      expect(body.props('userCategory')).toBe(EUserCategory.STAFF)
    })
  })

  BddTest().when('notifications are disabled', () => {
    beforeEach(() => mountDefault(EUserCategory.STUDENT))

    BddTest().then('it should render trigger without unread counter', () => {
      const trigger = getTrigger()
      expect(trigger.exists()).toBe(true)
      expect(trigger.props('icon')).toBe(MDI_ICONS.NOTIFICATIONS_NONE)
      expect(trigger.props('label')).toBe('Notifications')
    })

    BddTest().then('it should render body with correct props', () => {
      const body = getBody()
      expect(body.exists()).toBe(true)
      expect(body.props('userCategory')).toBe(EUserCategory.STUDENT)
    })
  })

  BddTest().when('body emits close', () => {
    beforeEach(() => mountDefault())

    BddTest().then('it should close the popover', async () => {
      await getBody().find('[data-testid="emit-close"]').trigger('click')
      expect(getBody().emitted('close')?.length).toBe(1)
    })
  })
})
