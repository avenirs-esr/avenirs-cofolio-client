import type { VueWrapper } from '@vue/test-utils'
import { activityDetailsErrorHandler } from '@/__mocks__/msw/handlers/student/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { EActivityThematic } from '@/api/avenir-esr'
import { LoaderStub } from '@/common/components/Loader/Loader.stub'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import ActivitiesCatalogView, {
  type ActivitiesCatalogViewProps,
} from '@/features/student/activities/views/ActivitiesCatalogView/ActivitiesCatalogView.vue'
import { ActivitiesPreviousNextNavigationStub } from '@/features/student/activities/views/ActivitiesCatalogView/components/ActivitiesPreviousNextNavigation/ActivitiesPreviousNextNavigation.stub'
import {
  ActivitiesSelectNavigationStub
} from '@/features/student/activities/views/ActivitiesCatalogView/components/ActivitiesSelectNavigation/ActivitiesSelectNavigation.stub'
import {
  ActivitiesSideNavigationStub,
} from '@/features/student/activities/views/ActivitiesCatalogView/components/ActivitiesSideNavigation/ActivitiesSideNavigation.stub'
import { ActivityPreviewStub } from '@/features/student/activities/views/ActivitiesCatalogView/components/ActivityPreview/ActivityPreview.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const route = reactive<{ name: string }>({
  name: ROUTES.STUDENT.ACTIVITIES_CATALOG.name
})

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => route,
  }
})

const navigateToStudentActivitiesCatalog = vi.fn()
const navigateToStudentWidgetActivityCatalog = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentActivitiesCatalog,
      navigateToStudentWidgetActivityCatalog,
    }),
  }
})

const isMobileRef = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    useAvBreakpoints: () => ({ isMobile: isMobileRef }),
  }
})

BddTest().given('an ActivitiesCatalogView', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivitiesCatalogView>>

  const stubs = {
    PageTitle: PageTitleStub,
    ActivitiesSelectNavigation: ActivitiesSelectNavigationStub,
    ActivitiesSideNavigation: ActivitiesSideNavigationStub,
    ActivitiesPreviousNextNavigation: ActivitiesPreviousNextNavigationStub,
    ActivityPreview: ActivityPreviewStub,
    Loader: LoaderStub
  }

  BddTest().when('the view is mounted with a valid activity (desktop)', () => {
    const props: ActivitiesCatalogViewProps = {
      thematic: EActivityThematic.SELF_KNOWLEDGE,
      id: '0'
    }

    beforeEach(() => {
      vi.clearAllMocks()
      isMobileRef.value = false

      wrapper = mountComponent(ActivitiesCatalogView, {
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

    BddTest().then('it should pass the correct trailing links', async () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)
      expect(pageTitle.props('trailingLinks')).toHaveLength(1)
    })

    BddTest().then('it should use row layout on desktop', () => {
      const layout = wrapper.find('[data-testid="activities-layout"]')
      expect(layout.exists()).toBe(true)
      expect(layout.classes()).toContain('av-row')
      expect(layout.classes()).not.toContain('av-col')
    })

    BddTest().then('it should render the activity preview component', async () => {
      await vi.waitFor(() => expect(wrapper.findComponent(ActivityPreviewStub).exists()).toBe(true))
    })

    BddTest().then('it should render the side navigation', async () => {
      await vi.waitFor(() =>
        expect(wrapper.findComponent(ActivitiesSideNavigationStub).exists()).toBe(true),
      )
    })

    BddTest().then('it should render the previous/next navigation', async () => {
      await vi.waitFor(() =>
        expect(wrapper.findComponent(ActivitiesPreviousNextNavigationStub).exists()).toBe(true),
      )
    })
  })

  BddTest().when('the view is mounted with a valid activity (mobile)', () => {
    const props: ActivitiesCatalogViewProps = {
      thematic: EActivityThematic.SELF_KNOWLEDGE,
      id: '0'
    }

    beforeEach(() => {
      isMobileRef.value = true

      wrapper = mountComponent(ActivitiesCatalogView, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should use column layout on mobile', () => {
      const layout = wrapper.find('[data-testid="activities-layout"]')
      expect(layout.exists()).toBe(true)
      expect(layout.classes()).toContain('av-col')
      expect(layout.classes()).not.toContain('av-row')
    })

    BddTest().then('it should render the select navigation', async () => {
      await vi.waitFor(() =>
        expect(wrapper.findComponent(ActivitiesSelectNavigationStub).exists()).toBe(true),
      )
    })

    BddTest().then('it should render the previous/next navigation', async () => {
      await vi.waitFor(() =>
        expect(wrapper.findComponent(ActivitiesPreviousNextNavigationStub).exists()).toBe(true),
      )
    })
  })

  BddTest().when('the view is mounted with an invalid activity', () => {
    const props: ActivitiesCatalogViewProps = {
      thematic: EActivityThematic.SELF_KNOWLEDGE,
      id: 'INVALID_ACTIVITY_ID'
    }

    beforeEach(() => {
      isMobileRef.value = false

      wrapper = mountComponent(ActivitiesCatalogView, {
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
    const props: ActivitiesCatalogViewProps = {
      thematic: EActivityThematic.SELF_KNOWLEDGE,
      id: '0'
    }

    beforeEach(() => {
      isMobileRef.value = false
      server.use(activityDetailsErrorHandler)

      wrapper = mountComponent(ActivitiesCatalogView, {
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
        expect(errorMessage.text()).toContain('Erreur serveur interne')
      })
    })
  })

  BddTest().when('the view is mounted without thematic, id nor widget', () => {
    beforeEach(async () => {
      wrapper = mountComponent(ActivitiesCatalogView, {
        props: {},
        global: { stubs }
      })

      await vi.waitFor(() => {
        expect(navigateToStudentActivitiesCatalog).toHaveBeenCalled()
      })
    })

    BddTest().then('it should redirect to the first activity', () => {
      expect(navigateToStudentActivitiesCatalog).toHaveBeenCalledWith({
        thematic: EActivityThematic.SELF_KNOWLEDGE,
        id: expect.any(String),
        replace: true,
      })

      expect(navigateToStudentWidgetActivityCatalog).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the view is mounted with widget true', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      route.name = ROUTES.STUDENT.ACTIVITIES_CATALOG.name

      wrapper = mountComponent(ActivitiesCatalogView, {
        props: {
          thematic: EActivityThematic.SELF_KNOWLEDGE,
          id: '0',
          widget: true
        },
        global: { stubs },
        useTanstack: true,
        usePinia: true
      })
    })

    BddTest().then('it should still render the trailing links', () => {
      const pageTitle = wrapper.findComponent(PageTitleStub)
      expect(pageTitle.props('trailingLinks')).toHaveLength(1)
    })
  })
})
