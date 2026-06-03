import type { VueWrapper } from '@vue/test-utils'
import { mockedActivityContent } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { getActivityContentErrorHandler } from '@/__mocks__/msw/handlers/staffs/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { EActivityStatus } from '@/api/avenir-esr'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { ROUTES } from '@/common/constants'
import { NationalActivityContentTabStub } from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivityContentTab/NationalActivityContentTab.stub'
import NationalActivityCatalogView from '@/features/staff/activities/views/NationalActivityCatalogView/NationalActivityCatalogView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a national activity catalog view', () => {
  let wrapper: VueWrapper<InstanceType<typeof NationalActivityCatalogView>>

  const stubs = {
    PageTitle: PageTitleStub,
    QuerySuspense: QuerySuspenseStub,
    NationalActivityContentTab: NationalActivityContentTabStub,
  }

  const mountView = () => mountComponent(NationalActivityCatalogView, {
    props: {
      status: EActivityStatus.DRAFT,
      id: mockedActivityContent.id,
    },
    global: { stubs },
  })

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mountView()
  })

  BddTest().when('the view is mounted', () => {
    let pageTitle: VueWrapper<InstanceType<typeof PageTitleStub>>

    beforeEach(() => {
      pageTitle = wrapper.findComponent(PageTitleStub)
    })

    BddTest().then('it should render PageTitle with the correct title', () => {
      expect(pageTitle.props('title')).toBe('Toutes les activités disponibles dans mon établissement')
    })

    BddTest().then('it should render PageTitle with the correct breadcrumb links', () => {
      expect(pageTitle.props('breadcrumbLinks')).toEqual([
        { text: 'Accueil', to: ROUTES.STAFF.HOME },
        { text: 'Bibliothèque des activités', to: ROUTES.STAFF.ACTIVITIES },
        { text: 'Toutes les activités disponibles dans mon établissement' },
      ])
    })

    BddTest().then('it should render QuerySuspense with the correct error title', () => {
      expect(wrapper.findComponent(QuerySuspenseStub).props('errorTitle')).toBe('Impossible de charger l\'activité')
    })
  })

  BddTest().when('the activity is loaded', () => {
    beforeEach(async () => {
      await vi.waitFor(() => {
        expect(wrapper.findComponent(QuerySuspenseStub).props('isLoading')).toBe(false)
      })
    })

    BddTest().then('it should render NationalActivityContentTab with the correct activity', () => {
      expect(wrapper.findComponent(NationalActivityContentTabStub).props('activity')).toEqual(mockedActivityContent)
    })
  })

  BddTest().when('the API returns an error', () => {
    beforeEach(() => {
      server.use(getActivityContentErrorHandler)
      wrapper = mountView()
    })

    BddTest().then('it should render QuerySuspense with an error', async () => {
      await vi.waitFor(() => {
        expect(wrapper.findComponent(QuerySuspenseStub).props('error')).toBeTruthy()
      })
    })
  })
})
