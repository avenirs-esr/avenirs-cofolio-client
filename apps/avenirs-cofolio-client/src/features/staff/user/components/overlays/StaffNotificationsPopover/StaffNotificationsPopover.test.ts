import type { NotificationDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { beforeEach, expect } from 'vitest'
import { mockedAskForFeedbackNotification, mockedAssessmentRequestNotification, mockedStaffNotification } from '@/__mocks__/fixtures/staffs/notifications.fixtures'
import { NotificationsPopoverStub } from '@/common/notifications/components/NotificationsPopover/NotificationsPopover.stub'
import { ActivityAssessmentNotificationCardStub } from '@/features/staff/global/components/cards/ActivityAssessmentNotificationCard/ActivityAssessmentNotificationCard.stub'
import { ActivityFeedbackNotificationCardStub } from '@/features/staff/global/components/cards/ActivityFeedbackNotificationCard/ActivityFeedbackNotificationCard.stub'
import StaffNotificationsPopover from '@/features/staff/user/components/overlays/StaffNotificationsPopover/StaffNotificationsPopover.vue'

BddTest().given('a StaffNotificationsPopover', () => {
  let wrapper: VueWrapper<InstanceType<typeof StaffNotificationsPopover>>

  const stubs = {
    NotificationsPopover: NotificationsPopoverStub,
    ActivityFeedbackNotificationCard: ActivityFeedbackNotificationCardStub,
    ActivityAssessmentNotificationCard: ActivityAssessmentNotificationCardStub
  }

  const mountDefault = (notification?: NotificationDTO) => {
    wrapper = mountComponent(StaffNotificationsPopover, {
      attrs: { notifications: notification ? [notification] : undefined },
      global: { stubs }
    })
  }

  const getPopover = () => wrapper.findComponent(NotificationsPopoverStub)
  const getActivityFeedbackNotificationCards = () => wrapper.findAllComponents(ActivityFeedbackNotificationCardStub)
  const getActivityAssessmentNotificationCards = () => wrapper.findAllComponents(ActivityAssessmentNotificationCardStub)

  BddTest().when('the component is mounted', () => {
    beforeEach(() => mountDefault(mockedStaffNotification))

    BddTest().then('it should render NotificationsPopover with correct props', () => {
      expect(getPopover().exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted without notifications', () => {
    beforeEach(() => mountDefault())

    BddTest().then('it should render NotificationsPopover with correct props', () => {
      expect(getPopover().exists()).toBe(true)
    })

    BddTest().then('it should render the empty state message', () => {
      expect(wrapper.text()).toContain('Vous recevrez une notification dans les cas suivants\u00A0:')
      expect(wrapper.text()).toContain('Un apprenant vous enverra une demande de feedback')
    })
  })

  BddTest().when('notification is ASK_FOR_FEEDBACK', () => {
    const notification = mockedAskForFeedbackNotification()

    beforeEach(() => mountDefault(notification))

    BddTest().then('it should render ActivityFeedbackNotificationCard with correct props', () => {
      const cards = getActivityFeedbackNotificationCards()
      expect(cards.length).toBe(1)
    })

    BddTest().then('it should not render ActivityAssessmentNotificationCard', () => {
      const cards = getActivityAssessmentNotificationCards()
      expect(cards.length).toBe(0)
    })
  })

  BddTest().when('notification is ASSESSMENT_REQUEST', () => {
    const notification = mockedAssessmentRequestNotification()

    beforeEach(() => mountDefault(notification))

    BddTest().then('it should render ActivityAssessmentNotificationCard with correct props', () => {
      const cards = getActivityAssessmentNotificationCards()
      expect(cards.length).toBe(1)
    })

    BddTest().then('it should not render ActivityFeedbackNotificationCard', () => {
      const cards = getActivityFeedbackNotificationCards()
      expect(cards.length).toBe(0)
    })
  })
})
