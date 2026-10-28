import type { VueWrapper } from '@vue/test-utils'
import type { NotificationDTO } from '@/api/avenir-esr'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { mockedAssessmentSentNotification } from '@/__mocks__/fixtures/student/notifications.fixtures'
import { ROUTES } from '@/common/constants'
import { NotificationCardStub } from '@/common/notifications/components/NotificationCard/NotificationCard.stub'
import AssessmentSentNotificationCard from '@/features/student/global/components/cards/AssessmentSentNotificationCard/AssessmentSentNotificationCard.vue'

const onRedirectMock = vi.fn()
const onSeenMock = vi.fn()

BddTest().given('an AssessmentSentNotificationCard', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssessmentSentNotificationCard>>

  const stubs = {
    NotificationCard: NotificationCardStub,
  }

  const mockedNotification: NotificationDTO = {
    ...mockedAssessmentSentNotification(),
    parameters: {
      activityTitle: 'Math Exam',
    },
  }

  const getContent = () => wrapper.find('[data-testid="assessment-sent-notification-card-content"]')
  const getNotificationCard = () => wrapper.findComponent(NotificationCardStub)

  const mountDefault = (notification: NotificationDTO = mockedNotification) => {
    vi.clearAllMocks()

    wrapper = mountComponent(AssessmentSentNotificationCard, {
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
        name: ROUTES.STUDENT.ACTIVITY.name,
        params: { id: mockedNotification.elementId },
      })
    })

    BddTest().then('it should render the sentence with the activity title', () => {
      const content = getContent()

      expect(content.exists()).toBe(true)
      expect(content.text()).toBe('Une appréciation a été envoyée pour l\'activité "Math Exam".')
    })
  })

  BddTest().when('notification has no elementId', () => {
    beforeEach(() => {
      mountDefault({
        ...mockedNotification,
        elementId: undefined,
      })
    })

    BddTest().then('it should not provide a redirection target', () => {
      expect(getNotificationCard().props('to')).toBeUndefined()
    })
  })

  BddTest().when('notification parameters are missing', () => {
    beforeEach(() => {
      mountDefault({
        ...mockedNotification,
        parameters: undefined,
      })
    })

    BddTest().then('it should render the sentence with an empty placeholder', () => {
      const content = getContent()
      expect(content.exists()).toBe(true)
      expect(content.text()).toBe('Une appréciation a été envoyée pour l\'activité "".')
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
})
