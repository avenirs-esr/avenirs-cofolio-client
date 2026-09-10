import type { VueWrapper } from '@vue/test-utils'
import { mockedActivityDetail, mockedSubscribedActivityDetail, mockedUnsubscribedActivityDetail } from '@/__mocks__/fixtures/student/activities.fixtures'
import { ActivityCatalogHeaderStub } from '@/common/activities/components/ActivityCatalogHeader/ActivityCatalogHeader.stub'
import { ActivityCatalogPreviewCardStub } from '@/common/activities/components/ActivityCatalogPreviewCard/ActivityCatalogPreviewCard.stub'
import { ROUTES } from '@/common/constants'
import { SubscribeActivityConfirmModalStub } from '@/features/student/buildProject/components/modals/SubscribeActivityConfirmModal/SubscribeActivityConfirmModal.stub'
import { UnsubscribeActivitiesConfirmModalStub } from '@/features/student/buildProject/components/modals/UnsubscribeActivitiesConfirmModal/UnsubscribeActivitiesConfirmModal.stub'
import ActivityPreview, { type ActivityPreviewProps } from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/ActivityPreview/ActivityPreview.vue'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an activity preview', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityPreview>>

  const stubs = {
    AvButton: AvButtonStub,
    ActivityCatalogHeader: ActivityCatalogHeaderStub,
    ActivityCatalogPreviewCard: ActivityCatalogPreviewCardStub,
    UnsubscribeActivitiesConfirmModal: UnsubscribeActivitiesConfirmModalStub,
    SubscribeActivityConfirmModal: SubscribeActivityConfirmModalStub,
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

  function getActivityCatalogHeader () {
    return wrapper.findComponent(ActivityCatalogHeaderStub)
  }

  function getActivityCatalogPreviewCard () {
    return wrapper.findComponent(ActivityCatalogPreviewCardStub)
  }

  function getUnsubscribeActivitiesConfirmModal () {
    return wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
  }

  function getSubscribeActivityConfirmModal () {
    return wrapper.findComponent(SubscribeActivityConfirmModalStub)
  }

  BddTest().when('the component is mounted with an unsubscribed activity', () => {
    const props: ActivityPreviewProps = {
      activity: mockedActivityDetail
    }

    beforeEach(() => {
      wrapper = mountComponent(ActivityPreview, { props, global: { stubs } })
    })

    BddTest().then('it should render ActivityCatalogHeader with correct title and thematic', () => {
      const bannerStub = getActivityCatalogHeader()
      expect(bannerStub.exists()).toBe(true)
      expect(bannerStub.props('title')).toBe(mockedActivityDetail.title)
      expect(bannerStub.props('thematic')).toBe(mockedActivityDetail.thematic)
    })

    BddTest().then('it should pass banner to ActivityCatalogHeader', () => {
      const bannerStub = getActivityCatalogHeader()
      expect(bannerStub.props('banner')).toEqual(mockedActivityDetail.banner)
    })

    BddTest().then('it should not pass a declared activity status to ActivityCatalogHeader', () => {
      const bannerStub = wrapper.findComponent(ActivityCatalogHeaderStub)
      expect(bannerStub.props('declaredActivityStatus')).toBeUndefined()
    })

    BddTest().then('it should render ActivityCatalogPreviewCard with correct summary', () => {
      const cardStub = getActivityCatalogPreviewCard()
      expect(cardStub.exists()).toBe(true)
      expect(cardStub.props('summary')).toBe(mockedActivityDetail.summary)
    })

    BddTest().then('it should render ActivityCatalogPreviewCard with correct recommendedCompletionContexts', () => {
      expect(getActivityCatalogPreviewCard().props('recommendedCompletionContexts')).toBe(mockedActivityDetail.recommendedCompletionContexts)
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
      expect(getUnsubscribeActivitiesConfirmModal().exists()).toBe(true)
    })

    BddTest().then('it should render the subscribe modal', () => {
      const modal = getSubscribeActivityConfirmModal()
      expect(modal.exists()).toBe(true)
      expect(modal.props('opened')).toBe(false)
      expect(modal.props('activity')).toEqual({ id: mockedActivityDetail.id, title: mockedActivityDetail.title })
    })

    BddTest().and('the user clicks the subscribe button', () => {
      beforeEach(() => {
        getSubscribeButton()!.trigger('click')
      })

      BddTest().then('it should display the subscribe modal', () => {
        expect(getSubscribeActivityConfirmModal().props('opened')).toBe(true)
      })

      BddTest().and('the user cancels the subscribe action', () => {
        beforeEach(() => {
          getSubscribeActivityConfirmModal().vm.$emit('cancel')
        })

        BddTest().then('it should hide the subscribe modal', () => {
          expect(getSubscribeActivityConfirmModal().props('opened')).toBe(false)
        })
      })

      BddTest().and('the user confirms the subscribe action', () => {
        beforeEach(() => {
          getSubscribeActivityConfirmModal().vm.$emit('subscribed')
        })

        BddTest().then('it should hide the subscribe modal', () => {
          expect(getSubscribeActivityConfirmModal().props('opened')).toBe(false)
        })
      })
    })
  })

  BddTest().when('the component is mounted with a subscribed activity', () => {
    const props: ActivityPreviewProps = {
      activity: mockedSubscribedActivityDetail
    }

    beforeEach(() => {
      wrapper = mountComponent(ActivityPreview, { props, global: { stubs } })
    })

    BddTest().then('it should render ActivityCatalogHeader with correct title and thematic', () => {
      const bannerStub = getActivityCatalogHeader()
      expect(bannerStub.exists()).toBe(true)
      expect(bannerStub.props('title')).toBe(mockedSubscribedActivityDetail.title)
      expect(bannerStub.props('thematic')).toBe(mockedSubscribedActivityDetail.thematic)
    })

    BddTest().then('it should pass the declared activity status to ActivityCatalogHeader', () => {
      const bannerStub = wrapper.findComponent(ActivityCatalogHeaderStub)
      expect(bannerStub.props('declaredActivityStatus')).toBe(mockedSubscribedActivityDetail.subscribedDeclaredActivityStatus)
    })

    BddTest().then('it should render ActivityCatalogPreviewCard with correct summary', () => {
      expect(getActivityCatalogPreviewCard().props('summary')).toBe(mockedSubscribedActivityDetail.summary)
    })

    BddTest().then('it should render ActivityCatalogPreviewCard with correct recommendedCompletionContexts', () => {
      expect(getActivityCatalogPreviewCard().props('recommendedCompletionContexts')).toBe(mockedSubscribedActivityDetail.recommendedCompletionContexts)
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
      const modal = getUnsubscribeActivitiesConfirmModal()
      expect(modal.exists()).toBe(true)
      expect(modal.props('opened')).toBe(false)
      expect(modal.props('activities')).toEqual([{ id: mockedSubscribedActivityDetail.id, title: mockedSubscribedActivityDetail.title }])
    })

    BddTest().then('it should pass the declared activity id to the unsubscribe confirmation modal', () => {
      const modal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
      expect(modal.props('declaredActivityId')).toBe(mockedSubscribedActivityDetail.subscribedDeclaredActivity)
    })

    BddTest().then('it should render the subscribe modal', () => {
      expect(getSubscribeActivityConfirmModal().exists()).toBe(true)
    })

    BddTest().and('the user clicks the unsubscribe button', () => {
      beforeEach(() => {
        getUnsubscribeButton()!.trigger('click')
      })

      BddTest().then('it should display the confirmation modal', () => {
        expect(getUnsubscribeActivitiesConfirmModal().props('opened')).toBe(true)
      })

      BddTest().and('the user cancels the unsubscribe action', () => {
        beforeEach(() => {
          getUnsubscribeActivitiesConfirmModal().vm.$emit('cancel')
        })

        BddTest().then('it should hide the confirmation modal', () => {
          expect(getUnsubscribeActivitiesConfirmModal().props('opened')).toBe(false)
        })
      })

      BddTest().and('the user confirms the unsubscribe action', () => {
        beforeEach(() => {
          getUnsubscribeActivitiesConfirmModal().vm.$emit('unsubscribed')
        })

        BddTest().then('it should hide the confirmation modal', () => {
          expect(getUnsubscribeActivitiesConfirmModal().props('opened')).toBe(false)
        })
      })
    })
  })

  BddTest().when('the component is mounted with an activity the student has unsubscribed from', () => {
    const props: ActivityPreviewProps = {
      activity: mockedUnsubscribedActivityDetail
    }

    beforeEach(() => {
      wrapper = mountComponent(ActivityPreview, { props, global: { stubs } })
    })

    BddTest().then('it should pass the UNSUBSCRIBED declared activity status to ActivityCatalogHeader', () => {
      const bannerStub = wrapper.findComponent(ActivityCatalogHeaderStub)
      expect(bannerStub.props('declaredActivityStatus')).toBe(mockedUnsubscribedActivityDetail.subscribedDeclaredActivityStatus)
    })

    BddTest().then('it should render the access button', () => {
      const accessButton = getAccessButton()
      expect(accessButton).toBeDefined()
      expect(accessButton!.exists()).toBe(true)
      expect(accessButton!.props('to')).toEqual({
        name: ROUTES.STUDENT.PROJECT_ACTIVITIES_DETAILED.name,
        params: { id: mockedUnsubscribedActivityDetail.subscribedDeclaredActivity, thematic: mockedUnsubscribedActivityDetail.thematic }
      })
    })

    BddTest().then('it should not render the unsubscribe button', () => {
      expect(getUnsubscribeButton()).toBeUndefined()
    })

    BddTest().then('it should render the subscribe button with the resubscribe label', () => {
      const subscribeButton = getSubscribeButton()
      expect(subscribeButton).toBeDefined()
      expect(subscribeButton!.exists()).toBe(true)
      expect(subscribeButton!.text()).toBe('Me réinscrire')
    })
  })
})
