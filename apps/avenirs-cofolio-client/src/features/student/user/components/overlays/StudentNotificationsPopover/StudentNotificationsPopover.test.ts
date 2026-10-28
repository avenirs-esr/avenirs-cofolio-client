import type { VueWrapper } from '@vue/test-utils'
import type { NotificationDTO } from '@/api/avenir-esr'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'
import { mockedAssessmentSentNotification, mockedStudentNotification } from '@/__mocks__/fixtures/student/notifications.fixtures'
import { EUserCategory } from '@/api/avenir-esr'
import { NotificationsPopoverStub } from '@/common/notifications/components/NotificationsPopover/NotificationsPopover.stub'
import { ActivityModifiedNotificationCardStub } from '@/features/student/global/components/cards/ActivityModifiedNotificationCard/ActivityModifiedNotificationCard.stub'
import { AssessmentSentNotificationCardStub } from '@/features/student/global/components/cards/AssessmentSentNotificationCard/AssessmentSentNotificationCard.stub'
import StudentNotificationsPopover from '@/features/student/user/components/overlays/StudentNotificationsPopover/StudentNotificationsPopover.vue'

BddTest().given('a StudentNotificationsPopover', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentNotificationsPopover>>

  const stubs = {
    NotificationsPopover: NotificationsPopoverStub,
    ActivityModifiedNotificationCard: ActivityModifiedNotificationCardStub,
    AssessmentSentNotificationCard: AssessmentSentNotificationCardStub
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
  const getAssessmentSentNotificationCards = () => wrapper.findAllComponents(AssessmentSentNotificationCardStub)

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
      expect(getContextsHeader().text()).toBe('Vous recevrez une notification dans les cas suivants\u00A0:')
    })

    BddTest().then('it should render all context items', () => {
      const contexts = getContexts()
      expect(contexts.exists()).toBe(true)
      expect(contexts.element.children.length).toBe(2)
      expect(contexts.element.children[0].textContent).toBe('Une activité à laquelle vous êtes inscrit(e) a été modifiée')
      expect(contexts.element.children[1].textContent).toBe('Une appréciation a été envoyée pour l\'une de vos activités')
    })
  })

  BddTest().when('notification is ACTIVITY_MODIFIED', () => {
    beforeEach(() => mountDefault(mockedStudentNotification))

    BddTest().then('it should render ActivityModifiedNotificationCard with correct props', () => {
      const activityModifiedNotificationCards = getActivityModifiedNotificationCards()
      expect(activityModifiedNotificationCards.length).toBe(1)
      expect(activityModifiedNotificationCards[0].props('notification')).toEqual(mockedStudentNotification)
    })

    BddTest().then('it should not render AssessmentSentNotificationCard', () => {
      expect(getAssessmentSentNotificationCards().length).toBe(0)
    })
  })

  BddTest().when('notification is ASSESSMENT_SENT', () => {
    const notification = mockedAssessmentSentNotification()

    beforeEach(() => mountDefault(notification))

    BddTest().then('it should render AssessmentSentNotificationCard with correct props', () => {
      const assessmentSentNotificationCards = getAssessmentSentNotificationCards()
      expect(assessmentSentNotificationCards.length).toBe(1)
      expect(assessmentSentNotificationCards[0].props('notification')).toEqual(notification)
    })

    BddTest().then('it should not render ActivityModifiedNotificationCard', () => {
      expect(getActivityModifiedNotificationCards().length).toBe(0)
    })
  })
})
