import { useGetStaffActivityWorkingSpace } from '@/api/avenir-esr'
import { ActivitiesTabStub } from '@/features/staff/activities/views/ActivitiesView/components/ActivitiesTab/ActivitiesTab.stub'
import { ActivityDraftCreationModalStub } from '@/features/staff/activities/views/ActivitiesView/components/ActivityDraftCreationModal/ActivityDraftCreationModal.stub'
import MyWorkspaceTab from '@/features/staff/activities/views/ActivitiesView/components/MyWorkspaceTab/MyWorkspaceTab.vue'
import { MDI_ICONS, PageSizes } from '@avenirs-esr/avenirs-dsav'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const displayAddActivityModal = vi.fn()
const hideAddActivityModal = vi.fn()

vi.mock('@/features/staff/activities/stores/activities.store', () => ({
  useStaffActivitiesStore: () => ({
    showAddActivityModal: false,
    displayAddActivityModal,
    hideAddActivityModal,
    workingSpaceCurrentPage: ref(0),
    workingSpacePageSizeSelected: ref(PageSizes.TWELVE),
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

BddTest().given('a MyWorkspaceTab component', () => {
  let wrapper: VueWrapper<InstanceType<typeof MyWorkspaceTab>>

  const stubs = {
    ActivitiesTab: ActivitiesTabStub,
    ActivityDraftCreationModal: ActivityDraftCreationModalStub,
    AvButton: AvButtonStub,
  }

  const mountDefault = async () => {
    vi.clearAllMocks()
    wrapper = mountComponent(MyWorkspaceTab, { global: { stubs } })
    await flushPromises()
  }

  beforeEach(async () => {
    await mountDefault()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it renders the activities tab with the correct props', () => {
      const activitiesTab = wrapper.findComponent(ActivitiesTabStub)
      const params = activitiesTab.props('usePaginatedStaffActivitiesParams')

      expect(activitiesTab.exists()).toBe(true)
      expect(activitiesTab.props('title')).toBe('Mon espace de travail (0)')
      expect(activitiesTab.props('emptyStateMessage')).toBe('Aucune activité pour le moment. Commencez par en créer une.')
      expect(activitiesTab.props('withStatus')).toBe(true)
      expect(activitiesTab.props('withActionsColumn')).toBe(true)

      expect(params.currentPageRef.value).toBe(0)
      expect(params.pageSizeRef.value).toBe(PageSizes.TWELVE)
      expect(params.fetchFn).toBe(useGetStaffActivityWorkingSpace)
    })

    BddTest().then('it renders the create activity button with correct props', () => {
      const button = wrapper.findComponent(AvButtonStub)

      expect(button.exists()).toBe(true)
      expect(button.props('label')).toBe('Créer une activité')
      expect(button.props('icon')).toBe(MDI_ICONS.PLUS_CIRCLE_OUTLINE)
    })

    BddTest().then('it renders the activity draft creation modal closed by default', () => {
      const modal = wrapper.findComponent(ActivityDraftCreationModalStub)

      expect(modal.exists()).toBe(true)
      expect(modal.props('opened')).toBe(false)
    })
  })

  BddTest().when('the create activity button is clicked', () => {
    beforeEach(async () => {
      await mountDefault()
      await wrapper.findComponent(AvButtonStub).trigger('click')
    })

    BddTest().then('it should call displayAddActivityModal', () => {
      expect(displayAddActivityModal).toHaveBeenCalled()
    })

    BddTest().and('the modal emits close', () => {
      beforeEach(() => {
        wrapper.findComponent(ActivityDraftCreationModalStub).vm.$emit('close')
      })

      BddTest().then('it should call hideAddActivityModal', () => {
        expect(hideAddActivityModal).toHaveBeenCalled()
      })
    })
  })

  BddTest().when('the activities tab emits delete-draft-activity and the API succeeds', () => {
    beforeEach(async () => {
      await wrapper.findComponent(ActivitiesTabStub).vm.$emit('deleteDraftActivity', 'activity-id-123')
    })

    BddTest().then('it should call addSuccessMessage with the success translation', async () => {
      await vi.waitFor(() => {
        expect(mockAddSuccessMessage).toHaveBeenCalledWith('L\'activité a été supprimée avec succès')
      })
    })
  })

  BddTest().when('the activities tab emits delete-draft-activity and the API returns an error', () => {
    beforeEach(async () => {
      wrapper.findComponent(ActivitiesTabStub).vm.$emit('deleteDraftActivity', 'activity-id-error')
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
