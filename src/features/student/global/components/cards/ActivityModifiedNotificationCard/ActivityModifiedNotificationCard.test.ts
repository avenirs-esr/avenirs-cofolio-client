import type { NotificationDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { mockedStudentNotification } from '@/__mocks__/fixtures/student/notifications.fixtures'
import { ActivityModifiedParametersUpdatedFieldsItem } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { NotificationCardStub } from '@/common/notifications/components/NotificationCard/NotificationCard.stub'
import ActivityModifiedNotificationCard from '@/features/student/global/components/cards/ActivityModifiedNotificationCard/ActivityModifiedNotificationCard.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const onRedirectMock = vi.fn()
const onSeenMock = vi.fn()

BddTest().given('an ActivityModifiedNotificationCard', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityModifiedNotificationCard>>

  const stubs = {
    NotificationCard: NotificationCardStub,
  }

  const mockedNotification: NotificationDTO = {
    ...mockedStudentNotification,
    elementId: crypto.randomUUID(),
    parameters: {
      activityTitle: 'Math Exam',
      updatedFields: [ActivityModifiedParametersUpdatedFieldsItem.ACTIVITY_TITLE],
    },
  }

  const getContent = () => wrapper.find('[data-testid="activity-modified-notification-card-content"]')
  const getNotificationCard = () => wrapper.findComponent(NotificationCardStub)

  const mountDefault = (notification: NotificationDTO = mockedNotification) => {
    vi.clearAllMocks()

    wrapper = mountComponent(ActivityModifiedNotificationCard, {
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
        name: ROUTES.STUDENT.PROJECT_ACTIVITIES_DETAILED.name,
        params: { id: mockedNotification.elementId },
      })
    })

    BddTest().then('it should render the sentence with interpolated parameters', () => {
      const content = getContent()

      expect(content.exists()).toBe(true)
      expect(content.text()).toBe(`L'activité "${mockedNotification.parameters!.activityTitle}" a été mise à jour. La section suivante a été modifiée : Titre.`)
    })
  })

  BddTest().when('notification parameters contains more than one updated field', () => {
    beforeEach(() => {
      mountDefault({
        ...mockedNotification,
        parameters: {
          ...mockedNotification.parameters,
          updatedFields: [
            ActivityModifiedParametersUpdatedFieldsItem.ACTIVITY_TITLE,
            ActivityModifiedParametersUpdatedFieldsItem.THEMATIC,
            ActivityModifiedParametersUpdatedFieldsItem.FILES_AND_LINKS,
          ],
        },
      })
    })

    BddTest().then('it should render the sentence with interpolated parameters', () => {
      const content = getContent()
      expect(content.exists()).toBe(true)
      expect(content.text()).toBe(`L'activité "${mockedNotification.parameters!.activityTitle}" a été mise à jour. Les sections suivantes ont été modifiées : Titre, Thématique, Fichiers et liens.`)
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
      expect(content.text()).toBe('L\'activité "" a été mise à jour. La section suivante a été modifiée : .')
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
