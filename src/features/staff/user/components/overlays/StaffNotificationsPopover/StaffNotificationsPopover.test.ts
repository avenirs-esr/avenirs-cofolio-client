import type { VueWrapper } from '@vue/test-utils'
import { mockedStaffNotification } from '@/__mocks__/fixtures/staffs/notifications.fixtures'
import { NotificationsPopoverStub } from '@/common/notifications/components/NotificationsPopover/NotificationsPopover.stub'
import { ActivityFeedbackNotificationCardStub } from '@/features/staff/global/components/cards/ActivityFeedbackNotificationCard/ActivityFeedbackNotificationCard.stub'
import StaffNotificationsPopover from '@/features/staff/user/components/overlays/StaffNotificationsPopover/StaffNotificationsPopover.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a StaffNotificationsPopover', () => {
  let wrapper: VueWrapper<InstanceType<typeof StaffNotificationsPopover>>

  const stubs = {
    NotificationsPopover: NotificationsPopoverStub,
    ActivityFeedbackNotificationCard: ActivityFeedbackNotificationCardStub
  }

  const mountDefault = () => {
    wrapper = mountComponent(StaffNotificationsPopover, {
      props: {
        notificationsEnabled: true,
        unseenNotifications: 10
      },
      attrs: {
        notifications: [mockedStaffNotification]
      },
      global: { stubs }
    })
  }

  const getPopover = () => wrapper.findComponent(NotificationsPopoverStub)
  const getCards = () => wrapper.findAllComponents(ActivityFeedbackNotificationCardStub)

  BddTest().when('the component is mounted', () => {
    beforeEach(() => mountDefault())

    BddTest().then('it should render NotificationsPopover with correct props', () => {
      expect(getPopover().exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted without notifications', () => {
    beforeEach(() => {
      wrapper = mountComponent(StaffNotificationsPopover, {
        props: {
          notificationsEnabled: true,
          unseenNotifications: 0
        },
        attrs: {
          notifications: []
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render NotificationsPopover with correct props', () => {
      expect(getPopover().exists()).toBe(true)
    })

    BddTest().then('it should render the empty state message', () => {
      expect(wrapper.text()).toContain('Vous recevrez une notification dans les cas suivants :')
      expect(wrapper.text()).toContain('Un apprenant vous enverra une demande de feedback')
    })
  })

  BddTest().when('notification is ASK_FOR_FEEDBACK', () => {
    beforeEach(() => mountDefault())

    BddTest().then('it should render ActivityFeedbackNotificationCard with correct props', () => {
      const cards = getCards()
      expect(cards.length).toBe(1)
    })
  })
})
