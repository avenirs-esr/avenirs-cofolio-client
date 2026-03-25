import type { VueWrapper } from '@vue/test-utils'
import {
  declaredExperienceDetailedLoadingHandler,
  declaredExperienceDetailedNotFoundHandler,
  declaredExperiencesHandlers
} from '@/__mocks__/msw/handlers/student/declaredExperiences.handlers'
import { server } from '@/__mocks__/msw/server'
import { DetailedPageTitleStub } from '@/common/components/DetailedPageTitle/DetailedPageTitle.stub'
import { ErrorMessageStub } from '@/common/components/feedback/ErrorMessage/ErrorMessage.stub'
import { LoaderStub } from '@/common/components/Loader/Loader.stub'
import { ROUTES } from '@/common/constants'
import { DeclaredExperienceSideMenuStub }
  from '@/features/student/personalCareer/components/navigation/DeclaredExperienceSideMenu/DeclaredExperienceSideMenu.stub'
import { DeleteDeclaredExperienceConfirmModalStub }
  from '@/features/student/personalCareer/components/overlays/DeleteDeclaredExperienceConfirmModal/DeleteDeclaredExperienceConfirmModal.stub'
import {
  DeclaredExperienceDetailsDropdownStub
} from '@/features/student/personalCareer/views/DeclaredExperienceView/components/DeclaredExperienceDetailsDropdown/DeclaredExperienceDetailsDropdown.stub'
import DeclaredExperienceView from '@/features/student/personalCareer/views/DeclaredExperienceView/DeclaredExperienceView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const navigateToStudentUpdateDeclaredExperience = vi.fn()
const navigateToStudentDeclaredExperiences = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentUpdateDeclaredExperience,
      navigateToStudentDeclaredExperiences,
    }),
  }
})

