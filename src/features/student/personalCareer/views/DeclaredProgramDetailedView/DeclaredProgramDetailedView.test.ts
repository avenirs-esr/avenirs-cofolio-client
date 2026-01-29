import type { DeclaredProgramViewDTO } from '@/api/avenir-esr'
import { declaredProgramDetailedHandler, declaredProgramDetailedLoadingHandler, declaredProgramsQueryErrorHandler } from '@/__mocks__/msw/handlers/student/declaredPrograms.handlers'
import { server } from '@/__mocks__/msw/server'
import { LoaderStub } from '@/common/components/Loader/Loader.stub'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import { DeclaredProgramSideMenuStub } from '@/features/student/personalCareer/components/navigation/DeclaredProgramSideMenu/DeclaredProgramSideMenu.stub'
import { DeleteDeclaredProgramConfirmModalStub } from '@/features/student/personalCareer/components/overlays/DeleteDeclaredProgramConfirmModal/DeleteDeclaredProgramConfirmModal.stub'
import { ManageDeclaredProgramDropdownStub } from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/components/ManageDeclaredProgramDropdown/ManageDeclaredProgramDropdown.stub'
import DeclaredProgramDetailedView from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/DeclaredProgramDetailedView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'

const routerPush = vi.fn()
const mockRouteId = ref<string>('')
const mockShowModal = ref(false)
const mockDisplayModal = vi.fn()
const mockHideModal = vi.fn()
const navigateToStudentUpdateDeclaredProgram = vi.fn()
const navigateToStudentDeclaredPrograms = vi.fn()

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

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useModal: () => ({
      showModal: mockShowModal,
      displayModal: mockDisplayModal,
      hideModal: mockHideModal
    }),
    useNavigation: () => ({
      navigateToStudentUpdateDeclaredProgram,
      navigateToStudentDeclaredPrograms
    }),
  }
})

const DeclaredProgramDetailedStub = defineComponent({
  name: 'DeclaredProgramDetailed',
  props: ['declaredProgramDetailed'],
  template: '<div data-testid="declared-program-detailed" />'
})

const stubs = {
  PageTitle: PageTitleStub,
  DeclaredProgramSideMenu: DeclaredProgramSideMenuStub,
  DeclaredProgramDetailed: DeclaredProgramDetailedStub,
  Loader: LoaderStub,
  ManageDeclaredProgramDropdown: ManageDeclaredProgramDropdownStub,
  DeleteDeclaredProgramConfirmModal: DeleteDeclaredProgramConfirmModalStub
}

