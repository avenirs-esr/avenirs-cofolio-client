import type { VueWrapper } from '@vue/test-utils'
import { mockedActivityContent } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { getPublishedActivityContentErrorHandler } from '@/__mocks__/msw/handlers/staffs/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { ROUTES } from '@/common/constants'
import ActivityFeedbacksView from '@/features/staff/activities/views/ActivityFeedbacksView/ActivityFeedbacksView.vue'
import { ActivityFeedbacksDashboardStub } from '@/features/staff/activities/views/ActivityFeedbacksView/components/ActivityFeedbacksDashboard/ActivityFeedbacksDashboard.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an activity feedbacks view', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityFeedbacksView>>

  const stubs = {
    PageTitle: PageTitleStub,
    QuerySuspense: QuerySuspenseStub,
    ActivityFeedbacksDashboard: ActivityFeedbacksDashboardStub,
  }

  const mountView = (id = mockedActivityContent.id) => mountComponent(ActivityFeedbacksView, {
    props: { id },
    global: { stubs },
  })

  const waitForLoaded = async () => {
    await vi.waitFor(() => {
      expect(wrapper.findComponent(QuerySuspenseStub).props('isLoading')).toBe(false)
    })
  }

  beforeEach(() => {
    wrapper = mountView()
  })

  BddTest().when('the view is mounted', () => {
    let pageTitle: VueWrapper<InstanceType<typeof PageTitleStub>>

    beforeEach(() => {
      pageTitle = wrapper.findComponent(PageTitleStub)
    })

    BddTest().then('it should render PageTitle with the correct error title in QuerySuspense', () => {
      expect(wrapper.findComponent(QuerySuspenseStub).props('errorTitle')).toBe('Impossible de charger l\'activité')
    })

    BddTest().then('it should render PageTitle with the correct breadcrumb links', () => {
      expect(pageTitle.props('breadcrumbLinks')).toEqual([
        { text: 'Accueil', to: ROUTES.STAFF.HOME },
        { text: 'Bibliothèque des activités', to: ROUTES.STAFF.ACTIVITIES },
        { text: '' },
      ])
    })
  })

  BddTest().when('the activity is loaded', () => {
    beforeEach(waitForLoaded)

    BddTest().then('it should render PageTitle with the correct title', () => {
      expect(wrapper.findComponent(PageTitleStub).props('title')).toBe(`Toutes mes demandes de feedback sur l'activité "${mockedActivityContent.title}"`)
    })

    BddTest().then('it should render PageTitle with the correct breadcrumb including activity title', () => {
      expect(wrapper.findComponent(PageTitleStub).props('breadcrumbLinks')).toEqual([
        { text: 'Accueil', to: ROUTES.STAFF.HOME },
        { text: 'Bibliothèque des activités', to: ROUTES.STAFF.ACTIVITIES },
        { text: mockedActivityContent.title },
      ])
    })

    BddTest().then('it should render ActivityFeedbacksDashboard', () => {
      expect(wrapper.findComponent(ActivityFeedbacksDashboardStub).exists()).toBe(true)
    })
  })

  BddTest().when('the API returns an error', () => {
    beforeEach(() => {
      server.use(getPublishedActivityContentErrorHandler)
      wrapper = mountView()
    })

    BddTest().then('it should render QuerySuspense with an error', async () => {
      await vi.waitFor(() => {
        expect(wrapper.findComponent(QuerySuspenseStub).props('error')).toBeTruthy()
      })
    })
  })
})
