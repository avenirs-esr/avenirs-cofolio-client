import { mockedActivityDetail, mockedSubscribedActivityDetail } from '@/__mocks__/fixtures/student/activities.fixtures'
import { ActivityCatalogBannerStub } from '@/common/activities/components/ActivityCatalogBanner/ActivityCatalogBanner.stub'
import { ActivityCatalogPreviewCardStub } from '@/common/activities/components/ActivityCatalogPreviewCard/ActivityCatalogPreviewCard.stub'
import { ROUTES } from '@/common/constants'
import { UnsubscribeActivitiesConfirmModalStub } from '@/features/student/buildProject/components/modals/UnsubscribeActivitiesConfirmModal/UnsubscribeActivitiesConfirmModal.stub'
import ActivityPreview, { type ActivityPreviewProps } from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/ActivityPreview/ActivityPreview.vue'
import { SubscribeActivityModalStub } from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/overlays/SubscribeActivityModal/SubscribeActivityModal.stub'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an activity preview', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityPreview>>

  const stubs = {
    AvButton: AvButtonStub,
    ActivityCatalogBanner: ActivityCatalogBannerStub,
    ActivityCatalogPreviewCard: ActivityCatalogPreviewCardStub,
    UnsubscribeActivitiesConfirmModal: UnsubscribeActivitiesConfirmModalStub,
    SubscribeActivityModal: SubscribeActivityModalStub,
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

  BddTest().when('the component is mounted with an unsubscribed activity', () => {
    const props: ActivityPreviewProps = {
      activity: mockedActivityDetail
    }

    beforeEach(() => {
      wrapper = mount(ActivityPreview, { props, global: { stubs } })
    })

    BddTest().then('it should render ActivityCatalogBanner with correct title and thematic', () => {
      const bannerStub = wrapper.findComponent(ActivityCatalogBannerStub)
      expect(bannerStub.exists()).toBe(true)
      expect(bannerStub.props('title')).toBe(mockedActivityDetail.title)
      expect(bannerStub.props('thematic')).toBe(mockedActivityDetail.thematic)
    })

    BddTest().then('it should pass banner to ActivityCatalogBanner', () => {
      const bannerStub = wrapper.findComponent(ActivityCatalogBannerStub)
      expect(bannerStub.props('banner')).toEqual(mockedActivityDetail.banner)
    })

    BddTest().then('it should not pass subscribedDeclaredActivity to ActivityCatalogBanner', () => {
      const bannerStub = wrapper.findComponent(ActivityCatalogBannerStub)
      expect(bannerStub.props('subscribedDeclaredActivity')).toBeUndefined()
    })

    BddTest().then('it should render ActivityCatalogPreviewCard with correct summary', () => {
      const cardStub = wrapper.findComponent(ActivityCatalogPreviewCardStub)
      expect(cardStub.exists()).toBe(true)
      expect(cardStub.props('summary')).toBe(mockedActivityDetail.summary)
    })

    BddTest().then('it should render ActivityCatalogPreviewCard with correct executionPeriodInfo', () => {
      expect(wrapper.findComponent(ActivityCatalogPreviewCardStub).props('executionPeriodInfo')).toBe(mockedActivityDetail.executionPeriodInfo)
    })

    BddTest().then('it should not render the access button', () => {
      expect(getAccessButton()).toBeUndefined()
    })

    BddTest().then('it should not render the unsubscribe button', () => {
      expect(getUnsubscribeButton()).toBeUndefined()
    })

    BddTest().then('it should render the subscribe button', () => {
      const subscribeButton = getSubscribeButton()
      expect(subscribeButton).toBeDefined()
      expect(subscribeButton!.exists()).toBe(true)
      expect(subscribeButton!.text()).toBe('M\'inscrire à l\'activité')
    })

    BddTest().then('it should render the unsubscribe confirmation modal', () => {
      expect(wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub).exists()).toBe(true)
    })

    BddTest().then('it should render the subscribe modal', () => {
      const modal = wrapper.findComponent(SubscribeActivityModalStub)
      expect(modal.exists()).toBe(true)
      expect(modal.props('show')).toBe(false)
      expect(modal.props('activity')).toEqual({ id: mockedActivityDetail.id, title: mockedActivityDetail.title })
    })

    BddTest().and('the user clicks the subscribe button', () => {
      beforeEach(() => {
        getSubscribeButton()!.trigger('click')
      })

      BddTest().then('it should display the subscribe modal', () => {
        expect(wrapper.findComponent(SubscribeActivityModalStub).props('show')).toBe(true)
      })

      BddTest().and('the user cancels the subscribe action', () => {
        beforeEach(() => {
          wrapper.findComponent(SubscribeActivityModalStub).vm.$emit('cancel')
        })

        BddTest().then('it should hide the subscribe modal', () => {
          expect(wrapper.findComponent(SubscribeActivityModalStub).props('show')).toBe(false)
        })
      })

      BddTest().and('the user confirms the subscribe action', () => {
        beforeEach(() => {
          wrapper.findComponent(SubscribeActivityModalStub).vm.$emit('subscribed')
        })

        BddTest().then('it should hide the subscribe modal', () => {
          expect(wrapper.findComponent(SubscribeActivityModalStub).props('show')).toBe(false)
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

    BddTest().then('it should render ActivityCatalogBanner with correct title and thematic', () => {
      const bannerStub = wrapper.findComponent(ActivityCatalogBannerStub)
      expect(bannerStub.exists()).toBe(true)
      expect(bannerStub.props('title')).toBe(mockedSubscribedActivityDetail.title)
      expect(bannerStub.props('thematic')).toBe(mockedSubscribedActivityDetail.thematic)
    })

    BddTest().then('it should pass subscribedDeclaredActivity to ActivityCatalogBanner', () => {
      const bannerStub = wrapper.findComponent(ActivityCatalogBannerStub)
      expect(bannerStub.props('subscribedDeclaredActivity')).toBe(mockedSubscribedActivityDetail.subscribedDeclaredActivity)
    })

    BddTest().then('it should render ActivityCatalogPreviewCard with correct summary', () => {
      expect(wrapper.findComponent(ActivityCatalogPreviewCardStub).props('summary')).toBe(mockedSubscribedActivityDetail.summary)
    })

    BddTest().then('it should render ActivityCatalogPreviewCard with correct executionPeriodInfo', () => {
      expect(wrapper.findComponent(ActivityCatalogPreviewCardStub).props('executionPeriodInfo')).toBe(mockedSubscribedActivityDetail.executionPeriodInfo)
    })

    BddTest().then('it should render the access button', () => {
      const accessButton = getAccessButton()
      expect(accessButton).toBeDefined()
      expect(accessButton!.exists()).toBe(true)
      expect(accessButton!.props('label')).toBe('Accéder à mon activité')
      expect(accessButton!.props('to')).toEqual({
        name: ROUTES.STUDENT.PROJECT_ACTIVITIES_DETAILED.name,
        params: { id: mockedSubscribedActivityDetail.subscribedDeclaredActivity, thematic: mockedSubscribedActivityDetail.thematic }
      })
    })

    BddTest().then('it should render the unsubscribe button', () => {
      const unsubscribeButton = getUnsubscribeButton()
      expect(unsubscribeButton).toBeDefined()
      expect(unsubscribeButton!.exists()).toBe(true)
      expect(unsubscribeButton!.text()).toBe('Me désinscrire')
    })

    BddTest().then('it should not render the subscribe button', () => {
      expect(getSubscribeButton()).toBeUndefined()
    })

    BddTest().then('it should render the unsubscribe confirmation modal', () => {
      const modal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
      expect(modal.exists()).toBe(true)
      expect(modal.props('show')).toBe(false)
      expect(modal.props('activities')).toEqual([{ id: mockedSubscribedActivityDetail.id, title: mockedSubscribedActivityDetail.title }])
    })

    BddTest().then('it should render the subscribe modal', () => {
      expect(wrapper.findComponent(SubscribeActivityModalStub).exists()).toBe(true)
    })

    BddTest().and('the user clicks the unsubscribe button', () => {
      beforeEach(() => {
        getUnsubscribeButton()!.trigger('click')
      })

      BddTest().then('it should display the confirmation modal', () => {
        expect(wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub).props('show')).toBe(true)
      })

      BddTest().and('the user cancels the unsubscribe action', () => {
        beforeEach(() => {
          wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub).vm.$emit('cancel')
        })

        BddTest().then('it should hide the confirmation modal', () => {
          expect(wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub).props('show')).toBe(false)
        })
      })

      BddTest().and('the user confirms the unsubscribe action', () => {
        beforeEach(() => {
          wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub).vm.$emit('unsubscribed')
        })

        BddTest().then('it should hide the confirmation modal', () => {
          expect(wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub).props('show')).toBe(false)
        })
      })
    })
  })
})
