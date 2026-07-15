import type { VueWrapper } from '@vue/test-utils'
import { mockedStudentNotification } from '@/__mocks__/fixtures/student/notifications.fixtures'
import { EUserCategory, type NotificationDTO } from '@/api/avenir-esr'
import { NotificationsPopoverStub } from '@/common/notifications/components/NotificationsPopover/NotificationsPopover.stub'
import { ActivityModifiedNotificationCardStub } from '@/features/student/global/components/cards/ActivityModifiedNotificationCard/ActivityModifiedNotificationCard.stub'
import StudentNotificationsPopover from '@/features/student/user/components/overlays/StudentNotificationsPopover/StudentNotificationsPopover.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a StudentNotificationsPopover', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentNotificationsPopover>>

  const stubs = {
    NotificationsPopover: NotificationsPopoverStub,
    ActivityModifiedNotificationCard: ActivityModifiedNotificationCardStub
  }

  const mountDefault = (notification?: NotificationDTO) => {
    wrapper = mountComponent(StudentNotificationsPopover, {
      attrs: { notifications: notification ? [notification] : undefined },
      global: { stubs }
    })
  }

  const getPopover = () => wrapper.findComponent(NotificationsPopoverStub)
  const getContextsHeader = () => wrapper.find('[data-testid="student-notifications-popover-contexts-header"]')
  const getContexts = () => wrapper.find('[data-testid="student-notifications-popover-contexts"]')
  const getActivityModifiedNotificationCards = () => wrapper.findAllComponents(ActivityModifiedNotificationCardStub)

  BddTest().when('the component is rendered', () => {
    beforeEach(() => mountDefault())

    BddTest().then('it should render NotificationsPopover with correct props', () => {
      const popover = getPopover()
      expect(popover.exists()).toBe(true)
      expect(popover.props('userCategory')).toBe(EUserCategory.STUDENT)
    })
  })

  BddTest().when('no notification is provided', () => {
    beforeEach(() => mountDefault())

    BddTest().then('it should render empty slot header', () => {
      expect(getContextsHeader().text()).toBe('Vous recevrez une notification dans les cas suivants :')
    })

    BddTest().then('it should render all context items', () => {
      const contexts = getContexts()
      expect(contexts.exists()).toBe(true)
      expect(contexts.element.children.length).toBe(1)
      expect(contexts.element.children[0].textContent).toBe('Une activité à laquelle vous êtes inscrit(e) a été modifiée')
    })
  })

  BddTest().when('notification is ACTIVITY_MODIFIED', () => {
    beforeEach(() => mountDefault(mockedStudentNotification))

    BddTest().then('it should render ActivityModifiedNotificationCard with correct props', () => {
      const activityModifiedNotificationCards = getActivityModifiedNotificationCards()
      expect(activityModifiedNotificationCards.length).toBe(1)
      expect(activityModifiedNotificationCards[0].props('notification')).toEqual(mockedStudentNotification)
    })
  })
})
