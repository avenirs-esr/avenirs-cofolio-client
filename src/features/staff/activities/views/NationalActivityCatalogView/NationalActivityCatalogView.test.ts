import type { VueWrapper } from '@vue/test-utils'
import { mockedActivityContent } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { getActivityContentErrorHandler } from '@/__mocks__/msw/handlers/staffs/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { EActivityStatus } from '@/api/avenir-esr'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { ROUTES } from '@/common/constants'
import { DeleteDraftActivityConfirmationModalStub } from '@/features/staff/activities/components/modals/DeleteDraftActivityConfirmationModal/DeleteDraftActivityConfirmationModal.stub'
import { NationalActivityContentTabStub } from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivityContentTab/NationalActivityContentTab.stub'
import NationalActivityCatalogView from '@/features/staff/activities/views/NationalActivityCatalogView/NationalActivityCatalogView.vue'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockNavigateToStaffActivities = vi.fn()

vi.mock('@/common/composables/use-navigation/use-navigation', () => ({
  useNavigation: () => ({
    navigateToStaffActivities: mockNavigateToStaffActivities,
  }),
}))

const mockAddSuccessMessage = vi.fn()
const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async () => {
  const actual = await vi.importActual<typeof import('@/store')>('@/store')
  return {
    ...actual,
    useToasterStore: vi.fn(() => ({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage,
    })),
  }
})

BddTest().given('a national activity catalog view', () => {
  let wrapper: VueWrapper<InstanceType<typeof NationalActivityCatalogView>>

  const stubs = {
    PageTitle: PageTitleStub,
    QuerySuspense: QuerySuspenseStub,
    NationalActivityContentTab: NationalActivityContentTabStub,
    AvButton: AvButtonStub,
    DeleteDraftActivityConfirmationModal: DeleteDraftActivityConfirmationModalStub,
  }

  const mountView = (status = EActivityStatus.DRAFT, id = mockedActivityContent.id) => mountComponent(NationalActivityCatalogView, {
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

    BddTest().then('it should render the delete button', () => {
      expect(wrapper.findComponent(AvButtonStub).exists()).toBe(true)
      expect(wrapper.findComponent(AvButtonStub).props('label')).toBe('Supprimer')
    })

    BddTest().then('it should render the confirmation modal closed', () => {
      expect(wrapper.findComponent(DeleteDraftActivityConfirmationModalStub).props('show')).toBe(false)
    })

    BddTest().and('the delete button is clicked', () => {
      beforeEach(async () => {
        await wrapper.findComponent(AvButtonStub).trigger('click')
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

      BddTest().and('the deletion is confirmed and the API succeeds', () => {
        beforeEach(() => {
          wrapper.findComponent(DeleteDraftActivityConfirmationModalStub).vm.$emit('confirm')
        })

        BddTest().then('it should call addSuccessMessage', async () => {
          await vi.waitFor(() => {
            expect(mockAddSuccessMessage).toHaveBeenCalledWith('L\'activité a été supprimée avec succès')
          })
        })

        BddTest().then('it should navigate to the activities page', async () => {
          await vi.waitFor(() => {
            expect(mockNavigateToStaffActivities).toHaveBeenCalled()
          })
        })
      })

      BddTest().and('the deletion is confirmed and the API returns an error', () => {
        beforeEach(async () => {
          wrapper = mountView(EActivityStatus.DRAFT, 'activity-id-error')
          await waitForLoaded()
          await wrapper.findComponent(AvButtonStub).trigger('click')
          wrapper.findComponent(DeleteDraftActivityConfirmationModalStub).vm.$emit('confirm')
        })

        BddTest().then('it should call addErrorMessage with the error title', async () => {
          await vi.waitFor(() => {
            expect(mockAddErrorMessage).toHaveBeenCalledWith(
              expect.objectContaining({
                title: 'Une erreur est survenue lors de la suppression de l\'activité',
              })
            )
          })
        })
      })
    })
  })

  BddTest().when('the status is PUBLISHED', () => {
    beforeEach(() => {
      wrapper = mountView(EActivityStatus.PUBLISHED)
    })

    BddTest().then('it should not render the delete button', () => {
      expect(wrapper.findComponent(AvButtonStub).exists()).toBe(false)
    })
  })
})