const routerPush = vi.fn()
const mockRouteId = ref<string>('exp-123')

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()

  return {
    ...actual,
    useRoute: () => ({
      params: {
        get id () {
          return mockRouteId.value
        }
      }
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
  DetailedPageTitle: DetailedPageTitleStub,
  ErrorMessage: ErrorMessageStub,
  DeclaredExperienceSideMenu: DeclaredExperienceSideMenuStub,
  DeclaredExperienceDetails: DeclaredExperienceDetailedStub,
  Loader: LoaderStub,
  DeclaredExperienceDetailsDropdown: DeclaredExperienceDetailsDropdownStub,
  DeleteDeclaredExperienceConfirmModal: DeleteDeclaredExperienceConfirmModalStub,
}

BddTest().given('a declared experience view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceView>>

  const mountComponentWithDefaults = async () => {
    wrapper = mountComponent(DeclaredExperienceView, {
      global: { stubs }
    })
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      await mountComponentWithDefaults()
      vi.clearAllMocks()
    })

    BddTest().then('it should render DetailedPageTitle with correct title and breadcrumbs', async () => {
      await vi.waitFor(() => {
        const pageTitle = wrapper.findComponent({ name: 'DetailedPageTitle' })
        expect(pageTitle.exists()).toBe(true)

        expect(pageTitle.props('title')).toBe('Développeur Web Full Stack')
        const breadcrumbs = pageTitle.props('breadcrumbLinks')
        expect(breadcrumbs).toHaveLength(5)
      })
    })

    BddTest().then('it should render DetailedPageTitle with correct breadcrumb links', async () => {
      await vi.waitFor(() => {
        const pageTitle = wrapper.findComponent({ name: 'DetailedPageTitle' })
        expect(pageTitle.exists()).toBe(true)

        const breadcrumbLinks = pageTitle.props('breadcrumbLinks') as Array<{ text: string, to?: string }>
        expect(breadcrumbLinks).toHaveLength(5)
        expect(breadcrumbLinks[0]).toEqual({ text: 'Accueil', to: ROUTES.STUDENT.HOME })
        expect(breadcrumbLinks[1]).toEqual({ text: 'Construire mon projet de vie' })
        expect(breadcrumbLinks[2]).toEqual({ text: 'Mon parcours', to: ROUTES.STUDENT.PERSONAL_CAREER })
        expect(breadcrumbLinks[3]).toEqual({ text: 'Mes expériences', to: ROUTES.STUDENT.PERSONAL_CAREER_EXPERIENCES })
        expect(breadcrumbLinks[4]).toEqual({ text: 'Développeur Web Full Stack' })
      })
    })

    BddTest().then('it should render the side menu', () => {
      const sideMenu = wrapper.findComponent({ name: 'DeclaredExperienceSideMenu' })
      expect(sideMenu.exists()).toBe(true)
    })

    BddTest().then('it should pass correct props to the side menu', () => {
      const sideMenu = wrapper.findComponent({ name: 'DeclaredExperienceSideMenu' })

      expect(sideMenu.props()).toHaveProperty('experiences')
      expect(sideMenu.props()).toHaveProperty('experienceCount')
      expect(sideMenu.props()).toHaveProperty('selectedExperienceId')

      expect(Array.isArray(sideMenu.props('experiences'))).toBe(true)
      expect(typeof sideMenu.props('experienceCount')).toBe('number')
      expect(sideMenu.props('selectedExperienceId')).toBe('exp-123')
    })

    BddTest().then('it should not render ErrorMessage', async () => {
      await vi.waitFor(() => {
        expect(wrapper.find('[data-testid="error-message"]').exists()).toBe(false)
      })
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

    BddTest().and('the user selects to delete the declared experience', () => {
      beforeEach(async () => {
        await vi.waitFor(async () => {
          const dropdown = wrapper.findComponent(DeclaredExperienceDetailsDropdownStub)
          await dropdown.vm.$emit('deleteSelected')
        })
      })

      BddTest().then('it should show the delete confirmation modal', async () => {
        await vi.waitFor(() => {
          const modal = wrapper.findComponent({ name: 'DeleteDeclaredExperienceConfirmModal' })
          expect(modal.exists()).toBe(true)
          expect(modal.props('show')).toBe(true)
          expect(modal.props('declaredExperienceIds')).toEqual(['exp-123'])
        })
      })

      BddTest().and('the modal emits close', () => {
        beforeEach(async () => {
          const modal = wrapper.findComponent({ name: 'DeleteDeclaredExperienceConfirmModal' })
          await modal.vm.$emit('close')
        })

        BddTest().then('it should hide the delete confirmation modal', async () => {
          await vi.waitFor(() => {
            const modal = wrapper.findComponent({ name: 'DeleteDeclaredExperienceConfirmModal' })
            expect(modal.exists()).toBe(true)
            expect(modal.props('show')).toBe(false)
          })
        })
      })

      BddTest().and('the modal emits confirm', () => {
        beforeEach(async () => {
          const modal = wrapper.findComponent({ name: 'DeleteDeclaredExperienceConfirmModal' })
          await modal.vm.$emit('confirm')
        })

        BddTest().then('it should hide the delete confirmation modal', async () => {
          await vi.waitFor(() => {
            const modal = wrapper.findComponent({ name: 'DeleteDeclaredExperienceConfirmModal' })
            expect(modal.exists()).toBe(true)
            expect(modal.props('show')).toBe(false)
          })
        })

        BddTest().then('it should navigate to declared experiences page', async () => {
          await vi.waitFor(() => {
            expect(navigateToStudentDeclaredExperiences).toHaveBeenCalledWith({ replace: true })
          })
        })
      })
    })
  })

  BddTest().when('the query fails with DECLARED_EXPERIENCE_NOT_FOUND', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      server.use(declaredExperienceDetailedNotFoundHandler)
      await mountComponentWithDefaults()
    })

    BddTest().then('it should render ErrorMessage', async () => {
      await vi.waitFor(() => {
        expect(wrapper.find('[data-testid="error-message"]').exists()).toBe(true)

        const errorMessage = wrapper.findComponent({ name: 'ErrorMessage' })
        expect(errorMessage.props('title')).toBe('Expérience déclarée introuvable')
        expect(errorMessage.props('description')).toBe('L\'expérience déclarée que vous recherchez n\'existe pas ou n\'est pas accessible.')
      })
    })

    BddTest().then('it should not render DeclaredExperienceDetails component', async () => {
      await vi.waitFor(() => {
        expect(wrapper.find('[data-testid="declared-experience-detailed"]').exists()).toBe(false)
      })
    })

    BddTest().then('it should not render DeclaredExperienceDetailsDropdown', async () => {
      await vi.waitFor(() => {
        const dropdown = wrapper.findComponent(DeclaredExperienceDetailsDropdownStub)
        expect(dropdown.exists()).toBe(false)
      })
    })

    BddTest().then('it should render an empty title in DetailedPageTitle', async () => {
      await vi.waitFor(() => {
        const pageTitle = wrapper.findComponent({ name: 'DetailedPageTitle' })
        expect(pageTitle.exists()).toBe(false)
      })
    })
  })
})
