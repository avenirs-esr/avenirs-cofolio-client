import { mockedDeclaredProgramAssociations, mockedEmptyAssociations } from '@/__mocks__/fixtures/student/associations.fixtures'
import { EAssociationContextType } from '@/api/avenir-esr'
import { UpdateInProgressBadgeStub } from '@/common/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.stub'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { UpdatePageTitleStub } from '@/common/components/UpdatePageTitle/UpdatePageTitle.stub'
import { ROUTES } from '@/common/constants'
import { ElementAssociationsStub } from '@/features/student/associations/components/composites/ElementAssociations/ElementAssociations.stub'
import { DeclaredProgramUpdateFormStub } from '@/features/student/personalCareer/views/DeclaredProgramUpdateView/components/DeclaredProgramUpdateForm/DeclaredProgramUpdateForm.stub'
import { DeclaredProgramUpdateViewTabs } from '@/features/student/personalCareer/views/DeclaredProgramUpdateView/DeclaredProgramUpdateView.types'
import DeclaredProgramUpdateView from '@/features/student/personalCareer/views/DeclaredProgramUpdateView/DeclaredProgramUpdateView.vue'
import { AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'

const DEFAULT_PROGRAM_ID = 'declared-program-1'

const routerPush = vi.fn()

const confirmationModalOpened = ref(false)
const openConfirmationModal = vi.fn(() => {
  confirmationModalOpened.value = true
})
const closeConfirmationModal = vi.fn(() => {
  confirmationModalOpened.value = false
})
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

vi.mock('@/common/composables/use-modal/use-modal', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables/use-modal/use-modal')>()
  return {
    ...actual,
    useModal: () => ({
      modalOpened: confirmationModalOpened,
      openModal: openConfirmationModal,
      closeModal: closeConfirmationModal
    })
  }
})

const mockCanLeave = vi.fn<() => Promise<boolean>>()
const mockConfirm = vi.fn()
const mockCancel = vi.fn()

vi.mock('@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard')
  >()
  return {
    ...actual,
    useUnsavedChangesGuard: () => ({
      canLeave: mockCanLeave,
      confirm: mockConfirm,
      cancel: mockCancel
    })
  }
})

const route = reactive<{ name: string, params: { id: string } }>({
  name: ROUTES.STUDENT.PERSONAL_CAREER_UPDATE_DECLARED_PROGRAM.name,
  params: {
    id: DEFAULT_PROGRAM_ID
  },
})

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()

  return {
    ...actual,
    onBeforeRouteLeave: vi.fn(),
    useRoute: () => route,
    useRouter: () => ({
      push: routerPush
    })
  }
})

const stubs = {
  QuerySuspense: QuerySuspenseStub,
  UpdatePageTitle: UpdatePageTitleStub,
  UpdateInProgressBadge: UpdateInProgressBadgeStub,
  DeclaredProgramUpdateForm: DeclaredProgramUpdateFormStub,
  ConfirmationModal: ConfirmationModalStub,
  ElementAssociations: ElementAssociationsStub,
  AvTabs: AvTabsStub,
  AvTab: AvTabStub
}

