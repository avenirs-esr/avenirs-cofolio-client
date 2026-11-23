import type { VueWrapper } from '@vue/test-utils'
import type { Component } from 'vue'
import type { NationalActivityCatalogViewProps } from '@/features/staff/activities/views/NationalActivityCatalogView/NationalActivityCatalogView.vue'
import { AvButtonStub, AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { PageTitleStub, QuerySuspenseStub } from '@avenirs-esr/shared'
import { EActivityStatus } from '@avenirs-esr/shared/api/avenir-esr'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { mockedActivityContent, mockedActivityContentWithSubActivities, mockedSubActivityContent, mockedSubActivityContentWithDraft } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { createGetActivityContentErrorHandler, getActivityContentErrorHandler } from '@/__mocks__/msw/handlers/staffs/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { useEnumRouteQuery } from '@/common/composables/use-enum-route-query/use-enum-route-query'
import { ROUTES } from '@/common/constants'
import { DeleteDraftActivityConfirmationModalStub } from '@/features/staff/activities/components/modals/DeleteDraftActivityConfirmationModal/DeleteDraftActivityConfirmationModal.stub'
import { EditPublishedActivityConfirmationModalStub } from '@/features/staff/activities/components/modals/EditPublishedActivityConfirmationModal/EditPublishedActivityConfirmationModal.stub'
import { ActivityDashboardSectionStub } from '@/features/staff/activities/views/NationalActivityCatalogView/components/ActivityDashboardSection/ActivityDashboardSection.stub'
import { ActivityRightsSectionStub } from '@/features/staff/activities/views/NationalActivityCatalogView/components/ActivityRightsSection/ActivityRightsSection.stub'
import { NationalActivityCatalogPreviewTabStub } from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivityCatalogPreviewTab/NationalActivityCatalogPreviewTab.stub'
import { NationalActivityContentTabStub } from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivityContentTab/NationalActivityContentTab.stub'
import { NationalActivityCatalogTabs } from '@/features/staff/activities/views/NationalActivityCatalogView/NationalActivityCatalogView.types'
import NationalActivityCatalogView from '@/features/staff/activities/views/NationalActivityCatalogView/NationalActivityCatalogView.vue'

const DELETE_LABEL = 'Supprimer'
const ERROR_TITLE = 'Impossible de charger l\'activité'
const PAGE_TITLE = 'Toutes les activités disponibles dans mon établissement'
const RESUME_DRAFT_LABEL = 'Reprendre le brouillon'
const TABS_DISABLED_TOOLTIP = 'Enregistrez ou annulez vos modifications de droits avant de changer d\'onglet'
const UPDATE_LABEL = 'Modifier'

const defaultProps: NationalActivityCatalogViewProps = {
  status: EActivityStatus.DRAFT,
  id: mockedActivityContent.id,
}

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

function mockActiveTab (tab: NationalActivityCatalogTabs) {
  const activeTab = ref<string | number>(tab)

  vi.mocked(useEnumRouteQuery).mockReturnValue(computed({
    get: () => activeTab.value,
    set: value => activeTab.value = value,
  }))
}

BddTest().given('a national activity catalog view', () => {
  let wrapper: VueWrapper<InstanceType<typeof NationalActivityCatalogView>>

  const stubs = {
    ActivityDashboardSection: ActivityDashboardSectionStub,
    ActivityRightsSection: ActivityRightsSectionStub,
    AvButton: AvButtonStub,
    AvTab: AvTabStub,
    AvTabs: AvTabsStub,
    DeleteDraftActivityConfirmationModal: DeleteDraftActivityConfirmationModalStub,
    EditPublishedActivityConfirmationModal: EditPublishedActivityConfirmationModalStub,
    NationalActivityCatalogPreviewTab: NationalActivityCatalogPreviewTabStub,
    NationalActivityContentTab: NationalActivityContentTabStub,
    PageTitle: PageTitleStub,
    QuerySuspense: QuerySuspenseStub,
  }

  const mountWith = (
    props: Partial<NationalActivityCatalogViewProps> = {},
    tab = NationalActivityCatalogTabs.CONTENT,
    stubOverrides: Record<string, Component> = {},
  ) => {
    vi.clearAllMocks()
    mockActiveTab(tab)

    wrapper = mountComponent(NationalActivityCatalogView, {
      props: {
        ...defaultProps,
        ...props,
      },
      global: {
        stubs: {
          ...stubs,
          ...stubOverrides,
        }
      }
    })
  }

  const getPageTitle = () => wrapper.findComponent(PageTitleStub)
  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getTabs = () => wrapper.findComponent(AvTabsStub)
  const getTabItems = () => wrapper.findAllComponents(AvTabStub)
  const getNationalActivityContentTab = () => wrapper.findComponent(NationalActivityContentTabStub)
  const getNationalActivityCatalogPreviewTab = () => wrapper.findComponent(NationalActivityCatalogPreviewTabStub)
  const getActivityDashboardSection = () => wrapper.findComponent(ActivityDashboardSectionStub)
  const getActivityRightsSection = () => wrapper.findComponent(ActivityRightsSectionStub)
  const getEditPublishedActivityConfirmationModal = () => wrapper.findComponent(EditPublishedActivityConfirmationModalStub)
  const getDeleteDraftActivityConfirmationModal = () => wrapper.findComponent(DeleteDraftActivityConfirmationModalStub)

  const getButton = (testid: string) => wrapper.findComponent(`[data-testid="${testid}"]`) as VueWrapper<InstanceType<typeof AvButtonStub>>
  const getEditButton = () => getButton('edit-draft-button')
  const getDeleteButton = () => getButton('delete-draft-button')

  const waitForLoaded = async () => {
    await vi.waitFor(() => {
      expect(getQuerySuspense().props('isLoading')).toBe(false)
    })
  }

  BddTest().when('the view is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render PageTitle with the correct title', () => {
      expect(getPageTitle().props('title')).toBe(PAGE_TITLE)
    })

    BddTest().then('it should render PageTitle with the correct breadcrumb links', async () => {
      await vi.waitFor(() => {
        expect(getPageTitle().props('trailingLinks')).toEqual([
          { text: mockedActivityContent.title },
        ])
      })
    })

    BddTest().then('it should render QuerySuspense with the correct error title', () => {
      expect(getQuerySuspense().props('errorTitle')).toBe(ERROR_TITLE)
    })
  })

  BddTest().when('the activity is loaded', () => {
    beforeEach(async () => {
      mountWith()
      await waitForLoaded()
    })

    BddTest().then('it should render NationalActivityContentTab with the correct activity', () => {
      expect(getNationalActivityContentTab().props('activity')).toEqual(mockedActivityContent)
    })
  })

  BddTest().when('the API returns an error', () => {
    beforeEach(() => {
      server.use(getActivityContentErrorHandler)
      mountWith()
    })

    BddTest().then('it should render QuerySuspense with an error', async () => {
      await vi.waitFor(() => {
        expect(getQuerySuspense().props('error')).toBeTruthy()
      })
    })

    BddTest().then('it should disable the edit and delete buttons with the loading error tooltip', async () => {
      await vi.waitFor(() => {
        expect(getQuerySuspense().props('error')).toBeTruthy()
      })

      const editButton = getEditButton()
      const deleteButton = getDeleteButton()

      expect(editButton.props('disabled')).toBe(true)
      expect(editButton.props('disabledTooltip')).toBe(ERROR_TITLE)
      expect(deleteButton.props('disabled')).toBe(true)
      expect(deleteButton.props('disabledTooltip')).toBe(ERROR_TITLE)
    })
  })

  BddTest().when('the status is DRAFT and the activity is loaded', () => {
    beforeEach(async () => {
      mountWith({
        status: EActivityStatus.DRAFT,
      })
      await waitForLoaded()
    })

    BddTest().then('it should render the edit and delete buttons', () => {
      expect(getEditButton().exists()).toBe(true)
      expect(getDeleteButton().exists()).toBe(true)
    })

    BddTest().then('it should label the edit button to resume the draft', () => {
      expect(getEditButton().props('label')).toBe(RESUME_DRAFT_LABEL)
    })

    BddTest().then('it should label the delete button', () => {
      expect(getDeleteButton().props('label')).toBe(DELETE_LABEL)
    })

    BddTest().and('the edit button is clicked', () => {
      beforeEach(async () => {
        await getEditButton().trigger('click')
      })

      BddTest().then('it should navigate directly to the edit view', () => {
        expect(mockNavigateToStaffActivitiesEditNationalActivity).toHaveBeenCalledWith({
          id: mockedActivityContent.id,
        })
      })
    })

    BddTest().and('the delete button is clicked', () => {
      beforeEach(async () => {
        await getDeleteButton().trigger('click')
      })

      BddTest().then('it should open the confirmation modal', () => {
        expect(getDeleteDraftActivityConfirmationModal().props('opened')).toBe(true)
      })

      BddTest().and('the confirmation modal is cancelled', () => {
        beforeEach(() => {
          getDeleteDraftActivityConfirmationModal().vm.$emit('close')
        })

        BddTest().then('it should close the confirmation modal', () => {
          expect(getDeleteDraftActivityConfirmationModal().props('opened')).toBe(false)
        })
      })

      BddTest().and('the modal emits deleted', () => {
        beforeEach(() => {
          getDeleteDraftActivityConfirmationModal().vm.$emit('deleted')
        })

        BddTest().then('it should navigate to the activities page', () => {
          expect(mockNavigateToStaffActivities).toHaveBeenCalled()
        })
      })
    })
  })

  BddTest().when('the status is PUBLISHED and the activity is loaded', () => {
    beforeEach(async () => {
      mountWith({
        status: EActivityStatus.PUBLISHED,
      })
      await waitForLoaded()
    })

    BddTest().then('it should render the edit button', () => {
      expect(getEditButton().exists()).toBe(true)
    })

    BddTest().then('it should label the edit button to update the activity', () => {
      expect(getEditButton().props('label')).toBe(UPDATE_LABEL)
    })

    BddTest().then('it should not render the delete button', () => {
      expect(getDeleteButton().exists()).toBe(false)
    })

    BddTest().and('the edit button is clicked', () => {
      beforeEach(async () => {
        await getEditButton().trigger('click')
        await flushPromises()
      })

      BddTest().then('it should create a draft and navigate to the edit view of the activity', () => {
        expect(mockNavigateToStaffActivitiesEditNationalActivity).toHaveBeenCalledWith({
          id: mockedActivityContent.id,
        })
      })
    })
  })

  BddTest().when('the key figures tab is active', () => {
    beforeEach(async () => {
      mountWith({}, NationalActivityCatalogTabs.DASHBOARD)
      await waitForLoaded()
    })

    BddTest().then('it should render ActivityDashboardSection with the loaded activity id and status', () => {
      const dashboardSection = getActivityDashboardSection()
      expect(dashboardSection.props('activityId')).toBe(mockedActivityContent.id)
      expect(dashboardSection.props('status')).toBe(EActivityStatus.DRAFT)
    })

    BddTest().then('it should render ActivityRightsSection with the loaded activity id and status', () => {
      const rightsSection = getActivityRightsSection()
      expect(rightsSection.props('activityId')).toBe(mockedActivityContent.id)
      expect(rightsSection.props('status')).toBe(EActivityStatus.DRAFT)
    })

    BddTest().then('it should not render the other tabs content', () => {
      expect(getNationalActivityContentTab().exists()).toBe(false)
      expect(getNationalActivityCatalogPreviewTab().exists()).toBe(false)
    })
  })

  BddTest().when('the rights section reports pending changes', () => {
    const AllTabsStub = defineComponent({ name: 'AvTabs', template: '<div><slot /></div>' })

    beforeEach(async () => {
      mountWith({}, NationalActivityCatalogTabs.DASHBOARD, {
        AvTabs: AllTabsStub,
      })
      await waitForLoaded()
    })

    BddTest().then('it should keep the tabs enabled by default', () => {
      expect(getTabItems().map(tab => tab.props('disabled'))).toEqual([false, false, false])
    })

    BddTest().then('it should disable the content and preview tabs, and re-enable them once changes are gone', async () => {
      const rightsSection = getActivityRightsSection()
      rightsSection.vm.$emit('dirtyChange', true)
      await flushPromises()
      expect(getTabItems().map(tab => tab.props('disabled'))).toEqual([true, true, false])
      expect(getTabItems().map(tab => tab.props('disabledTooltip'))).toEqual([
        TABS_DISABLED_TOOLTIP,
        TABS_DISABLED_TOOLTIP,
        undefined,
      ])

      rightsSection.vm.$emit('dirtyChange', false)
      await flushPromises()
      expect(getTabItems().map(tab => tab.props('disabled'))).toEqual([false, false, false])
    })
  })

  BddTest().when('the status is DRAFT and the activity is loaded by a staff without the edit right', () => {
    beforeEach(async () => {
      mountWith({
        status: EActivityStatus.DRAFT,
        id: 'WITHOUT_RIGHTS_ID',
      })
      await waitForLoaded()
    })

    BddTest().then('it should disable both edit and delete buttons', () => {
      expect(getEditButton().props('disabled')).toBe(true)
      expect(getDeleteButton().props('disabled')).toBe(true)
    })
  })

  BddTest().when('the activity is a sub-activity', () => {
    beforeEach(() => {
      mountWith({
        status: EActivityStatus.PUBLISHED,
        id: mockedSubActivityContent.id,
      })
    })

    BddTest().then('it should prefix the breadcrumb with a link to the parent activity', async () => {
      await vi.waitFor(() => {
        expect(getPageTitle().props('trailingLinks')).toEqual([
          {
            text: mockedActivityContentWithSubActivities.title,
            to: {
              name: ROUTES.STAFF.ACTIVITY_CATALOG.name,
              params: {
                status: EActivityStatus.PUBLISHED,
                id: mockedActivityContentWithSubActivities.id,
              },
            },
          },
          { text: expect.any(String) },
          { text: mockedSubActivityContent.title },
        ])
      })
    })

    BddTest().then('it should render the content tab directly, without tabs', async () => {
      await vi.waitFor(() => {
        expect(getNationalActivityContentTab().props('activity')).toEqual(mockedSubActivityContent)
      })
      expect(getTabs().exists()).toBe(false)
    })

    BddTest().and('the edit button is clicked', () => {
      beforeEach(async () => {
        await waitForLoaded()
        await getEditButton().trigger('click')
        await flushPromises()
      })

      BddTest().then('it should ask for a confirmation before creating the draft', () => {
        expect(getEditPublishedActivityConfirmationModal().props('opened')).toBe(true)
        expect(getEditPublishedActivityConfirmationModal().props('activity')).toEqual(mockedSubActivityContent)
        expect(mockNavigateToStaffActivitiesEditNationalActivity).not.toHaveBeenCalled()
      })

      BddTest().and('the confirmation is cancelled', () => {
        beforeEach(async () => {
          getEditPublishedActivityConfirmationModal().vm.$emit('close')
          await flushPromises()
        })

        BddTest().then('it should close the confirmation modal without creating the draft', () => {
          expect(getEditPublishedActivityConfirmationModal().props('opened')).toBe(false)
          expect(mockNavigateToStaffActivitiesEditNationalActivity).not.toHaveBeenCalled()
        })
      })

      BddTest().and('the confirmation is confirmed', () => {
        beforeEach(async () => {
          getEditPublishedActivityConfirmationModal().vm.$emit('confirm')
          await flushPromises()
        })

        BddTest().then('it should close the confirmation modal', () => {
          expect(getEditPublishedActivityConfirmationModal().props('opened')).toBe(false)
        })

        BddTest().then('it should create the draft of the parent activity and navigate to the edit view of the sub-activity', () => {
          expect(mockNavigateToStaffActivitiesEditNationalActivity).toHaveBeenCalledWith({
            id: mockedSubActivityContent.id,
          })
        })
      })
    })

    BddTest().and('the parent activity already has a draft', () => {
      beforeEach(async () => {
        mountWith({
          status: EActivityStatus.PUBLISHED,
          id: mockedSubActivityContentWithDraft.id,
        })
        await waitForLoaded()
      })

      BddTest().then('it should label the edit button to resume the draft', () => {
        expect(getEditButton().props('label')).toBe(RESUME_DRAFT_LABEL)
      })

      BddTest().and('the edit button is clicked', () => {
        beforeEach(async () => {
          await getEditButton().trigger('click')
          await flushPromises()
        })

        BddTest().then('it should not ask for a confirmation', () => {
          expect(getEditPublishedActivityConfirmationModal().props('opened')).toBe(false)
        })

        BddTest().then('it should resume the draft of the parent activity and navigate to the edit view of the sub-activity', () => {
          expect(mockNavigateToStaffActivitiesEditNationalActivity).toHaveBeenCalledWith({
            id: mockedSubActivityContentWithDraft.id,
          })
        })
      })
    })

    BddTest().and('the status is DRAFT', () => {
      beforeEach(async () => {
        mountWith({
          status: EActivityStatus.DRAFT,
          id: mockedSubActivityContent.id,
        })
        await vi.waitFor(() => {
          expect(getNationalActivityContentTab().exists()).toBe(true)
        })
      })

      BddTest().then('it should render the edit button', () => {
        expect(getEditButton().exists()).toBe(true)
      })

      BddTest().then('it should not render the delete button', () => {
        expect(getDeleteButton().exists()).toBe(false)
      })
    })

    BddTest().and('the parent activity fails to load', () => {
      beforeEach(() => {
        server.use(createGetActivityContentErrorHandler(
          EActivityStatus.PUBLISHED,
          mockedActivityContentWithSubActivities.id
        ))
        mountWith({
          status: EActivityStatus.PUBLISHED,
          id: mockedSubActivityContent.id,
        })
      })

      BddTest().then('it should render QuerySuspense with an error', async () => {
        await vi.waitFor(() => {
          expect(getQuerySuspense().props('error')).toBeTruthy()
        })
      })

      BddTest().then('it should disable the edit button with the loading error tooltip', async () => {
        await vi.waitFor(() => {
          expect(getQuerySuspense().props('error')).toBeTruthy()
        })

        const editButton = getEditButton()

        expect(editButton.props('disabled')).toBe(true)
        expect(editButton.props('disabledTooltip')).toBe(ERROR_TITLE)
      })
    })
  })
})
