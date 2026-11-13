import type { VueWrapper } from '@vue/test-utils'
import type { ActivityViewProps } from '@/features/student/activities/views/ActivityView/ActivityView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { DetailPageTitleStub, LoaderStub } from '@avenirs-esr/shared'
import { EDeclaredActivityStatus } from '@avenirs-esr/shared/api/avenir-esr'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { declaredActivityDetailsErrorHandler } from '@/__mocks__/msw/handlers/student/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { DeclaredActivityStatusBadgeStub } from '@/common/activities/badges/DeclaredActivityStatusBadge/DeclaredActivityStatusBadge.stub'
import { SubscribeActivityConfirmModalStub } from '@/features/student/activities/components/modals/SubscribeActivityConfirmModal/SubscribeActivityConfirmModal.stub'
import { UnsubscribeActivitiesConfirmModalStub } from '@/features/student/activities/components/modals/UnsubscribeActivitiesConfirmModal/UnsubscribeActivitiesConfirmModal.stub'
import ActivityView from '@/features/student/activities/views/ActivityView/ActivityView.vue'
import { ActivityLayoutStub } from '@/features/student/activities/views/ActivityView/components/ActivityLayout/ActivityLayout.stub'
import { DeleteMyActivityConfirmModalStub } from '@/features/student/activities/views/ActivityView/components/modals/DeleteMyActivityConfirmModal/DeleteMyActivityConfirmModal.stub'
import { ActivityDetailedDropdownStub } from '@/features/student/activities/views/ActivityView/components/overlays/ActivityDetailedDropdown/ActivityDetailedDropdown.stub'

const navigateToStudentProjectActivities = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentProjectActivities
    })
  }
})

const UpdateActivityDrawerStub = defineComponent({
  name: 'UpdateActivityDrawer',
  props: ['show', 'declaredActivity'],
  emits: ['close'],
  template: '<div data-testid="update-activity-drawer-stub" />'
})

