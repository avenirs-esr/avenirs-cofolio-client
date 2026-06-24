import type { NotificationDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { mockedStaffNotification } from '@/__mocks__/fixtures/staffs/notifications.fixtures'
import { ROUTES } from '@/common/constants'
import { NotificationCardStub } from '@/common/notifications/components/NotificationCard/NotificationCard.stub'
import ActivityFeedbackNotificationCard from '@/features/staff/global/components/cards/ActivityFeedbackNotificationCard/ActivityFeedbackNotificationCard.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const onRedirectMock = vi.fn()
const onSeenMock = vi.fn()

BddTest().given('an ActivityFeedbackNotificationCard', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityFeedbackNotificationCard>>

  const stubs = {
    NotificationCard: NotificationCardStub,
  }

  const mockedNotification: NotificationDTO = {
    ...mockedStaffNotification,
    elementId: crypto.randomUUID(),
    parameters: ['John Doe', 'Math Exam'],
  }

  const getContent = () =>
    wrapper.find('[data-testid="activity-feedback-notification-card-content"]')

  const getNotificationCard = () =>
    wrapper.findComponent(NotificationCardStub)

  const mountDefault = (notification: NotificationDTO = mockedNotification) => {
    vi.clearAllMocks()

    wrapper = mountComponent(ActivityFeedbackNotificationCard, {
      props: {
        notification,
        onRedirect: onRedirectMock,
        onSeen: onSeenMock,
      },
      global: { stubs },
    })
  }

  BddTest().when('the component is rendered', () => {
    beforeEach(() => mountDefault())

    BddTest().then('it should render NotificationCard with correct props', () => {
      const card = getNotificationCard()

      expect(card.exists()).toBe(true)
      expect(card.props('id')).toBe(mockedNotification.id)
      expect(card.props('seen')).toBe(mockedNotification.seen)
      expect(card.props('createdAt')).toBe(mockedNotification.createdAt)
      expect(card.props('to')).toEqual({
        name: ROUTES.STAFF.ACTIVITY_FEEDBACK_DETAILS.name,
        params: { feedbackId: mockedNotification.elementId },
      })
    })

    BddTest().then('it should render the translated sentence with interpolated parameters', () => {
      const content = getContent()
      const [studentName, activityName] = mockedNotification.parameters!

      expect(content.exists()).toBe(true)
      expect(content.text()).toBe(`Vous avez reçus une nouvelle demande de feedback de ${studentName} sur l'activité ${activityName}.`)
    })
  })

  BddTest().when('NotificationCard emits redirect', () => {
    beforeEach(() => {
      mountDefault()
      getNotificationCard().vm.$emit('redirect')
    })

    BddTest().then('it should call onRedirect', () => {
      expect(onRedirectMock).toHaveBeenCalled()
    })
  })

  BddTest().when('NotificationCard emits seen with an id', () => {
    beforeEach(() => {
      mountDefault()
      getNotificationCard().vm.$emit('seen', mockedNotification.id)
    })

    BddTest().then('it should call onSeen with correct id', () => {
      expect(onSeenMock).toHaveBeenCalledWith(mockedNotification.id)
    })
  })

  BddTest().when('notification parameters are missing', () => {
    beforeEach(() => {
      mountDefault({
        ...mockedNotification,
        parameters: undefined,
      })
    })

    BddTest().then('it should render the sentence with empty placeholders', () => {
      const content = getContent()
      expect(content.exists()).toBe(true)
      expect(content.text()).toBe('Vous avez reçus une nouvelle demande de feedback de  sur l\'activité .')
    })
  })
})
