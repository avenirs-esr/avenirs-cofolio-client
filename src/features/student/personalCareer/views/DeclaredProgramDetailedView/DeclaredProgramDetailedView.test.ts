import { mockedDeclaredProgramAssociations } from '@/__mocks__/fixtures/student/associations.fixtures'
import {
  declaredProgramDetailedHandler,
  declaredProgramDetailedLoadingHandler,
  declaredProgramDetailedNotFoundHandler,
  declaredProgramsQueryErrorHandler,
} from '@/__mocks__/msw/handlers/student/declaredPrograms.handlers'
import { server } from '@/__mocks__/msw/server'
import { EAssociationContextType, EErrorCode } from '@/api/avenir-esr'
import { DetailedPageTitleStub } from '@/common/components/DetailedPageTitle/DetailedPageTitle.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { ROUTES } from '@/common/constants'
import { ElementAssociationsStub } from '@/features/student/associations/components/composites/ElementAssociations/ElementAssociations.stub'
import { DeleteDeclaredProgramConfirmModalStub } from '@/features/student/personalCareer/components/overlays/DeleteDeclaredProgramConfirmModal/DeleteDeclaredProgramConfirmModal.stub'
import { DeclaredProgramDetailedStub } from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/components/DeclaredProgramDetailed/DeclaredProgramDetailed.stub'
import { ManageDeclaredProgramDropdownStub } from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/components/ManageDeclaredProgramDropdown/ManageDeclaredProgramDropdown.stub'
import DeclaredProgramDetailedView from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/DeclaredProgramDetailedView.vue'
import { AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'

const routerReplace = vi.fn()
const mockModalOpened = ref(false)
const mockOpenModal = vi.fn(() => {
  mockModalOpened.value = true
})
const mockCloseModal = vi.fn(() => {
  mockModalOpened.value = false
})
const navigateToStudentUpdateDeclaredProgram = vi.fn()
const navigateToStudentDeclaredPrograms = vi.fn()
const mockIsMobile = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    useAvBreakpoints: () => ({
      isMobile: mockIsMobile,
    })
  }
})

const route = reactive<{ name: string, params: { id: string } }>({
  name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED.name,
  params: {
    id: ''
  },
})

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()

  return {
    ...actual,
    useRoute: () => route,
    useRouter: () => ({
      replace: routerReplace
    })
  }
})

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useModal: () => ({
      modalOpened: mockModalOpened,
      openModal: mockOpenModal,
      closeModal: mockCloseModal
    }),
    useNavigation: () => ({
      navigateToStudentUpdateDeclaredProgram,
      navigateToStudentDeclaredPrograms
    }),
  }
})

const stubs = {
  DetailedPageTitle: DetailedPageTitleStub,
  DeclaredProgramDetailed: DeclaredProgramDetailedStub,
  ManageDeclaredProgramDropdown: ManageDeclaredProgramDropdownStub,
  DeleteDeclaredProgramConfirmModal: DeleteDeclaredProgramConfirmModalStub,
  QuerySuspense: QuerySuspenseStub,
  ElementAssociations: ElementAssociationsStub,
  AvTabs: AvTabsStub,
  AvTab: AvTabStub
}

async function activateAssociationsTab (wrapper: VueWrapper<InstanceType<typeof DeclaredProgramDetailedView>>) {
  await vi.waitFor(async () => {
    const tabs = wrapper.findComponent(AvTabsStub)
    expect(tabs.exists()).toBe(true)
    await tabs.vm.$emit('update:modelValue', 1)
  })
}

