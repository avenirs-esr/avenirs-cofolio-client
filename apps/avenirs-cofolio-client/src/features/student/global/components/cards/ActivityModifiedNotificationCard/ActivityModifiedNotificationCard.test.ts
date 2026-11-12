import type { NotificationDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ActivityModifiedParametersUpdatedFieldsItem } from '@avenirs-esr/shared/api/avenir-esr'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { beforeEach, expect, vi } from 'vitest'
import { mockedStudentNotification } from '@/__mocks__/fixtures/student/notifications.fixtures'
import { ROUTES } from '@/common/constants'
import { NotificationCardStub } from '@/common/notifications/components/NotificationCard/NotificationCard.stub'
import ActivityModifiedNotificationCard from '@/features/student/global/components/cards/ActivityModifiedNotificationCard/ActivityModifiedNotificationCard.vue'

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
        name: ROUTES.STUDENT.ACTIVITY.name,
        params: { id: mockedNotification.elementId },
      })
    })

    BddTest().then('it should render the sentence with interpolated parameters', () => {
      const content = getContent()

      expect(content.exists()).toBe(true)
      expect(content.text()).toBe(`L'activité "${mockedNotification.parameters!.activityTitle}" a été mise à jour. La section suivante a été modifiée\u00A0: Titre.`)
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
      expect(content.text()).toBe(`L'activité "${mockedNotification.parameters!.activityTitle}" a été mise à jour. Les sections suivantes ont été modifiées\u00A0: Titre, Thématique, Fichiers et liens.`)
    })
  })

  BddTest().when('notification parameters contains a single updated sub-activity', () => {
    beforeEach(() => {
      mountDefault({
        ...mockedNotification,
        parameters: {
          ...mockedNotification.parameters,
          updatedFields: [ActivityModifiedParametersUpdatedFieldsItem.SUB_ACTIVITIES],
          updatedSubActivityTitles: ['Sous-activité 1'],
        },
      })
    })

    BddTest().then('it should render the sentence with interpolated parameters', () => {
      const content = getContent()
      expect(content.exists()).toBe(true)
      expect(content.text()).toBe(`L'activité "${mockedNotification.parameters!.activityTitle}" a été mise à jour. La sous-activité "Sous-activité 1" a été modifiée.`)
    })
  })

  BddTest().when('notification parameters contains more than one updated sub-activity', () => {
    beforeEach(() => {
      mountDefault({
        ...mockedNotification,
        parameters: {
          ...mockedNotification.parameters,
          updatedFields: [ActivityModifiedParametersUpdatedFieldsItem.SUB_ACTIVITIES],
          updatedSubActivityTitles: ['Sous-activité 1', 'Sous-activité 2'],
        },
      })
    })

    BddTest().then('it should render the sentence with interpolated parameters', () => {
      const content = getContent()
      expect(content.exists()).toBe(true)
      expect(content.text()).toBe(`L'activité "${mockedNotification.parameters!.activityTitle}" a été mise à jour. Les sous-activités suivantes ont été modifiées\u00A0: Sous-activité 1, Sous-activité 2.`)
    })
  })

  BddTest().when('notification parameters contains sub-activity update without updated sub-activity titles', () => {
    beforeEach(() => {
      mountDefault({
        ...mockedNotification,
        parameters: {
          ...mockedNotification.parameters,
          updatedFields: [ActivityModifiedParametersUpdatedFieldsItem.SUB_ACTIVITIES],
          updatedSubActivityTitles: undefined,
        },
      })
    })

    BddTest().then('it should render the sentence with empty placeholders', () => {
      const content = getContent()
      expect(content.exists()).toBe(true)
      expect(content.text()).toBe(`L'activité "${mockedNotification.parameters!.activityTitle}" a été mise à jour. La sous-activité "" a été modifiée.`)
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
      expect(content.text()).toBe('L\'activité "" a été mise à jour. La section suivante a été modifiée\u00A0: .')
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