BddTest().given('a declared program detailed view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramDetailedView>>

  const mountComponentWithDefaults = async () => {
    server.use(declaredProgramDetailedHandler)

    wrapper = mountComponent(DeclaredProgramDetailedView, {
      global: { stubs }
    })

    await vi.waitFor(() => {
      const sideMenu = wrapper.findComponent({ name: 'DeclaredProgramSideMenu' })
      const programs = sideMenu.props('programs') as DeclaredProgramViewDTO[]
      expect(programs.length).toBeGreaterThan(0)
    })
  }

  const getSideMenu = () => wrapper.findComponent({ name: 'DeclaredProgramSideMenu' })

  const getSideMenuPrograms = () => {
    const sideMenu = getSideMenu()
    return sideMenu.props('programs') as DeclaredProgramViewDTO[]
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockRouteId.value = 'declared-program-1'
  })

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      await mountComponentWithDefaults()
    })

    BddTest().then('it should render DetailedPageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent({ name: 'DetailedPageTitle' })
      expect(pageTitle.exists()).toBe(true)
      expect(pageTitle.props('back')).toBe(ROUTES.STUDENT.PROJECT_SKILLS)

      const breadcrumbLinks = pageTitle.props('breadcrumbLinks') as Array<{ text: string, to?: string }>
      expect(breadcrumbLinks).toHaveLength(4)
      expect(breadcrumbLinks[0]).toEqual({ text: 'Accueil', to: ROUTES.STUDENT.HOME })
      expect(breadcrumbLinks[1]).toEqual({ text: 'Construire mon projet de vie' })
      expect(breadcrumbLinks[2]).toEqual({ text: 'Mon parcours', to: ROUTES.STUDENT.PERSONAL_CAREER })
      expect(breadcrumbLinks[3]).toEqual({ text: 'Mes formations', to: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAMS })
    })

    BddTest().then('it should build the title using the selected program title', async () => {
      await vi.waitFor(() => {
        const pageTitle = wrapper.findComponent({ name: 'DetailedPageTitle' })
        expect(String(pageTitle.props('title'))).toContain('Formation déclarée 1')
      })
    })

    BddTest().then('it should render the side menu with correct props', () => {
      const sideMenu = getSideMenu()
      const programs = getSideMenuPrograms()

      expect(sideMenu.exists()).toBe(true)
      expect(sideMenu.props('selectedProgramId')).toBe('declared-program-1')
      expect(sideMenu.props('countPrograms')).toBe(60)

      expect(programs).toHaveLength(4)
      expect(programs[0].title).toBe('Formation déclarée 1')
      expect(programs[1].title).toBe('Formation déclarée 2')
      expect(programs[2].title).toBe('Formation déclarée 3')
      expect(programs[3].title).toBe('Formation déclarée 4')
    })

    BddTest().then('it should render program details when a program is selected', async () => {
      await vi.waitFor(() => {
        const details = wrapper.findComponent({ name: 'DeclaredProgramDetailed' })
        expect(details.exists()).toBe(true)
        expect(details.props('declaredProgramDetailed')).toBeDefined()
        expect(details.props('declaredProgramDetailed').title).toBe('Formation déclarée 1')
      })
    })

    BddTest().then('it should render the manage declared program dropdown', () => {
      const dropdown = wrapper.findComponent(ManageDeclaredProgramDropdownStub)
      expect(dropdown.exists()).toBe(true)
    })

    BddTest().and('the user selects the update option from the manage dropdown', () => {
      beforeEach(() => {
        const dropdown = wrapper.findComponent(ManageDeclaredProgramDropdownStub)
        dropdown.vm.$emit('updateSelected')
      })

      BddTest().then('it should navigate to the update declared program route', () => {
        expect(navigateToStudentUpdateDeclaredProgram).toHaveBeenCalled()
      })
    })

    BddTest().and('the user selects the delete option from the manage dropdown', () => {
      beforeEach(() => {
        const dropdown = wrapper.findComponent(ManageDeclaredProgramDropdownStub)
        dropdown.vm.$emit('deleteSelected')
      })

      BddTest().then('it should display the delete declared program confirmation modal', () => {
        expect(mockDisplayModal).toHaveBeenCalled()
      })

      BddTest().and('the users closes the delete confirmation modal', () => {
        beforeEach(() => {
          wrapper.findComponent(DeleteDeclaredProgramConfirmModalStub).vm.$emit('close')
        })

        BddTest().then('it should hide the delete declared program confirmation modal', () => {
          expect(mockHideModal).toHaveBeenCalled()
        })
      })

      BddTest().and('the user confirms deletion in the delete confirmation modal', () => {
        beforeEach(() => {
          wrapper.findComponent(DeleteDeclaredProgramConfirmModalStub).vm.$emit('confirm')
        })

        BddTest().then('it should navigate to the declared programs list route', () => {
          expect(navigateToStudentDeclaredPrograms).toHaveBeenCalled()
        })

        BddTest().then('it should hide the delete declared program confirmation modal', () => {
          expect(mockHideModal).toHaveBeenCalled()
        })
      })
    })

    BddTest().and('selecting a program from the side menu', () => {
      let secondProgramId: string

      beforeEach(async () => {
        const sideMenu = getSideMenu()
        const programs = getSideMenuPrograms()
        secondProgramId = programs[1].id

        sideMenu.vm.$emit('selectProgram', secondProgramId)
        await nextTick()
        await flushPromises()
      })

      BddTest().then('it should navigate to the route with the selected id', () => {
        expect(routerPush).toHaveBeenCalledWith({
          name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED.name,
          params: { id: secondProgramId }
        })
      })

      BddTest().and('the route param is updated (simulating navigation)', () => {
        beforeEach(async () => {
          mockRouteId.value = secondProgramId
          await nextTick()
          await flushPromises()
        })

        BddTest().then('it should update selectedProgramId in the side menu', () => {
          const sideMenu = getSideMenu()
          expect(sideMenu.props('selectedProgramId')).toBe(secondProgramId)
        })

        BddTest().then('it should update the PageTitle title with the new program title', async () => {
          await vi.waitFor(() => {
            const pageTitle = wrapper.findComponent({ name: 'DetailedPageTitle' })
            expect(String(pageTitle.props('title'))).toContain('Formation déclarée 2')
          })
        })

        BddTest().then('it should update the program details', async () => {
          await vi.waitFor(() => {
            const details = wrapper.findComponent({ name: 'DeclaredProgramDetailed' })
            expect(details.exists()).toBe(true)
            expect(details.props('declaredProgramDetailed').title).toBe('Formation déclarée 2')
          })
        })
      })
    })

    BddTest().and('loading more programs from the side menu', () => {
      beforeEach(async () => {
        const sideMenu = getSideMenu()
        sideMenu.vm.$emit('loadMorePrograms')
        await flushPromises()
      })

      BddTest().then('it should fetch the next page of programs', async () => {
        await vi.waitFor(() => {
          const programs = getSideMenuPrograms()
          expect(programs.length).toBeGreaterThan(4)
        })

        const programs = getSideMenuPrograms()
        expect(programs).toHaveLength(8)
        expect(programs[4].title).toBe('Formation déclarée 5')
        expect(programs[5].title).toBe('Formation déclarée 6')
      })

      BddTest().then('it should accumulate programs without duplicates', async () => {
        await vi.waitFor(() => {
          const programs = getSideMenuPrograms()
          expect(programs.length).toBe(8)
        })

        const programs = getSideMenuPrograms()
        const uniqueIds = new Set(programs.map(p => p.id))
        expect(uniqueIds.size).toBe(programs.length)
      })
    })
  })

  BddTest().when('the component is mounted with an id param', () => {
    beforeEach(async () => {
      mockRouteId.value = 'declared-program-2'
      await mountComponentWithDefaults()
    })

    BddTest().then('it should set selectedProgramId from route params', () => {
      const sideMenu = getSideMenu()
      expect(sideMenu.props('selectedProgramId')).toBe('declared-program-2')
    })

    BddTest().then('it should render title and details for that program', async () => {
      await vi.waitFor(() => {
        const pageTitle = wrapper.findComponent({ name: 'DetailedPageTitle' })
        expect(String(pageTitle.props('title'))).toContain('Formation déclarée 2')
      })

      await vi.waitFor(() => {
        const details = wrapper.findComponent({ name: 'DeclaredProgramDetailed' })
        expect(details.exists()).toBe(true)
        expect(details.props('declaredProgramDetailed').title).toBe('Formation déclarée 2')
      })
    })
  })

  BddTest().when('the component is mounted and data is loading', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      server.use(declaredProgramDetailedLoadingHandler)

      wrapper = mountComponent(DeclaredProgramDetailedView, {
        global: { stubs }
      })
    })

    BddTest().then('it should show the loader', async () => {
      await vi.waitFor(() => {
        const loader = wrapper.find('[data-testid="loader-stub"]')
        expect(loader.exists()).toBe(true)
      })
    })
  })

  BddTest().when('the component is mounted and an error occurs during data fetching', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      server.use(declaredProgramsQueryErrorHandler)

      wrapper = mountComponent(DeclaredProgramDetailedView, {
        global: { stubs }
      })
    })

    BddTest().then('it should not render the detailed view', () => {
      const details = wrapper.findComponent({ name: 'DeclaredProgramDetailed' })
      expect(details.exists()).toBe(false)
    })
  })
})