BddTest().given('a declared program detailed view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramDetailedView>>

  const mountComponentWithDefaults = async () => {
    server.use(declaredProgramDetailedHandler)

    wrapper = mountComponent(DeclaredProgramDetailedView, {
      global: { stubs }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    route.params.id = 'declared-program-1'
    mockModalOpened.value = false
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      await mountComponentWithDefaults()
    })

    BddTest().then('it should render DetailedPageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent(DetailedPageTitleStub)
      expect(pageTitle.exists()).toBe(true)

      expect(pageTitle.props('trailingLinks')).toHaveLength(1)
    })

    BddTest().then('it should build the title using the selected program title', async () => {
      await vi.waitFor(() => {
        const pageTitle = wrapper.findComponent(DetailedPageTitleStub)
        expect(String(pageTitle.props('title'))).toContain('Formation déclarée 1')
      })
    })

    BddTest().then('it should not render the query suspense error', async () => {
      await vi.waitFor(() => {
        expect(wrapper.find('[data-testid="query-suspense-error"]').exists()).toBe(false)
      })
    })

    BddTest().then('it should render program details when a program is selected', async () => {
      await vi.waitFor(() => {
        const details = wrapper.findComponent({ name: 'DeclaredProgramDetailed' })
        expect(details.exists()).toBe(true)
        expect(details.props('declaredProgramDetailed')).toBeDefined()
        expect(details.props('declaredProgramDetailed').title).toBe('Formation déclarée 1')
      })
    })

    BddTest().then('it should render the details tab by default', async () => {
      await vi.waitFor(() => {
        const activeTab = wrapper.findComponent(AvTabStub)
        expect(activeTab.exists()).toBe(true)
        expect(activeTab.props('title')).toBe('Ma formation déclarée')
      })
    })

    BddTest().then('it should render the associations of the declared program when the associations tab is active', async () => {
      await activateAssociationsTab(wrapper)

      await vi.waitFor(() => {
        const elementAssociations = wrapper.findComponent(ElementAssociationsStub)

        expect(elementAssociations.exists()).toBe(true)
        expect(elementAssociations.props('contextType')).toBe(EAssociationContextType.DECLARED_PROGRAM)
        expect(elementAssociations.props('elementId')).toBe('declared-program-1')
        expect(elementAssociations.props('associations')).toEqual(mockedDeclaredProgramAssociations)
        expect(elementAssociations.props('error')).toBeNull()
      })

      expect(wrapper.findComponent(AvTabStub).props('title')).toBe('Mes associations (3)')
    })

    BddTest().then('it should render the manage declared program dropdown', async () => {
      await vi.waitFor(() => {
        const dropdown = wrapper.findComponent(ManageDeclaredProgramDropdownStub)
        expect(dropdown.exists()).toBe(true)
      })
    })

    BddTest().and('the user selects the update option from the manage dropdown', () => {
      beforeEach(async () => {
        await vi.waitFor(() => {
          const dropdown = wrapper.findComponent(ManageDeclaredProgramDropdownStub)
          expect(dropdown.exists()).toBe(true)
        })

        const dropdown = wrapper.findComponent(ManageDeclaredProgramDropdownStub)
        await dropdown.vm.$emit('update')
      })

      BddTest().then('it should navigate to the update declared program route', () => {
        expect(navigateToStudentUpdateDeclaredProgram).toHaveBeenCalled()
      })
    })

    BddTest().and('the user selects the delete option from the manage dropdown', () => {
      beforeEach(async () => {
        await vi.waitFor(() => {
          const dropdown = wrapper.findComponent(ManageDeclaredProgramDropdownStub)
          expect(dropdown.exists()).toBe(true)
        })

        const dropdown = wrapper.findComponent(ManageDeclaredProgramDropdownStub)
        await dropdown.vm.$emit('delete')
      })

      BddTest().then('it should display the delete declared program confirmation modal', () => {
        expect(mockOpenModal).toHaveBeenCalled()
      })

      BddTest().and('the users closes the delete confirmation modal', () => {
        beforeEach(async () => {
          const modal = wrapper.findComponent(DeleteDeclaredProgramConfirmModalStub)
          await modal.vm.$emit('close')
        })

        BddTest().then('it should hide the delete declared program confirmation modal', () => {
          expect(mockCloseModal).toHaveBeenCalled()
        })
      })

      BddTest().and('the user confirms deletion in the delete confirmation modal', () => {
        beforeEach(async () => {
          const modal = wrapper.findComponent(DeleteDeclaredProgramConfirmModalStub)
          await modal.vm.$emit('confirm')
        })

        BddTest().then('it should navigate to the declared programs list route', () => {
          expect(navigateToStudentDeclaredPrograms).toHaveBeenCalled()
        })

        BddTest().then('it should hide the delete declared program confirmation modal', () => {
          expect(mockCloseModal).toHaveBeenCalled()
        })
      })
    })
  })

  BddTest().when('the component is mounted with an id param', () => {
    beforeEach(async () => {
      route.params.id = 'declared-program-2'
      await mountComponentWithDefaults()
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

  BddTest().when('the associations query fails', () => {
    beforeEach(async () => {
      route.params.id = 'INVALID_PROGRAM_ID'
      await mountComponentWithDefaults()
    })

    BddTest().then('it should pass the associations error to the element associations', async () => {
      await activateAssociationsTab(wrapper)

      await vi.waitFor(() => {
        const elementAssociations = wrapper.findComponent(ElementAssociationsStub)

        expect(elementAssociations.exists()).toBe(true)
        expect(elementAssociations.props('error')).toEqual(expect.objectContaining({ code: EErrorCode.DECLARED_PROGRAM_NOT_FOUND }))
        expect(elementAssociations.props('associations')).toBeUndefined()
      })

      expect(wrapper.findComponent(AvTabStub).props('title')).toBe('Mes associations (0)')
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
        const loader = wrapper.find('[data-testid="query-suspense-loading"]')
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

  BddTest().when('the query fails with DECLARED_PROGRAM_NOT_FOUND', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      server.use(declaredProgramDetailedNotFoundHandler)

      wrapper = mountComponent(DeclaredProgramDetailedView, {
        global: { stubs }
      })

      await flushPromises()
    })

    BddTest().then('it should render the query suspense error', async () => {
      await vi.waitFor(() => {
        expect(wrapper.find('[data-testid="query-suspense-error"]').exists()).toBe(true)

        const errorMessage = wrapper.findComponent(QuerySuspenseStub)
        expect(errorMessage.props('errorTitle')).toBe('Programme déclaré introuvable')
        expect(errorMessage.props('errorDescription')).toBe('Le programme déclaré que vous recherchez n\'existe pas ou n\'est pas accessible.')
      })
    })

    BddTest().then('it should still render DetailedPageTitle', async () => {
      await vi.waitFor(() => {
        const pageTitle = wrapper.findComponent({ name: 'DetailedPageTitle' })
        expect(pageTitle.exists()).toBe(true)
      })
    })

    BddTest().then('it should not render DeclaredProgramDetailed component', async () => {
      await vi.waitFor(() => {
        expect(wrapper.find('[data-testid="declared-program-detailed"]').exists()).toBe(false)
      })
    })

    BddTest().then('it should not render ManageDeclaredProgramDropdown', async () => {
      await vi.waitFor(() => {
        const dropdown = wrapper.findComponent(ManageDeclaredProgramDropdownStub)
        expect(dropdown.exists()).toBe(false)
      })
    })
  })
})
