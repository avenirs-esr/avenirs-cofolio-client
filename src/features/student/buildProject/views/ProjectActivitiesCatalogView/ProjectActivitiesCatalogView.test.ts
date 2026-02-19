import type { VueWrapper } from '@vue/test-utils'
import { activityDetailsErrorHandler } from '@/__mocks__/msw/handlers/student/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { EActivityThematic } from '@/api/avenir-esr'
import { LoaderStub } from '@/common/components/Loader/Loader.stub'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import {
  ActivitiesSelectNavigationStub
} from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/ActivitiesSelectNavigation/ActivitiesSelectNavigation.stub'
import {
  ActivitiesSideNavigationStub,
} from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/ActivitiesSideNavigation/ActivitiesSideNavigation.stub'
import { ActivityPreviewStub } from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/ActivityPreview/ActivityPreview.stub'
import ProjectActivitiesCatalogView, {
  type ProjectActivitiesCatalogViewProps,
} from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/ProjectActivitiesCatalogView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const isMobileRef = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    useAvBreakpoints: () => ({ isMobile: isMobileRef }),
  }
})

BddTest().given('a project activities catalog view', () => {
  let wrapper: VueWrapper<InstanceType<typeof ProjectActivitiesCatalogView>>

  const stubs = {
    PageTitle: PageTitleStub,
    ActivitiesSelectNavigation: ActivitiesSelectNavigationStub,
    ActivitiesSideNavigation: ActivitiesSideNavigationStub,
    ActivityPreview: ActivityPreviewStub,
    Loader: LoaderStub
  }

  BddTest().when('the view is mounted with a valid activity (desktop)', () => {
    const props: ProjectActivitiesCatalogViewProps = {
      theme: EActivityThematic.SELF_KNOWLEDGE,
      id: '0'
    }

    beforeEach(() => {
      vi.clearAllMocks()
      isMobileRef.value = false

      wrapper = mountComponent(ProjectActivitiesCatalogView, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should render the page title component', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)
      expect(pageTitle.exists()).toBe(true)
    })

    BddTest().then('it should pass the correct title', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)
      expect(pageTitle.props('title')).toBe('Toutes les activités disponibles')
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

    BddTest().then('it should use row layout on desktop', () => {
      const layout = wrapper.find('div.av-my-md')
      expect(layout.exists()).toBe(true)
      expect(layout.classes()).toContain('av-row')
      expect(layout.classes()).not.toContain('av-column')
    })

    BddTest().then('it should render the activity preview component', async () => {
      await vi.waitFor(() => expect(wrapper.findComponent(ActivityPreviewStub).exists()).toBe(true))
    })

    BddTest().then('it should render the side navigation', async () => {
      await vi.waitFor(() =>
        expect(wrapper.findComponent(ActivitiesSideNavigationStub).exists()).toBe(true),
      )
    })
  })

  BddTest().when('the view is mounted with a valid activity (mobile)', () => {
    const props: ProjectActivitiesCatalogViewProps = {
      theme: EActivityThematic.SELF_KNOWLEDGE,
      id: '0'
    }

    beforeEach(() => {
      vi.clearAllMocks()
      isMobileRef.value = true

      wrapper = mountComponent(ProjectActivitiesCatalogView, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should use column layout on mobile', () => {
      const layout = wrapper.find('div.av-my-md')
      expect(layout.exists()).toBe(true)
      expect(layout.classes()).toContain('av-column')
      expect(layout.classes()).not.toContain('av-row')
    })

    BddTest().then('it should render the select navigation', async () => {
      await vi.waitFor(() =>
        expect(wrapper.findComponent(ActivitiesSelectNavigationStub).exists()).toBe(true),
      )
    })
  })

  BddTest().when('the view is mounted with an invalid activity', () => {
    const props: ProjectActivitiesCatalogViewProps = {
      theme: EActivityThematic.SELF_KNOWLEDGE,
      id: 'INVALID_ACTIVITY_ID'
    }

    beforeEach(() => {
      vi.clearAllMocks()
      isMobileRef.value = false

      wrapper = mountComponent(ProjectActivitiesCatalogView, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should not render the activity preview component', () => {
      const activityPreview = wrapper.findComponent(ActivityPreviewStub)
      expect(activityPreview.exists()).toBe(false)
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
    const props: ProjectActivitiesCatalogViewProps = {
      theme: EActivityThematic.SELF_KNOWLEDGE,
      id: '0'
    }

    beforeEach(() => {
      vi.clearAllMocks()
      isMobileRef.value = false
      server.use(activityDetailsErrorHandler)

      wrapper = mountComponent(ProjectActivitiesCatalogView, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should not render the activity preview component', () => {
      const activityPreview = wrapper.findComponent(ActivityPreviewStub)
      expect(activityPreview.exists()).toBe(false)
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
