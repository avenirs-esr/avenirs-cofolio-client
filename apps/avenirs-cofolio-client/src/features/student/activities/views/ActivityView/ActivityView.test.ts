import type { VueWrapper } from '@vue/test-utils'
import type { ActivityViewProps } from '@/features/student/activities/views/ActivityView/ActivityView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { LoaderStub } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { declaredActivityDetailsErrorHandler } from '@/__mocks__/msw/handlers/student/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { EAssociationContextType, EDeclaredActivityStatus } from '@/api/avenir-esr'
import { DeclaredActivityStatusBadgeStub } from '@/common/activities/badges/DeclaredActivityStatusBadge/DeclaredActivityStatusBadge.stub'
import { DetailedPageTitleStub } from '@/common/components/navigation/DetailedPageTitle/DetailedPageTitle.stub'
import { SubscribeActivityConfirmModalStub } from '@/features/student/activities/components/modals/SubscribeActivityConfirmModal/SubscribeActivityConfirmModal.stub'
import { UnsubscribeActivitiesConfirmModalStub } from '@/features/student/activities/components/modals/UnsubscribeActivitiesConfirmModal/UnsubscribeActivitiesConfirmModal.stub'
import ActivityView from '@/features/student/activities/views/ActivityView/ActivityView.vue'
import {
  ActivityLayoutStub
} from '@/features/student/activities/views/ActivityView/components/ActivityLayout/ActivityLayout.stub'
import { DeleteMyActivityConfirmModalStub } from '@/features/student/activities/views/ActivityView/components/modals/DeleteMyActivityConfirmModal/DeleteMyActivityConfirmModal.stub'
import { ActivityDetailedDropdownStub } from '@/features/student/activities/views/ActivityView/components/overlays/ActivityDetailedDropdown/ActivityDetailedDropdown.stub'
import { AssociateModalStub } from '@/features/student/associations/components/overlays/modals/AssociateModal/AssociateModal.stub'
import { DeleteAssociationsModalStub } from '@/features/student/associations/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.stub'

const navigateToStudentProjectActivities = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentProjectActivities
    }),
  }
})

