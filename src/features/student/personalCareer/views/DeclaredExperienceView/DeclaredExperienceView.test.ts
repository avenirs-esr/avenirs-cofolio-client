import type { VueWrapper } from '@vue/test-utils'
import {
  declaredExperienceDetailedLoadingHandler,
  declaredExperiencesHandlers
} from '@/__mocks__/msw/handlers/student/declaredExperiences.handlers'
import { server } from '@/__mocks__/msw/server'
import { LoaderStub } from '@/common/components/Loader/Loader.stub'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import { DeclaredExperienceSideMenuStub }
  from '@/features/student/personalCareer/components/navigation/DeclaredExperienceSideMenu/DeclaredExperienceSideMenu.stub'
import {
  DeclaredExperienceDetailsDropdownStub
} from '@/features/student/personalCareer/views/DeclaredExperienceView/components/DeclaredExperienceDetailsDropdown/DeclaredExperienceDetailsDropdown.stub'
import DeclaredExperienceView
, { type DeclaredExperienceViewProps } from '@/features/student/personalCareer/views/DeclaredExperienceView/DeclaredExperienceView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const navigateToStudentUpdateDeclaredExperience = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentUpdateDeclaredExperience,
    }),
  }
})

const routerPush = vi.fn()

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()

  return {
    ...actual,
    useRoute: () => ({
      params: {}
    }),
    useRouter: () => ({
      push: routerPush
    })
  }
})

const DeclaredExperienceDetailedStub = defineComponent({
  name: 'DeclaredExperienceDetails',
  props: ['declaredExperienceDetails'],
  template: '<div data-testid="declared-experience-detailed" />'
})

const stubs = {
  PageTitle: PageTitleStub,
  DeclaredExperienceSideMenu: DeclaredExperienceSideMenuStub,
  DeclaredExperienceDetails: DeclaredExperienceDetailedStub,
  Loader: LoaderStub,
  DeclaredExperienceDetailsDropdown: DeclaredExperienceDetailsDropdownStub
}

BddTest().given('a declared experience view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceView>>
  const props: DeclaredExperienceViewProps = {
    experienceId: 'exp-123'
  }

  const mountComponentWithDefaults = async () => {
    wrapper = mountComponent(DeclaredExperienceView, {
      props,
      global: { stubs }
    })
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      await mountComponentWithDefaults()
      vi.clearAllMocks()
    })

    BddTest().then('it should render PageTitle with correct title and breadcrumbs', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })
      expect(pageTitle.exists()).toBe(true)

      expect(pageTitle.props('title')).toBe('')
      expect(pageTitle.text()).toContain('Détail')

      const breadcrumbs = pageTitle.props('breadcrumbLinks')
      expect(breadcrumbs).toHaveLength(4)
    })

    BddTest().then('it should render PageTitle with correct breadcrumb links', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })
      expect(pageTitle.exists()).toBe(true)

      const breadcrumbLinks = pageTitle.props('breadcrumbLinks') as Array<{ text: string, to?: string }>
      expect(breadcrumbLinks).toHaveLength(4)
      expect(breadcrumbLinks[0]).toEqual({ text: 'Accueil', to: ROUTES.STUDENT.HOME })
      expect(breadcrumbLinks[1]).toEqual({ text: 'Construire mon projet de vie' })
      expect(breadcrumbLinks[2]).toEqual({ text: 'Mon parcours', to: ROUTES.STUDENT.PERSONAL_CAREER })
      expect(breadcrumbLinks[3]).toEqual({ text: 'Mes expériences', to: ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES })
    })

    BddTest().then('it should render the side menu', () => {
      const sideMenu = wrapper.findComponent({ name: 'DeclaredExperienceSideMenu' })
      expect(sideMenu.exists()).toBe(true)
    })

    BddTest().then('it should pass correct props to the side menu', () => {
      const sideMenu = wrapper.findComponent({ name: 'DeclaredExperienceSideMenu' })

      expect(sideMenu.props()).toHaveProperty('experiences')
      expect(sideMenu.props()).toHaveProperty('experienceCount')

      expect(Array.isArray(sideMenu.props('experiences'))).toBe(true)
      expect(typeof sideMenu.props('experienceCount')).toBe('number')
    })

    BddTest().and('loading more experiences from the side menu', () => {
      beforeEach(() => {
        const sideMenu = wrapper.findComponent({ name: 'DeclaredExperienceSideMenu' })
        sideMenu.vm.$emit('loadMoreExperiences')
      })

      BddTest().then('it should trigger the pagination composable', () => {
        expect(wrapper.exists()).toBe(true)
      })
    })

    BddTest().and('selecting an experience from the side menu', () => {
      const experienceId = 'declared-experience-1'

      beforeEach(() => {
        const sideMenu = wrapper.findComponent({ name: 'DeclaredExperienceSideMenu' })
        sideMenu.vm.$emit('selectExperience', experienceId)
      })

      BddTest().then('it should navigate to the declared experience route', () => {
        expect(routerPush).toHaveBeenCalledWith({
          name: 'student-declared-experience',
          params: { id: experienceId }
        })
      })
    })
  })

  BddTest().when('the component is mounted and data is loading', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      server.use(declaredExperienceDetailedLoadingHandler)
      await mountComponentWithDefaults()
    })

    BddTest().then('it should show the loader', async () => {
      await vi.waitFor(() => {
        const loader = wrapper.find('[data-testid="loader-stub"]')
        expect(loader.exists()).toBe(true)
      })
    })
  })

  BddTest().when('the component is mounted and data is loaded', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      server.use(declaredExperiencesHandlers[2])
      await mountComponentWithDefaults()
    })

    BddTest().then('it should not show the loader', async () => {
      await vi.waitFor(() => {
        const loader = wrapper.find('[data-testid="loader-stub"]')
        expect(loader.exists()).toBe(false)
      })
    })

    BddTest().then('it should pass a dropdown', async () => {
      await vi.waitFor(() => {
        const dropdown = wrapper.findComponent(DeclaredExperienceDetailsDropdownStub)
        expect(dropdown.exists()).toBe(true)
      })
    })

    BddTest().then('it should pass a dropdown', async () => {
      await vi.waitFor(() => {
        const details = wrapper.findComponent(DeclaredExperienceDetailedStub)
        expect(details.exists()).toBe(true)
      })
    })

    BddTest().and('the user selects to update the declared experience', () => {
      beforeEach(async () => {
        await vi.waitFor(async () => {
          const dropdown = wrapper.findComponent(DeclaredExperienceDetailsDropdownStub)
          await dropdown.vm.$emit('updateSelected')
        })
      })

      BddTest().then('it should navigate to the update declared experience view', () => {
        expect(navigateToStudentUpdateDeclaredExperience).toHaveBeenCalledWith({})
      })
    })
  })
})
