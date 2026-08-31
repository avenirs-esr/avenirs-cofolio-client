import type { VueWrapper } from '@vue/test-utils'
import { mockedActivityContent } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { getPublishedActivityContentErrorHandler } from '@/__mocks__/msw/handlers/staffs/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { ROUTES } from '@/common/constants'
import { ActivityConsignCardStub } from '@/features/feedbacks/components/cards/ActivityConsignCard/ActivityConsignCard.stub'
import { FeedbacksDashboardSectionStub } from '@/features/feedbacks/views/ActivityFeedbackDetailsView/components/FeedbacksDashboardSection/FeedbacksDashboardSection.stub'
import ActivityFeedbacksView from '@/features/feedbacks/views/ActivityFeedbacksView/ActivityFeedbacksView.vue'
import { ActivityFeedbacksCardStub } from '@/features/feedbacks/views/ActivityFeedbacksView/components/ActivityFeedbacksCard/ActivityFeedbacksCard.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an ActivityFeedbacksView component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityFeedbacksView>>

  const stubs = {
    PageTitle: PageTitleStub,
    QuerySuspense: QuerySuspenseStub,
    ActivityFeedbacksCard: ActivityFeedbacksCardStub,
    FeedbacksDashboardSection: FeedbacksDashboardSectionStub,
    ActivityConsignCard: ActivityConsignCardStub
  }

  const mountView = () => mountComponent(ActivityFeedbacksView, {
    props: { activityId: mockedActivityContent.id },
    global: { stubs },
  })

  const waitForLoaded = async () => {
    await vi.waitFor(() => {
      expect(wrapper.findComponent(QuerySuspenseStub).props('isLoading')).toBe(false)
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mountView()
  })

  BddTest().when('the view is mounted', () => {
    BddTest().then('it should render PageTitle', () => {
      expect(wrapper.findComponent(PageTitleStub).exists()).toBe(true)
    })

    BddTest().then('it should render FeedbacksDashboardSection', () => {
      expect(wrapper.findComponent(FeedbacksDashboardSectionStub).exists()).toBe(true)
    })

    BddTest().then('it should pass the correct errorTitle to QuerySuspense', () => {
      expect(wrapper.findComponent(QuerySuspenseStub).props('errorTitle')).toBe('Impossible de charger l\'activité')
    })
  })

  BddTest().when('the activity is loaded', () => {
    beforeEach(waitForLoaded)

    BddTest().then('it should render PageTitle with correct breadcrumbs', () => {
      expect(wrapper.findComponent(PageTitleStub).props('breadcrumbLinks')).toEqual([
        { text: 'Accueil', to: ROUTES.STAFF.HOME },
        { text: 'Bibliothèque des activités', to: ROUTES.STAFF.ACTIVITIES },
        { text: mockedActivityContent.title },
        { text: 'Toutes mes demandes de feedback' }
      ])
    })

    BddTest().then('it should render PageTitle with the correct title', () => {
      expect(wrapper.findComponent(PageTitleStub).props('title')).toBe(`Toutes mes demandes de feedback sur l'activité "${mockedActivityContent.title}"`)
    })

    BddTest().then('it should render ActivityFeedbacksCard', () => {
      expect(wrapper.findComponent(ActivityFeedbacksCardStub).exists()).toBe(true)
    })

    BddTest().then('it should render ActivityConsignCard', () => {
      expect(wrapper.findComponent(ActivityConsignCardStub).exists()).toBe(true)
    })

    BddTest().then('it should pass the description to ActivityConsignCard', () => {
      expect(wrapper.findComponent(ActivityConsignCardStub).props('description')).toBe(mockedActivityContent.description)
    })

    BddTest().then('it should pass the activity to ActivityFeedbacksCard', () => {
      expect(wrapper.findComponent(ActivityFeedbacksCardStub).props('activity')).toEqual(mockedActivityContent)
    })
  })

  BddTest().when('the API returns an error', () => {
    beforeEach(() => {
      server.use(getPublishedActivityContentErrorHandler)
      wrapper = mountView()
    })

    BddTest().then('it should pass the error to QuerySuspense', async () => {
      await vi.waitFor(() => {
        expect(wrapper.findComponent(QuerySuspenseStub).props('error')).toBeTruthy()
      })
    })
  })
})