BddTest().given('a project activity view', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityView>>

  const stubs = {
    DetailedPageTitle: DetailedPageTitleStub,
    Loader: LoaderStub,
    DeclaredActivityStatusBadge: DeclaredActivityStatusBadgeStub,
    UnsubscribeActivitiesConfirmModal: UnsubscribeActivitiesConfirmModalStub,
    SubscribeActivityConfirmModal: SubscribeActivityConfirmModalStub,
    ActivityDetailedDropdown: ActivityDetailedDropdownStub,
    AssociateModal: AssociateModalStub,
    ActivityLayout: ActivityLayoutStub,
    DeleteMyActivityConfirmModal: DeleteMyActivityConfirmModalStub,
    DeleteAssociationsModal: DeleteAssociationsModalStub
  }

  const getDetailedDropdown = () => wrapper.findComponent(ActivityDetailedDropdownStub)
  const getAssociateModals = () => wrapper.findComponent(AssociateModalStub)
  const getDeleteModal = () => wrapper.findComponent(DeleteAssociationsModalStub)

  async function emitDropdown (event: 'associate' | 'dissociate') {
    getDetailedDropdown().vm.$emit(event)
    await nextTick()
  }

  BddTest().when('the view is mounted with a valid activity', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mountComponent(ActivityView, {
        props: {
          id: 'declared-activity-1'
        },
        global: { stubs }
      })

      await vi.waitFor(() => expect(wrapper.find('[data-testid="activity-view-title"]').exists()).toBe(true))
    })

    BddTest().then('it should render the page title component', () => {
      const pageTitle = wrapper.findComponent(DetailedPageTitleStub)
      expect(pageTitle.exists()).toBe(true)
    })

    BddTest().then('it should pass the correct title', () => {
      const pageTitle = wrapper.findComponent(DetailedPageTitleStub)
      expect(pageTitle.props('title')).toBe('Activité "Connaissance de soi"\u00A0: Définir ses valeurs')
    })

    BddTest().then('it should pass the correct breadcrumb links', () => {
      const pageTitle = wrapper.findComponent(DetailedPageTitleStub)
      expect(pageTitle.props('trailingLinks')).toHaveLength(2)
    })

    BddTest().then('it should render the project activity layout component', () => {
      const layout = wrapper.findComponent(ActivityLayoutStub)
      expect(layout.exists()).toBe(true)
    })

    BddTest().then('it should pass the declared activity detail to the layout', () => {
      const layout = wrapper.findComponent(ActivityLayoutStub)
      const declaredActivityDetails = layout.props('declaredActivityDetails')

      expect(declaredActivityDetails).toBeDefined()
      expect(declaredActivityDetails.id).toBe('declared-activity-1')
      expect(declaredActivityDetails.status).toBe(EDeclaredActivityStatus.IN_PROGRESS)
      expect(declaredActivityDetails.activity.title).toContain('Définir ses valeurs')
      expect(declaredActivityDetails.activity.summary).toContain('Activité faisant partie de la catégorie Connaissance de soi')
    })

    BddTest().then('it should render the DeclaredActivityStatusBadge with the correct status', () => {
      const badge = wrapper.findComponent(DeclaredActivityStatusBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('status')).toBe(EDeclaredActivityStatus.IN_PROGRESS)
    })

    BddTest().then('it should pass the declared activity status to the dropdown', () => {
      const dropdown = wrapper.findComponent(ActivityDetailedDropdownStub)
      expect(dropdown.props('status')).toBe(EDeclaredActivityStatus.IN_PROGRESS)
    })

    BddTest().then('it should pass the declared activity id to the UnsubscribeActivitiesConfirmModal', () => {
      const modal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
      expect(modal.props('declaredActivityId')).toBe('declared-activity-1')
    })

    BddTest().and('the user clicks the unsubscribe button in the activity dropdown', () => {
      beforeEach(async () => {
        const unsubscribeButton = wrapper.findComponent(ActivityDetailedDropdownStub)
        unsubscribeButton.vm.$emit('unsubscribe')
      })

      BddTest().then('it should open the UnsubscribeActivitiesConfirmModal', () => {
        const modal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
        expect(modal.exists()).toBe(true)
        expect(modal.props('opened')).toBe(true)
      })
    })

    BddTest().and('the user confirms the unsubscription in the UnsubscribeActivitiesConfirmModal', () => {
      beforeEach(async () => {
        const modal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
        modal.vm.$emit('unsubscribed')
      })

      BddTest().then('it should close the UnsubscribeActivitiesConfirmModal', () => {
        const modal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
        expect(modal.exists()).toBe(true)
        expect(modal.props('opened')).toBe(false)
      })
    })

    BddTest().and('the user cancels the unsubscription in the UnsubscribeActivitiesConfirmModal', () => {
      beforeEach(async () => {
        const modal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
        modal.vm.$emit('cancel')
      })

      BddTest().then('it should close the UnsubscribeActivitiesConfirmModal', () => {
        const modal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
        expect(modal.exists()).toBe(true)
        expect(modal.props('opened')).toBe(false)
      })
    })

    BddTest().and('the user clicks the resubscribe button in the activity dropdown', () => {
      beforeEach(async () => {
        const dropdown = wrapper.findComponent(ActivityDetailedDropdownStub)
        dropdown.vm.$emit('resubscribe')
      })

      BddTest().then('it should show the SubscribeActivityConfirmModal', () => {
        const modal = wrapper.findComponent(SubscribeActivityConfirmModalStub)
        expect(modal.exists()).toBe(true)
        expect(modal.props('opened')).toBe(true)
        expect(modal.props('declaredActivityId')).toBe('declared-activity-1')
      })

      BddTest().and('the user confirms the subscription in the SubscribeActivityConfirmModal', () => {
        beforeEach(async () => {
          const modal = wrapper.findComponent(SubscribeActivityConfirmModalStub)
          modal.vm.$emit('subscribed')
        })

        BddTest().then('it should hide the SubscribeActivityConfirmModal', () => {
          const modal = wrapper.findComponent(SubscribeActivityConfirmModalStub)
          expect(modal.props('opened')).toBe(false)
        })
      })
    })

    BddTest().and('the user clicks the delete button in the activity detailed dropdown', () => {
      beforeEach(async () => {
        const deleteButton = wrapper.findComponent(ActivityDetailedDropdownStub)
        deleteButton.vm.$emit('delete')
      })

      BddTest().then('it should open the DeleteMyActivityConfirmModal', () => {
        const modal = wrapper.findComponent(DeleteMyActivityConfirmModalStub)
        expect(modal.exists()).toBe(true)
        expect(modal.props('opened')).toBe(true)
      })

      BddTest().then('it should pass the correct activity id and title to the modal', () => {
        const modal = wrapper.findComponent(DeleteMyActivityConfirmModalStub)
        const layout = wrapper.findComponent(ActivityLayoutStub)
        const declaredActivityDetails = layout.props('declaredActivityDetails')

        expect(modal.props('declaredActivityId')).toBe(declaredActivityDetails.id)
        expect(modal.props('activityId')).toBe(declaredActivityDetails.activity.id)
        expect(modal.props('activityTitle')).toBe(declaredActivityDetails.activity.title)
      })
    })

    BddTest().and('the user confirms the deletion in the DeleteMyActivityConfirmModal', () => {
      beforeEach(async () => {
        const modal = wrapper.findComponent(DeleteMyActivityConfirmModalStub)
        modal.vm.$emit('deleted')
      })

      BddTest().then('it should close the DeleteMyActivityConfirmModal', () => {
        const modal = wrapper.findComponent(DeleteMyActivityConfirmModalStub)
        expect(modal.exists()).toBe(true)
        expect(modal.props('opened')).toBe(false)
      })

      BddTest().then('it should navigate to the project activities page', () => {
        expect(navigateToStudentProjectActivities).toHaveBeenCalledTimes(1)
        expect(navigateToStudentProjectActivities).toHaveBeenCalledWith({ replace: true })
      })
    })

    BddTest().and('the user cancels the deletion in the DeleteMyActivityConfirmModal', () => {
      beforeEach(async () => {
        const modal = wrapper.findComponent(DeleteMyActivityConfirmModalStub)
        modal.vm.$emit('cancel')
      })

      BddTest().then('it should close the DeleteMyActivityConfirmModal', () => {
        const modal = wrapper.findComponent(DeleteMyActivityConfirmModalStub)
        expect(modal.exists()).toBe(true)
        expect(modal.props('opened')).toBe(false)
      })
    })
  })

  BddTest().when('the view is mounted with an invalid activity', () => {
    const props: ActivityViewProps = {
      id: 'INVALID_DECLARED_ACTIVITY_ID'
    }

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mountComponent(ActivityView, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should not render the page title', () => {
      expect(wrapper.findComponent(DetailedPageTitleStub).exists()).toBe(false)
    })

    BddTest().then('it should not render the layout', () => {
      expect(wrapper.findComponent(ActivityLayoutStub).exists()).toBe(false)
    })

    BddTest().then('it should render an activity not found error message', async () => {
      await vi.waitFor(() => {
        const errorMessage = wrapper.find('[data-testid="error-message"]')
        expect(errorMessage.exists()).toBe(true)
        expect(errorMessage.text()).toContain('Activité introuvable')
        expect(errorMessage.text()).toContain('L\'activité que vous recherchez n\'existe pas ou n\'est pas accessible.')
      })
    })
  })

  BddTest().when('the view is mounted and the API returns an error', () => {
    const props: ActivityViewProps = {
      id: '0'
    }

    beforeEach(() => {
      vi.clearAllMocks()
      server.use(declaredActivityDetailsErrorHandler)

      wrapper = mountComponent(ActivityView, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should not render the page title', () => {
      expect(wrapper.findComponent(DetailedPageTitleStub).exists()).toBe(false)
    })

    BddTest().then('it should not render the layout', () => {
      expect(wrapper.findComponent(ActivityLayoutStub).exists()).toBe(false)
    })

    BddTest().then('it should render a generic error message', async () => {
      await vi.waitFor(() => {
        const errorMessage = wrapper.find('[data-testid="error-message"]')
        expect(errorMessage.exists()).toBe(true)
        expect(errorMessage.text()).toContain('Une erreur est survenue. Veuillez réessayer ultérieurement.')
        expect(errorMessage.text()).toContain('Erreur serveur interne')
      })
    })
  })

  BddTest().when('the activity detail is displayed', () => {
    const props: ActivityViewProps = {
      id: 'declared-activity-1'
    }

    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mountComponent(ActivityView, {
        props,
        global: { stubs }
      })
      await flushPromises()
      await nextTick()
    })

    BddTest().then('it should render the associate modal closed with the activity props', () => {
      const modal = getAssociateModals()
      expect(modal.props('opened')).toBe(false)
      expect(modal.props('contextType')).toBe(EAssociationContextType.DECLARED_ACTIVITY)
      expect(modal.props('elementId')).toBe(props.id)
    })

    BddTest().then('it should render the delete associations modal closed with the activity props', () => {
      const modal = getDeleteModal()

      expect(modal.props('opened')).toBe(false)
      expect(modal.props('contextType')).toBe(EAssociationContextType.DECLARED_ACTIVITY)
      expect(modal.props('elementId')).toBe(props.id)
    })

    BddTest().and('the user chooses to associate elements', () => {
      beforeEach(async () => {
        await emitDropdown('associate')
      })

      BddTest().then('it should open only the associate modal', () => {
        expect(getAssociateModals().props('opened')).toBe(true)
        expect(getDeleteModal().props('opened')).toBe(false)
      })

      BddTest().and('the user cancels the association', () => {
        beforeEach(async () => {
          getAssociateModals().vm.$emit('cancel')
          await nextTick()
        })

        BddTest().then('it should close the associate modal', () => {
          expect(getAssociateModals().props('opened')).toBe(false)
        })
      })

      BddTest().and('the elements get associated', () => {
        beforeEach(async () => {
          getAssociateModals().vm.$emit('associated')
          await nextTick()
        })

        BddTest().then('it should close the associate modal', () => {
          expect(getAssociateModals().props('opened')).toBe(false)
        })
      })
    })

    BddTest().and('the user chooses to dissociate elements', () => {
      beforeEach(async () => {
        await emitDropdown('dissociate')
      })

      BddTest().then('it should open only the delete associations modal', () => {
        expect(getDeleteModal().props('opened')).toBe(true)
        expect(getAssociateModals().props('opened')).toBe(false)
      })

      BddTest().and('the user cancels the deletion', () => {
        beforeEach(async () => {
          getDeleteModal().vm.$emit('cancel')
          await nextTick()
        })

        BddTest().then('it should close the delete associations modal', () => {
          expect(getDeleteModal().props('opened')).toBe(false)
        })
      })

      BddTest().and('the associations get deleted', () => {
        beforeEach(async () => {
          getDeleteModal().vm.$emit('deleted')
          await nextTick()
        })

        BddTest().then('it should close the delete associations modal', () => {
          expect(getDeleteModal().props('opened')).toBe(false)
        })
      })
    })
  })
})
