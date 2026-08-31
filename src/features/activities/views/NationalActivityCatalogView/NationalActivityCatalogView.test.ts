import type { VueWrapper } from '@vue/test-utils'
import { mockedActivityContent, mockedActivityDraftCreationResponse } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { getActivityContentErrorHandler } from '@/__mocks__/msw/handlers/staffs/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { EActivityStatus } from '@/api/avenir-esr'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { ROUTES } from '@/common/constants'
import {
  DeleteDraftActivityConfirmationModalStub
} from '@/features/activities/components/modals/DeleteDraftActivityConfirmationModal/DeleteDraftActivityConfirmationModal.stub'
import {
  NationalActivityCatalogPreviewTabStub
} from '@/features/activities/views/NationalActivityCatalogView/components/NationalActivityCatalogPreviewTab/NationalActivityCatalogPreviewTab.stub'
import {
  NationalActivityContentTabStub
} from '@/features/activities/views/NationalActivityCatalogView/components/NationalActivityContentTab/NationalActivityContentTab.stub'
import NationalActivityCatalogView from '@/features/activities/views/NationalActivityCatalogView/NationalActivityCatalogView.vue'
import { AvButtonStub, AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockNavigateToStaffActivities = vi.fn()
const mockNavigateToStaffActivitiesEditNationalActivity = vi.fn()

vi.mock('@/common/composables/use-enum-route-query/use-enum-route-query', () => ({
  useEnumRouteQuery: vi.fn(() => ref(0)),
}))

vi.mock('@/common/composables/use-navigation/use-navigation', () => ({
  useNavigation: () => ({
    navigateToStaffActivities: mockNavigateToStaffActivities,
    navigateToStaffActivitiesEditNationalActivity: mockNavigateToStaffActivitiesEditNationalActivity,
  }),
}))

BddTest().given('a national activity catalog view', () => {
  let wrapper: VueWrapper<InstanceType<typeof NationalActivityCatalogView>>

  const stubs = {
    PageTitle: PageTitleStub,
    QuerySuspense: QuerySuspenseStub,
    NationalActivityCatalogPreviewTab: NationalActivityCatalogPreviewTabStub,
    NationalActivityContentTab: NationalActivityContentTabStub,
    AvButton: AvButtonStub,
    DeleteDraftActivityConfirmationModal: DeleteDraftActivityConfirmationModalStub,
    AvTabs: AvTabsStub,
    AvTab: AvTabStub,
  }

  const mountView = (status = EActivityStatus.DRAFT, id = mockedActivityContent.id) =>
    mountComponent(NationalActivityCatalogView, {
      props: { status, id },
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
    beforeEach(waitForLoaded)

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

  BddTest().when('the status is DRAFT and the activity is loaded', () => {
    beforeEach(async () => {
      wrapper = mountView(EActivityStatus.DRAFT)
      await waitForLoaded()
    })

    BddTest().then('it should render the edit and delete buttons', () => {
      expect(wrapper.find('[data-testid="edit-draft-button"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="delete-draft-button"]').exists()).toBe(true)
    })

    BddTest().and('the edit button is clicked', () => {
      beforeEach(async () => {
        await wrapper.find('[data-testid="edit-draft-button"]').trigger('click')
      })

      BddTest().then('it should navigate directly to the edit view', () => {
        expect(mockNavigateToStaffActivitiesEditNationalActivity).toHaveBeenCalledWith({ id: mockedActivityContent.id })
      })
    })

    BddTest().and('the delete button is clicked', () => {
      beforeEach(async () => {
        await wrapper.find('[data-testid="delete-draft-button"]').trigger('click')
      })

      BddTest().then('it should open the confirmation modal', () => {
        expect(wrapper.findComponent(DeleteDraftActivityConfirmationModalStub).props('show')).toBe(true)
      })

      BddTest().and('the confirmation modal is cancelled', () => {
        beforeEach(() => {
          wrapper.findComponent(DeleteDraftActivityConfirmationModalStub).vm.$emit('close')
        })

        BddTest().then('it should close the confirmation modal', () => {
          expect(wrapper.findComponent(DeleteDraftActivityConfirmationModalStub).props('show')).toBe(false)
        })
      })

      BddTest().and('the modal emits deleted', () => {
        beforeEach(() => {
          wrapper.findComponent(DeleteDraftActivityConfirmationModalStub).vm.$emit('deleted')
        })

        BddTest().then('it should navigate to the activities page', () => {
          expect(mockNavigateToStaffActivities).toHaveBeenCalled()
        })
      })
    })
  })

  BddTest().when('the status is PUBLISHED and the activity is loaded', () => {
    beforeEach(async () => {
      wrapper = mountView(EActivityStatus.PUBLISHED)
      await waitForLoaded()
    })

    BddTest().then('it should render the edit button', () => {
      expect(wrapper.find('[data-testid="edit-draft-button"]').exists()).toBe(true)
    })

    BddTest().then('it should not render the delete button', () => {
      expect(wrapper.find('[data-testid="delete-draft-button"]').exists()).toBe(false)
    })

    BddTest().and('the edit button is clicked', () => {
      beforeEach(async () => {
        await wrapper.find('[data-testid="edit-draft-button"]').trigger('click')
        await flushPromises()
      })

      BddTest().then('it should create a draft and navigate to the edit view with the created draft id', () => {
        expect(mockNavigateToStaffActivitiesEditNationalActivity).toHaveBeenCalledWith({
          id: mockedActivityDraftCreationResponse.draftId,
        })
      })
    })
  })
})
