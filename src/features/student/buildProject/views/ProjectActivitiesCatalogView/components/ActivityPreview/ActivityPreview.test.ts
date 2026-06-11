import { mockedActivityDetail, mockedSubscribedActivityDetail } from '@/__mocks__/fixtures/student/activities.fixtures'
import { EDeclaredActivityStatus } from '@/api/avenir-esr'
import { ActivityThematicBadgeStub } from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.stub'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import { ActivityStatusBadgeStub } from '@/features/student/buildProject/components/badges/ActivityStatusBadge/ActivityStatusBadge.stub'
import { UnsubscribeActivitiesConfirmModalStub } from '@/features/student/buildProject/components/modals/UnsubscribeActivitiesConfirmModal/UnsubscribeActivitiesConfirmModal.stub'
import ActivityPreview, { type ActivityPreviewProps } from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/ActivityPreview/ActivityPreview.vue'
import { SubscribeActivityModalStub } from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/overlays/SubscribeActivityModal/SubscribeActivityModal.stub'
import { AvButtonStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { type DOMWrapper, mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'

const navigateToActivityDetailed = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToActivityDetailed,
    }),
  }
})

BddTest().given('an activity preview', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityPreview>>
  let bannerImage: DOMWrapper<Element>

  const stubs = {
    AvButton: AvButtonStub,
    Card: CardStub,
    AvIconText: AvIconTextStub,
    UnsubscribeActivitiesConfirmModal: UnsubscribeActivitiesConfirmModalStub,
    SubscribeActivityModal: SubscribeActivityModalStub,
    ActivityThematicBadge: ActivityThematicBadgeStub,
    ActivityStatusBadge: ActivityStatusBadgeStub
  }

  function getUnsubscribeButton () {
    return wrapper.findAllComponents(AvButtonStub).find(btn => btn.attributes('data-testid') === 'unsubscribe-button')
  }

  function getSubscribeButton () {
    return wrapper.findAllComponents(AvButtonStub).find(btn => btn.attributes('data-testid') === 'subscribe-button')
  }

  function getAccessButton () {
    return wrapper.findAllComponents(AvButtonStub).find(btn => btn.attributes('data-testid') === 'access-button')
  }

  afterEach(() => {
    navigateToActivityDetailed.mockClear()
  })

  BddTest().when('the component is mounted with an unsubscribed activity', () => {
    const props: ActivityPreviewProps = {
      activity: mockedActivityDetail
    }

    beforeEach(() => {
      wrapper = mount(ActivityPreview, { props, global: { stubs } })
    })

    BddTest().then('it should render the activity banner', () => {
      bannerImage = wrapper.find('[data-testid="activity-banner"]')
      expect(bannerImage.exists()).toBe(true)
      expect(bannerImage.attributes('src')).toBe(mockedSubscribedActivityDetail.banner!.url)
      expect(bannerImage.attributes('alt')).toBe(mockedSubscribedActivityDetail.banner!.fileName)
    })

    BddTest().then('it should render the activity title', () => {
      const title = wrapper.findComponent(AvIconTextStub)
      expect(title.exists()).toBe(true)
      expect(title.props('text')).toBe(mockedSubscribedActivityDetail.title)
    })

    BddTest().then('it should render the activity thematic badge', () => {
      const badge = wrapper.findComponent(ActivityThematicBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe(mockedSubscribedActivityDetail.thematic)
    })

    BddTest().then('it should render the activity summary', () => {
      const summary = wrapper.find('[data-testid="activity-summary"]')
      expect(summary.exists()).toBe(true)
      expect(summary.text()).toBe(mockedSubscribedActivityDetail.summary)
    })

    BddTest().then('it should render the execution period info', () => {
      const executionPeriodInfo = wrapper.find('[data-testid="activity-execution-period-info"]')
      expect(executionPeriodInfo.exists()).toBe(true)
      expect(executionPeriodInfo.text()).toBe(mockedSubscribedActivityDetail.executionPeriodInfo)
    })

    BddTest().then('it should not render the access button', () => {
      const accessButton = getAccessButton()
      expect(accessButton).toBeUndefined()
    })

    BddTest().then('it should not render the unsubscribe button', () => {
      const unsubscribeButton = getUnsubscribeButton()
      expect(unsubscribeButton).toBeUndefined()
    })

    BddTest().then('it should render the unsubscribe confirmation modal', () => {
      const modal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
      expect(modal.exists()).toBe(true)
    })

    BddTest().then('it should render the subscribe button', () => {
      const subscribeButton = getSubscribeButton()
      expect(subscribeButton).toBeDefined()
      expect(subscribeButton!.exists()).toBe(true)
      expect(subscribeButton!.text()).toBe('M\'inscrire à l\'activité')
    })

    BddTest().then('it should render the subscribe modal', () => {
      const modal = wrapper.findComponent(SubscribeActivityModalStub)
      expect(modal.exists()).toBe(true)
      expect(modal.props('show')).toBe(false)
      expect(modal.props('activity')).toEqual({ id: mockedSubscribedActivityDetail.id, title: mockedSubscribedActivityDetail.title })
    })

    BddTest().and('the user clicks the subscribe button', () => {
      beforeEach(() => {
        const subscribeButton = getSubscribeButton()
        subscribeButton!.trigger('click')
      })

      BddTest().then('it should display the subscribe modal', () => {
        const modal = wrapper.findComponent(SubscribeActivityModalStub)
        expect(modal.props('show')).toBe(true)
      })

      BddTest().and('the user cancels the subscribe action', () => {
        beforeEach(() => {
          const modal = wrapper.findComponent(SubscribeActivityModalStub)
          modal.vm.$emit('cancel')
        })

        BddTest().then('it should hide the subscribe modal', () => {
          const modal = wrapper.findComponent(SubscribeActivityModalStub)
          expect(modal.props('show')).toBe(false)
        })
      })

      BddTest().and('the user confirms the subscribe action', () => {
        beforeEach(() => {
          const modal = wrapper.findComponent(SubscribeActivityModalStub)
          modal.vm.$emit('subscribed')
        })

        BddTest().then('it should hide the subscribe modal', () => {
          const modal = wrapper.findComponent(SubscribeActivityModalStub)
          expect(modal.props('show')).toBe(false)
        })
      })
    })
  })

  BddTest().when('the component is mounted with a subscribed activity', () => {
    const props: ActivityPreviewProps = {
      activity: mockedSubscribedActivityDetail
    }

    beforeEach(() => {
      wrapper = mount(ActivityPreview, { props, global: { stubs } })
    })

    BddTest().then('it should render the activity banner', () => {
      bannerImage = wrapper.find('[data-testid="activity-banner"]')
      expect(bannerImage.exists()).toBe(true)
      expect(bannerImage.attributes('src')).toBe(mockedActivityDetail.banner!.url)
      expect(bannerImage.attributes('alt')).toBe(mockedActivityDetail.banner!.fileName)
    })

    BddTest().then('it should render the activity title', () => {
      const title = wrapper.findComponent(AvIconTextStub)
      expect(title.exists()).toBe(true)
      expect(title.props('text')).toBe(mockedActivityDetail.title)
    })

    BddTest().then('it should render the activity thematic badge', () => {
      const badge = wrapper.findComponent(ActivityThematicBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe(mockedActivityDetail.thematic)
    })

    BddTest().then('it should render the activity summary', () => {
      const summary = wrapper.find('[data-testid="activity-summary"]')
      expect(summary.exists()).toBe(true)
      expect(summary.text()).toBe(mockedActivityDetail.summary)
    })

    BddTest().then('it should render the execution period info', () => {
      const executionPeriodInfo = wrapper.find('[data-testid="activity-execution-period-info"]')
      expect(executionPeriodInfo.exists()).toBe(true)
      expect(executionPeriodInfo.text()).toBe(mockedActivityDetail.executionPeriodInfo)
    })

    BddTest().then('it should render the access button', () => {
      const accessButton = getAccessButton()
      expect(accessButton).toBeDefined()
      expect(accessButton!.exists()).toBe(true)
      expect(accessButton!.props('label')).toBe('Accéder à mon activité')
    })

    BddTest().and('the user clicks the access button', () => {
      beforeEach(() => {
        const accessButton = getAccessButton()
        accessButton!.trigger('click')
      })

      BddTest().then('it should call navigateToActivityDetailed with activity id and thematic', () => {
        expect(navigateToActivityDetailed).toHaveBeenCalledWith({
          id: mockedSubscribedActivityDetail.subscribedDeclaredActivity,
          thematic: mockedSubscribedActivityDetail.thematic,
        })
      })
    })

    BddTest().then('it should render the unsubscribe button', () => {
      const unsubscribeButton = getUnsubscribeButton()
      expect(unsubscribeButton).toBeDefined()
      expect(unsubscribeButton!.exists()).toBe(true)
      expect(unsubscribeButton!.text()).toBe('Me désinscrire')
    })

    BddTest().then('it should render the unsubscribe confirmation modal', () => {
      const modal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
      expect(modal.exists()).toBe(true)
      expect(modal.props('show')).toBe(false)
      expect(modal.props('activities')).toEqual([{ id: mockedActivityDetail.id, title: mockedActivityDetail.title }])
    })

    BddTest().then('it should not render the subscribe button', () => {
      const subscribeButton = getSubscribeButton()
      expect(subscribeButton).toBeUndefined()
    })

    BddTest().then('it should render the subscribe modal', () => {
      const modal = wrapper.findComponent(SubscribeActivityModalStub)
      expect(modal.exists()).toBe(true)
    })

    BddTest().and('the user clicks the unsubscribe button', () => {
      beforeEach(() => {
        const unsubscribeButton = getUnsubscribeButton()
        unsubscribeButton!.trigger('click')
      })

      BddTest().then('it should display the confirmation modal', () => {
        const modal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
        expect(modal.props('show')).toBe(true)
      })

      BddTest().and('the user cancels the unsubscribe action', () => {
        beforeEach(() => {
          const modal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
          modal.vm.$emit('cancel')
        })

        BddTest().then('it should hide the confirmation modal', () => {
          const modal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
          expect(modal.props('show')).toBe(false)
        })
      })

      BddTest().and('the user confirms the unsubscribe action', () => {
        beforeEach(() => {
          const modal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
          modal.vm.$emit('unsubscribed')
        })

        BddTest().then('it should hide the confirmation modal', () => {
          const modal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
          expect(modal.props('show')).toBe(false)
        })
      })
    })

    BddTest().then('it should render the subscribed badge', () => {
      const badge = wrapper.findComponent(ActivityStatusBadgeStub)
      expect(badge).toBeDefined()
      expect(badge!.exists()).toBe(true)
      expect(badge!.props('status')).toBe(EDeclaredActivityStatus.SUBSCRIBED)
    })
  })
})
