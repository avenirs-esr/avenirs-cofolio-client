import { mockedDeclaredProgramAssociations, mockedEmptyAssociations } from '@/__mocks__/fixtures/student/associations.fixtures'
import {
  declaredProgramDetailedErrorHandler,
  declaredProgramDetailedLoadingHandler,
  declaredProgramDetailedNotFoundHandler
} from '@/__mocks__/msw/handlers/student/declaredPrograms.handlers'
import { server } from '@/__mocks__/msw/server'
import { EAssociationContextType } from '@/api/avenir-esr'
import { DetailedPageTitleStub } from '@/common/components/DetailedPageTitle/DetailedPageTitle.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { ROUTES } from '@/common/constants'
import { ElementAssociationsStub } from '@/features/student/associations/components/composites/ElementAssociations/ElementAssociations.stub'
import { DeleteDeclaredProgramConfirmModalStub } from '@/features/student/personalCareer/components/overlays/DeleteDeclaredProgramConfirmModal/DeleteDeclaredProgramConfirmModal.stub'
import { DeclaredProgramDetailedStub } from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/components/DeclaredProgramDetailed/DeclaredProgramDetailed.stub'
import { ManageDeclaredProgramDropdownStub } from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/components/ManageDeclaredProgramDropdown/ManageDeclaredProgramDropdown.stub'
import { DeclaredProgramDetailedViewTabs } from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/DeclaredProgramDetailedView.types'
import DeclaredProgramDetailedView from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/DeclaredProgramDetailedView.vue'
import { AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'

const GENERIC_ERROR_TITLE = 'Une erreur est survenue. Veuillez réessayer ultérieurement.'

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

BddTest().given('a declared program detailed view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramDetailedView>>

  const associationsCount = mockedDeclaredProgramAssociations.traceAssociations.length
    + mockedDeclaredProgramAssociations.declaredSkillAssociations.length
    + mockedDeclaredProgramAssociations.declaredExperienceAssociations.length

  const mountWith = async (programId = 'declared-program-1') => {
    route.params.id = programId
    wrapper = mountComponent(DeclaredProgramDetailedView, {
      global: { stubs }
    })
  }

  const getPageTitle = () => wrapper.findComponent(DetailedPageTitleStub)
  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getQuerySuspenseLoader = () => wrapper.find('[data-testid="query-suspense-loading"]')
  const getQuerySuspenseError = () => wrapper.find('[data-testid="query-suspense-error"]')
  const getDeclaredProgramDetailed = () => wrapper.findComponent(DeclaredProgramDetailedStub)
  const getManageDropdown = () => wrapper.findComponent(ManageDeclaredProgramDropdownStub)
  const getDeleteModal = () => wrapper.findComponent(DeleteDeclaredProgramConfirmModalStub)
  const getAvTabs = () => wrapper.findComponent(AvTabsStub)
  const getActiveAvTab = () => wrapper.findComponent(AvTabStub)
  const getElementAssociations = () => wrapper.findComponent(ElementAssociationsStub)

  const selectTab = async (tab: DeclaredProgramDetailedViewTabs) => {
    await vi.waitFor(() => {
      expect(getAvTabs().exists()).toBe(true)
    })
    getAvTabs().vm.$emit('update:modelValue', tab)
    await flushPromises()
  }

  const selectDropdownAction = async (action: 'update' | 'delete') => {
    await vi.waitFor(() => {
      expect(getManageDropdown().exists()).toBe(true)
    })
    getManageDropdown().vm.$emit(action)
    await flushPromises()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockModalOpened.value = false
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should render DetailedPageTitle with the program title and trailing links', async () => {
      await vi.waitFor(() => {
        expect(getPageTitle().props('title')).toBe('Formation déclarée 1')
        expect(getPageTitle().props('trailingLinks')).toEqual([{ text: 'Formation déclarée 1' }])
      })
    })

    BddTest().then('it should not render the query suspense error', async () => {
      await vi.waitFor(() => {
        expect(getDeclaredProgramDetailed().exists()).toBe(true)
      })
      expect(getQuerySuspenseError().exists()).toBe(false)
    })

    BddTest().then('it should render the manage declared program dropdown', async () => {
      await vi.waitFor(() => {
        expect(getManageDropdown().exists()).toBe(true)
      })
    })

    BddTest().then('it should render AvTabs', async () => {
      await vi.waitFor(() => {
        expect(getAvTabs().exists()).toBe(true)
      })
    })

    BddTest().then('it should render the details tab by default', async () => {
      await vi.waitFor(() => {
        expect(getActiveAvTab().props('title')).toBe('Ma formation déclarée')
      })
    })

    BddTest().then('it should render DeclaredProgramDetailed in the details tab', async () => {
      await vi.waitFor(() => {
        expect(getDeclaredProgramDetailed().props('declaredProgramDetailed').title).toBe('Formation déclarée 1')
      })
    })

    BddTest().and('the associations tab is selected', () => {
      beforeEach(async () => {
        await selectTab(DeclaredProgramDetailedViewTabs.ASSOCIATIONS)
      })

      BddTest().then('it should render ElementAssociations with the program associations', async () => {
        await vi.waitFor(() => {
          const elementAssociations = getElementAssociations()

          expect(elementAssociations.exists()).toBe(true)
          expect(elementAssociations.props('contextType')).toBe(EAssociationContextType.DECLARED_PROGRAM)
          expect(elementAssociations.props('elementId')).toBe('declared-program-1')
          expect(elementAssociations.props('associations')).toEqual(mockedDeclaredProgramAssociations)
          expect(elementAssociations.props('error')).toBeNull()
          expect(elementAssociations.props('readonly')).toBe(false)
        })
      })

      BddTest().then('it should display the count of associations in the tab title', async () => {
        await vi.waitFor(() => {
          expect(getActiveAvTab().props('title')).toBe(`Mes associations (${associationsCount})`)
        })
      })
    })

    BddTest().and('the user selects the update option from the manage dropdown', () => {
      beforeEach(async () => {
        await selectDropdownAction('update')
      })

      BddTest().then('it should navigate to the update declared program route', () => {
        expect(navigateToStudentUpdateDeclaredProgram).toHaveBeenCalledTimes(1)
      })
    })

    BddTest().and('the user selects the delete option from the manage dropdown', () => {
      beforeEach(async () => {
        await selectDropdownAction('delete')
      })

      BddTest().then('it should display the delete declared program confirmation modal', () => {
        expect(mockOpenModal).toHaveBeenCalledTimes(1)
      })

      BddTest().and('the user closes the delete confirmation modal', () => {
        beforeEach(async () => {
          getDeleteModal().vm.$emit('close')
          await flushPromises()
        })

        BddTest().then('it should hide the delete declared program confirmation modal', () => {
          expect(mockCloseModal).toHaveBeenCalledTimes(1)
        })
      })

      BddTest().and('the user confirms deletion in the delete confirmation modal', () => {
        beforeEach(async () => {
          getDeleteModal().vm.$emit('confirm')
          await flushPromises()
        })

        BddTest().then('it should hide the delete declared program confirmation modal', () => {
          expect(mockCloseModal).toHaveBeenCalledTimes(1)
        })

        BddTest().then('it should navigate to the declared programs list route', () => {
          expect(navigateToStudentDeclaredPrograms).toHaveBeenCalledWith({ replace: true })
        })
      })
    })
  })

  BddTest().when('the component is mounted with another program id', () => {
    beforeEach(async () => {
      await mountWith('declared-program-2')
    })

    BddTest().then('it should render the title and details of that program', async () => {
      await vi.waitFor(() => {
        expect(getPageTitle().props('title')).toBe('Formation déclarée 2')
        expect(getDeclaredProgramDetailed().props('declaredProgramDetailed').title).toBe('Formation déclarée 2')
      })
    })
  })

  BddTest().when('the component is mounted and data is loading', () => {
    beforeEach(async () => {
      server.use(declaredProgramDetailedLoadingHandler)
      await mountWith()
    })

    BddTest().then('it should show the loader', async () => {
      await vi.waitFor(() => {
        expect(getQuerySuspenseLoader().exists()).toBe(true)
      })
    })

    BddTest().then('it should not render the tabs', () => {
      expect(getAvTabs().exists()).toBe(false)
    })
  })

  BddTest().when('the program query fails', () => {
    beforeEach(async () => {
      server.use(declaredProgramDetailedErrorHandler)
      await mountWith()
    })

    BddTest().then('it should render the query suspense generic error', async () => {
      await vi.waitFor(() => {
        expect(getQuerySuspenseError().exists()).toBe(true)
        expect(getQuerySuspense().props('errorTitle')).toBe(GENERIC_ERROR_TITLE)
      })
    })

    BddTest().then('it should not render the program details nor the tabs', async () => {
      await vi.waitFor(() => {
        expect(getQuerySuspenseError().exists()).toBe(true)
      })
      expect(getDeclaredProgramDetailed().exists()).toBe(false)
      expect(getAvTabs().exists()).toBe(false)
    })
  })

  BddTest().when('the program query fails with DECLARED_PROGRAM_NOT_FOUND', () => {
    beforeEach(async () => {
      server.use(declaredProgramDetailedNotFoundHandler)
      await mountWith()
    })

    BddTest().then('it should render the query suspense not found error', async () => {
      await vi.waitFor(() => {
        expect(getQuerySuspenseError().exists()).toBe(true)
        expect(getQuerySuspense().props('errorTitle')).toBe('Formation déclarée introuvable')
        expect(getQuerySuspense().props('errorDescription')).toBe('La formation déclarée que vous recherchez n\'existe pas ou n\'est pas accessible.')
      })
    })

    BddTest().then('it should still render DetailedPageTitle', async () => {
      await vi.waitFor(() => {
        expect(getPageTitle().exists()).toBe(true)
      })
    })

    BddTest().then('it should not render the program content', async () => {
      await vi.waitFor(() => {
        expect(getQuerySuspenseError().exists()).toBe(true)
      })
      expect(getDeclaredProgramDetailed().exists()).toBe(false)
      expect(getManageDropdown().exists()).toBe(false)
      expect(getAvTabs().exists()).toBe(false)
      expect(getElementAssociations().exists()).toBe(false)
    })
  })

  BddTest().when('the associations query returns empty data', () => {
    beforeEach(async () => {
      await mountWith('declared-program-WITHOUT_ASSOCIATIONS')
      await selectTab(DeclaredProgramDetailedViewTabs.ASSOCIATIONS)
    })

    BddTest().then('it should render ElementAssociations with empty associations', async () => {
      await vi.waitFor(() => {
        const elementAssociations = getElementAssociations()

        expect(elementAssociations.exists()).toBe(true)
        expect(elementAssociations.props('elementId')).toBe('declared-program-WITHOUT_ASSOCIATIONS')
        expect(elementAssociations.props('associations')).toEqual(mockedEmptyAssociations)
        expect(elementAssociations.props('error')).toBeNull()
      })
    })

    BddTest().then('it should display no association in the tab title', async () => {
      await vi.waitFor(() => {
        expect(getActiveAvTab().props('title')).toBe('Mes associations (0)')
      })
    })
  })

  BddTest().when('the declared program query fails', () => {
    beforeEach(async () => {
      await mountWith('INVALID_PROGRAM_ID')
    })

    BddTest().then('it should pass the declared program error to QuerySuspense', async () => {
      await vi.waitFor(() => {
        expect(getQuerySuspense().props('error')).toBeTruthy()
      })
    })

    BddTest().then('it should not render tabs', async () => {
      await vi.waitFor(() => {
        expect(getAvTabs().exists()).toBe(false)
      })
    })
  })
})
