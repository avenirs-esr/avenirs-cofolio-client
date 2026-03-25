import type { VueWrapper } from '@vue/test-utils'
import { declaredActivityDetailsErrorHandler } from '@/__mocks__/msw/handlers/student/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { EDeclaredActivityStatus } from '@/api/avenir-esr'
import { LoaderStub } from '@/common/components/Loader/Loader.stub'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import { ActivityStatusBadgeStub } from '@/features/student/buildProject/components/badges/ActivityStatusBadge/ActivityStatusBadge.stub'
import { UnsubscribeActivitiesConfirmModalStub } from '@/features/student/buildProject/components/modals/UnsubscribeActivitiesConfirmModal/UnsubscribeActivitiesConfirmModal.stub'
import { ActivityDetailedDropdownStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/ActivityDetailedDropdown/ActivityDetailedDropdown.stub'
import {
  ProjectActivityDetailedLayoutStub
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/ProjectActivityDetailedLayout/ProjectActivityDetailedLayout.stub'
import ProjectActivityDetailedView, { type ProjectActivityDetailedViewProps } from '@/features/student/buildProject/views/ProjectActivityDetailedView/ProjectActivityDetailedView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

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

BddTest().given('a project activity detailed view', () => {
  let wrapper: VueWrapper<InstanceType<typeof ProjectActivityDetailedView>>

  const stubs = {
    PageTitle: PageTitleStub,
    Loader: LoaderStub,
    ActivityStatusBadge: ActivityStatusBadgeStub,
    UnsubscribeActivitiesConfirmModal: UnsubscribeActivitiesConfirmModalStub,
    ActivityDetailedDropdown: ActivityDetailedDropdownStub,
    ProjectActivityDetailedLayout: ProjectActivityDetailedLayoutStub,
  }

  BddTest().when('the view is mounted with a valid activity', () => {
    const props: ProjectActivityDetailedViewProps = {
      id: 'declared-activity-1'
    }

    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mountComponent(ProjectActivityDetailedView, {
        props,
        global: { stubs }
      })

      await vi.waitFor(() => expect(wrapper.find('[data-testid="activity-detail-title"]').exists()).toBe(true))
    })

    BddTest().then('it should render the page title component', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)
      expect(pageTitle.exists()).toBe(true)
    })

    BddTest().then('it should pass an empty title', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)
      expect(pageTitle.props('title')).toBe('Détail')
    })

    BddTest().then('it should pass the correct title in PageTitle slot', () => {
      const title = wrapper.find('[data-testid="activity-detail-title"]')
      expect(title.exists()).toBe(true)
      expect(title.text()).toContain('Détail')
      expect(title.text()).toContain('Détail Activité "Connaissance de soi" : Définir ses valeurs')
    })

    BddTest().then('it should pass the correct back route', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)
      expect(pageTitle.props('back')).toBe(ROUTES.STUDENT.HOME)
    })

    BddTest().then('it should pass the correct breadcrumb links', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)
      const breadcrumbLinks = pageTitle.props('breadcrumbLinks')

      expect(breadcrumbLinks).toHaveLength(3)
      expect(breadcrumbLinks[0]).toEqual({
        text: 'Accueil',
        to: ROUTES.STUDENT.HOME
      })
      expect(breadcrumbLinks[1]).toEqual({
        text: 'Construire mon projet de vie'
      })
      expect(breadcrumbLinks[2]).toEqual({
        text: 'Mes activités'
      })
    })

    BddTest().then('it should render the project activity detailed layout component', () => {
      const layout = wrapper.findComponent(ProjectActivityDetailedLayoutStub)
      expect(layout.exists()).toBe(true)
    })

    BddTest().then('it should pass the declared activity detail to the layout', () => {
      const layout = wrapper.findComponent(ProjectActivityDetailedLayoutStub)
      const declaredActivityDetails = layout.props('declaredActivityDetails')

      expect(declaredActivityDetails).toBeDefined()
      expect(declaredActivityDetails.id).toBe('declared-activity-1')
      expect(declaredActivityDetails.status).toBe(EDeclaredActivityStatus.IN_PROGRESS)
      expect(declaredActivityDetails.activity.title).toContain('Définir ses valeurs')
      expect(declaredActivityDetails.activity.summary).toContain('Activité faisant partie de la catégorie Connaissance de soi')
    })

    BddTest().then('it should render the ActivityStatusBadge with the correct status', () => {
      const badge = wrapper.findComponent(ActivityStatusBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('status')).toBe(EDeclaredActivityStatus.IN_PROGRESS)
    })

    BddTest().and('the user clicks the unsubscribe button in the activity detailed dropdown', () => {
      beforeEach(async () => {
        const unsubscribeButton = wrapper.findComponent(ActivityDetailedDropdownStub)
        unsubscribeButton.vm.$emit('unsubscribeSelected')
      })

      BddTest().then('it should show the UnsubscribeActivitiesConfirmModal', () => {
        const modal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
        expect(modal.exists()).toBe(true)
        expect(modal.props('show')).toBe(true)
      })
    })

    BddTest().and('the user confirms the unsubscription in the UnsubscribeActivitiesConfirmModal', () => {
      beforeEach(async () => {
        const modal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
        modal.vm.$emit('unsubscribed')
      })

      BddTest().then('it should hide the UnsubscribeActivitiesConfirmModal', () => {
        const modal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
        expect(modal.exists()).toBe(true)
        expect(modal.props('show')).toBe(false)
      })

      BddTest().then('it should navigate to the project activities page', () => {
        expect(navigateToStudentProjectActivities).toHaveBeenCalledTimes(1)
        expect(navigateToStudentProjectActivities).toHaveBeenCalledWith({ replace: true })
      })
    })

    BddTest().and('the user cancels the unsubscription in the UnsubscribeActivitiesConfirmModal', () => {
      beforeEach(async () => {
        const modal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
        modal.vm.$emit('cancel')
      })

      BddTest().then('it should hide the UnsubscribeActivitiesConfirmModal', () => {
        const modal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
        expect(modal.exists()).toBe(true)
        expect(modal.props('show')).toBe(false)
      })
    })
  })

  BddTest().when('the view is mounted with an invalid activity', () => {
    const props: ProjectActivityDetailedViewProps = {
      id: 'INVALID_DECLARED_ACTIVITY_ID'
    }

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mountComponent(ProjectActivityDetailedView, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should not render the page title', () => {
      expect(wrapper.findComponent(PageTitleStub).exists()).toBe(false)
    })

    BddTest().then('it should not render the layout', () => {
      expect(wrapper.findComponent(ProjectActivityDetailedLayoutStub).exists()).toBe(false)
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
    const props: ProjectActivityDetailedViewProps = {
      id: '0'
    }

    beforeEach(() => {
      vi.clearAllMocks()
      server.use(declaredActivityDetailsErrorHandler)

      wrapper = mountComponent(ProjectActivityDetailedView, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should not render the page title', () => {
      expect(wrapper.findComponent(PageTitleStub).exists()).toBe(false)
    })

    BddTest().then('it should not render the layout', () => {
      expect(wrapper.findComponent(ProjectActivityDetailedLayoutStub).exists()).toBe(false)
    })

    BddTest().then('it should render a generic error message', async () => {
      await vi.waitFor(() => {
        const errorMessage = wrapper.find('[data-testid="error-message"]')
        expect(errorMessage.exists()).toBe(true)
        expect(errorMessage.text()).toContain('Une erreur est survenue. Veuillez réessayer ultérieurement.')
        expect(errorMessage.text()).toContain('Internal Server Error')
      })
    })
  })
})