BddTest().given('a declared program update view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramUpdateView>>

  const associationsCount = mockedDeclaredProgramAssociations.traceAssociations.length
    + mockedDeclaredProgramAssociations.declaredSkillAssociations.length
    + mockedDeclaredProgramAssociations.declaredExperienceAssociations.length

  const getDeclaredProgramDetailedRoute = (programId = DEFAULT_PROGRAM_ID) => ({
    name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED.name,
    params: { id: programId }
  })

  const mountWith = async (programId = DEFAULT_PROGRAM_ID) => {
    route.params.id = programId
    wrapper = mountComponent(DeclaredProgramUpdateView, {
      global: { stubs }
    })
    await flushPromises()
  }

  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getPageTitle = () => wrapper.findComponent(UpdatePageTitleStub)
  const getBadge = () => wrapper.findComponent(UpdateInProgressBadgeStub)
  const getForm = () => wrapper.findComponent(DeclaredProgramUpdateFormStub)
  const getConfirmationModal = () => wrapper.findComponent(ConfirmationModalStub)
  const getAvTabs = () => wrapper.findComponent(AvTabsStub)
  const getActiveAvTab = () => wrapper.findComponent(AvTabStub)
  const getElementAssociations = () => wrapper.findComponent(ElementAssociationsStub)

  const selectTab = async (tab: DeclaredProgramUpdateViewTabs) => {
    getAvTabs().vm.$emit('update:modelValue', tab)
    await flushPromises()
  }

  const emitFromForm = async (event: 'dirtyChange' | 'programUpdated' | 'cancel', ...args: unknown[]) => {
    await vi.waitFor(() => {
      expect(getForm().exists()).toBe(true)
    })
    getForm().vm.$emit(event, ...args)
    await flushPromises()
  }

  const emitFromConfirmationModal = async (event: 'confirm' | 'close') => {
    getConfirmationModal().vm.$emit(event)
    await flushPromises()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    confirmationModalOpened.value = false
    mockCanLeave.mockResolvedValue(true)
  })

  afterEach(() => {
    wrapper?.unmount()
    route.params.id = DEFAULT_PROGRAM_ID
  })

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should render UpdatePageTitle with the program title', async () => {
      await vi.waitFor(() => {
        expect(getPageTitle().props('title')).toBe('Formation déclarée 1')
      })
    })

    BddTest().then('it should link the declared program detailed view in the trailing links', async () => {
      await vi.waitFor(() => {
        const trailingLinks = getPageTitle().props('trailingLinks')

        expect(trailingLinks).toHaveLength(2)
        expect(trailingLinks![0]).toEqual({ text: 'Formation déclarée 1', to: getDeclaredProgramDetailedRoute() })
        expect(trailingLinks![1].text).toContain('Formation déclarée 1')
      })
    })

    BddTest().then('it should render QuerySuspense with the query state', async () => {
      await vi.waitFor(() => {
        expect(getQuerySuspense().exists()).toBe(true)
        expect(getQuerySuspense().props('isLoading')).toBe(false)
        expect(getQuerySuspense().props('error')).toBeNull()
      })
    })

    BddTest().then('it should always render the update in progress badge', () => {
      expect(getBadge().exists()).toBe(true)
      expect(getBadge().props('show')).toBe(true)
    })

    BddTest().then('it should render the confirmation modal closed by default', () => {
      const modal = getConfirmationModal()

      expect(modal.exists()).toBe(true)
      expect(modal.props('opened')).toBe(false)
      expect(modal.props('description')).toBe('Les modifications non enregistrées seront perdues.')
    })

    BddTest().then('it should render the details tab by default', () => {
      expect(getAvTabs().props('modelValue')).toBe(DeclaredProgramUpdateViewTabs.DETAILS)
      expect(getActiveAvTab().props('title')).toBe('Ma formation déclarée')
    })

    BddTest().then('it should render the update form with the program in the details tab', async () => {
      await vi.waitFor(() => {
        const form = getActiveAvTab().findComponent(DeclaredProgramUpdateFormStub)

        expect(form.exists()).toBe(true)
        expect(form.props('declaredProgramDetailed').title).toBe('Formation déclarée 1')
      })
    })

    BddTest().and('the form becomes dirty', () => {
      beforeEach(async () => {
        await emitFromForm('dirtyChange', true)
      })

      BddTest().then('it should keep rendering the update in progress badge', () => {
        expect(getBadge().exists()).toBe(true)
        expect(getBadge().props('show')).toBe(true)
      })
    })

    BddTest().and('the form emits cancel', () => {
      beforeEach(async () => {
        await emitFromForm('cancel')
      })

      BddTest().then('it should navigate to the declared program detailed view', () => {
        expect(routerPush).toHaveBeenCalledWith(getDeclaredProgramDetailedRoute())
      })
    })

    BddTest().and('the form emits programUpdated', () => {
      beforeEach(async () => {
        await emitFromForm('programUpdated')
      })

      BddTest().then('it should navigate to the declared program detailed view', () => {
        expect(routerPush).toHaveBeenCalledWith(getDeclaredProgramDetailedRoute())
      })
    })

    BddTest().and('the confirmation modal is confirmed', () => {
      beforeEach(async () => {
        await emitFromConfirmationModal('confirm')
      })

      BddTest().then('it should call guard confirm', () => {
        expect(mockConfirm).toHaveBeenCalledTimes(1)
      })
    })

    BddTest().and('the confirmation modal is closed', () => {
      beforeEach(async () => {
        await emitFromConfirmationModal('close')
      })

      BddTest().then('it should call guard cancel', () => {
        expect(mockCancel).toHaveBeenCalledTimes(1)
      })
    })

    BddTest().and('the associations tab is selected', () => {
      beforeEach(async () => {
        await selectTab(DeclaredProgramUpdateViewTabs.ASSOCIATIONS)
      })

      BddTest().then('it should render ElementAssociations with correct props in the associations tab', async () => {
        await vi.waitFor(() => {
          const elementAssociations = getActiveAvTab().findComponent(ElementAssociationsStub)

          expect(elementAssociations.exists()).toBe(true)
          expect(elementAssociations.props('contextType')).toBe(EAssociationContextType.DECLARED_PROGRAM)
          expect(elementAssociations.props('elementId')).toBe(DEFAULT_PROGRAM_ID)
          expect(elementAssociations.props('associations')).toEqual(mockedDeclaredProgramAssociations)
          expect(elementAssociations.props('error')).toBeNull()
        })
      })

      BddTest().then('it should render ElementAssociations as readonly', () => {
        expect(getElementAssociations().props('readonly')).toBe(true)
      })

      BddTest().then('it should include the associations count in the associations tab title', async () => {
        await vi.waitFor(() => {
          expect(getActiveAvTab().props('title')).toBe(`Mes associations (${associationsCount})`)
        })
      })
    })
  })

  BddTest().when('the component is mounted with another program id', () => {
    beforeEach(async () => {
      await mountWith('declared-program-2')
    })

    BddTest().then('it should render the title and the form of that program', async () => {
      await vi.waitFor(() => {
        expect(getPageTitle().props('title')).toBe('Formation déclarée 2')
        expect(getForm().props('declaredProgramDetailed').title).toBe('Formation déclarée 2')
      })
    })
  })

  BddTest().when('the declared program has no associations', () => {
    beforeEach(async () => {
      await mountWith('declared-program-WITHOUT_ASSOCIATIONS')
      await selectTab(DeclaredProgramUpdateViewTabs.ASSOCIATIONS)
    })

    BddTest().then('it should pass the empty associations to ElementAssociations', async () => {
      await vi.waitFor(() => {
        const elementAssociations = getElementAssociations()

        expect(elementAssociations.props('elementId')).toBe('declared-program-WITHOUT_ASSOCIATIONS')
        expect(elementAssociations.props('associations')).toEqual(mockedEmptyAssociations)
        expect(elementAssociations.props('error')).toBeNull()
      })
    })

    BddTest().then('it should display a zero associations count in the associations tab title', async () => {
      await vi.waitFor(() => {
        expect(getElementAssociations().props('associations')).toEqual(mockedEmptyAssociations)
      })

      expect(getActiveAvTab().props('title')).toBe('Mes associations (0)')
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