BddTest().given('a project activity view', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityView>>

  const stubs = {
    DetailPageTitle: DetailPageTitleStub,
    Loader: LoaderStub,
    DeclaredActivityStatusBadge: DeclaredActivityStatusBadgeStub,
    UnsubscribeActivitiesConfirmModal: UnsubscribeActivitiesConfirmModalStub,
    SubscribeActivityConfirmModal: SubscribeActivityConfirmModalStub,
    ActivityDetailedDropdown: ActivityDetailedDropdownStub,
    ActivityLayout: ActivityLayoutStub,
    DeleteMyActivityConfirmModal: DeleteMyActivityConfirmModalStub,
    UpdateActivityDrawer: UpdateActivityDrawerStub
  }

  const mountWith = (props: ActivityViewProps = { id: 'declared-activity-1' }) => {
    wrapper = mountComponent(ActivityView, {
      props,
      global: { stubs }
    })
  }

  const getPageTitle = () => wrapper.findComponent(DetailPageTitleStub)
  const getLayout = () => wrapper.findComponent(ActivityLayoutStub)
  const getDetailedDropdown = () => wrapper.findComponent(ActivityDetailedDropdownStub)
  const getStatusBadge = () => wrapper.findComponent(DeclaredActivityStatusBadgeStub)
  const getSubscribeModal = () => wrapper.findComponent(SubscribeActivityConfirmModalStub)
  const getUnsubscribeModal = () => wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
  const getDeleteModal = () => wrapper.findComponent(DeleteMyActivityConfirmModalStub)
  const getUpdateDrawer = () => wrapper.findComponent(UpdateActivityDrawerStub)

  BddTest().when('the view is mounted with a valid activity', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      mountWith()
      await vi.waitFor(() => expect(getPageTitle().exists()).toBe(true))
    })

    BddTest().then('it should render the page title with the activity title', () => {
      expect(getPageTitle().props('title')).toBe('Activité "Connaissance de soi"\u00A0: Définir ses valeurs')
    })

    BddTest().then('it should render the activity breadcrumb links', () => {
      expect(getPageTitle().props('trailingLinks')).toHaveLength(2)
    })

    BddTest().then('it should render the activity layout with the declared activity details', () => {
      const details = getLayout().props('declaredActivityDetails')

      expect(getLayout().exists()).toBe(true)
      expect(details).toMatchObject({
        id: 'declared-activity-1',
        status: EDeclaredActivityStatus.IN_PROGRESS
      })
      expect(details.activity.title).toContain('Définir ses valeurs')
      expect(details.activity.summary).toContain('Activité faisant partie de la catégorie Connaissance de soi')
    })

    BddTest().then('it should render the status badge with the declared activity status', () => {
      expect(getStatusBadge().exists()).toBe(true)
      expect(getStatusBadge().props('status')).toBe(EDeclaredActivityStatus.IN_PROGRESS)
    })

    BddTest().then('it should pass the declared activity details to the detailed dropdown', () => {
      const details = getLayout().props('declaredActivityDetails')

      expect(getDetailedDropdown().props()).toMatchObject({
        declaredActivityId: details.id,
        status: details.status,
        activityStatus: details.activity.activityStatus
      })
    })

    BddTest().then('it should render the update drawer closed with the declared activity', () => {
      expect(getUpdateDrawer().props('show')).toBe(false)
      expect(getUpdateDrawer().props('declaredActivity')).toEqual(
        getLayout().props('declaredActivityDetails')
      )
    })

    BddTest().when('the user selects the update action', () => {
      beforeEach(async () => {
        getDetailedDropdown().vm.$emit('update')
        await flushPromises()
      })

      BddTest().then('it should open the update drawer', () => {
        expect(getUpdateDrawer().props('show')).toBe(true)
      })

      BddTest().and('the user closes the update drawer', () => {
        beforeEach(async () => {
          getUpdateDrawer().vm.$emit('close')
          await flushPromises()
        })

        BddTest().then('it should close the update drawer', () => {
          expect(getUpdateDrawer().props('show')).toBe(false)
        })
      })
    })

    BddTest().when('the user selects the unsubscribe action', () => {
      beforeEach(async () => {
        getDetailedDropdown().vm.$emit('unsubscribe')
        await flushPromises()
      })

      BddTest().then('it should open the unsubscribe confirmation modal', () => {
        expect(getUnsubscribeModal().props('opened')).toBe(true)
        expect(getUnsubscribeModal().props('declaredActivityId')).toBe('declared-activity-1')
      })

      BddTest().and('the user confirms the unsubscription', () => {
        beforeEach(async () => {
          getUnsubscribeModal().vm.$emit('unsubscribed')
          await flushPromises()
        })

        BddTest().then('it should close the unsubscribe confirmation modal', () => {
          expect(getUnsubscribeModal().props('opened')).toBe(false)
        })
      })

      BddTest().and('the user cancels the unsubscription', () => {
        beforeEach(async () => {
          getUnsubscribeModal().vm.$emit('cancel')
          await flushPromises()
        })

        BddTest().then('it should close the unsubscribe confirmation modal', () => {
          expect(getUnsubscribeModal().props('opened')).toBe(false)
        })
      })
    })

    BddTest().when('the user selects the resubscribe action', () => {
      beforeEach(async () => {
        getDetailedDropdown().vm.$emit('resubscribe')
        await flushPromises()
      })

      BddTest().then('it should open the subscribe confirmation modal', () => {
        expect(getSubscribeModal().props('opened')).toBe(true)
        expect(getSubscribeModal().props('declaredActivityId')).toBe('declared-activity-1')
      })

      BddTest().and('the user confirms the subscription', () => {
        beforeEach(async () => {
          getSubscribeModal().vm.$emit('subscribed')
          await flushPromises()
        })

        BddTest().then('it should close the subscribe confirmation modal', () => {
          expect(getSubscribeModal().props('opened')).toBe(false)
        })
      })

      BddTest().and('the user cancels the subscription', () => {
        beforeEach(async () => {
          getSubscribeModal().vm.$emit('cancel')
          await flushPromises()
        })

        BddTest().then('it should close the subscribe confirmation modal', () => {
          expect(getSubscribeModal().props('opened')).toBe(false)
        })
      })
    })

    BddTest().when('the user selects the delete action', () => {
      beforeEach(async () => {
        getDetailedDropdown().vm.$emit('delete')
        await flushPromises()
      })

      BddTest().then('it should open the delete confirmation modal', () => {
        expect(getDeleteModal().props('opened')).toBe(true)
      })

      BddTest().then('it should pass the declared activity and activity details to the modal', () => {
        const details = getLayout().props('declaredActivityDetails')

        expect(getDeleteModal().props()).toMatchObject({
          declaredActivityId: details.id,
          activityId: details.activity.id,
          activityTitle: details.activity.title
        })
      })

      BddTest().and('the user confirms the deletion', () => {
        beforeEach(async () => {
          getDeleteModal().vm.$emit('deleted')
          await flushPromises()
        })

        BddTest().then('it should close the delete confirmation modal', () => {
          expect(getDeleteModal().props('opened')).toBe(false)
        })

        BddTest().then('it should navigate to the project activities page', () => {
          expect(navigateToStudentProjectActivities).toHaveBeenCalledTimes(1)
          expect(navigateToStudentProjectActivities).toHaveBeenCalledWith({ replace: true })
        })
      })

      BddTest().and('the user cancels the deletion', () => {
        beforeEach(async () => {
          getDeleteModal().vm.$emit('cancel')
          await flushPromises()
        })

        BddTest().then('it should close the delete confirmation modal', () => {
          expect(getDeleteModal().props('opened')).toBe(false)
        })

        BddTest().then('it should not navigate to the project activities page', () => {
          expect(navigateToStudentProjectActivities).not.toHaveBeenCalled()
        })
      })
    })
  })

  BddTest().when('the view is mounted with an invalid activity', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      mountWith({ id: 'INVALID_DECLARED_ACTIVITY_ID' })
    })

    BddTest().then('it should not render the page title', () => {
      expect(getPageTitle().exists()).toBe(false)
    })

    BddTest().then('it should not render the activity layout', () => {
      expect(getLayout().exists()).toBe(false)
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
    beforeEach(() => {
      vi.clearAllMocks()
      server.use(declaredActivityDetailsErrorHandler)
      mountWith({ id: '0' })
    })

    BddTest().then('it should not render the page title', () => {
      expect(getPageTitle().exists()).toBe(false)
    })

    BddTest().then('it should not render the activity layout', () => {
      expect(getLayout().exists()).toBe(false)
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
})
