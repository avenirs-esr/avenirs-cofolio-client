import type { DeclaredProgramViewDTO } from '@/api/avenir-esr'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import { UpdateInProgressBadgeStub } from '@/features/student/global/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.stub'
import { DeclaredProgramSideMenuStub } from '@/features/student/personalCareer/components/navigation/DeclaredProgramSideMenu/DeclaredProgramSideMenu.stub'
import DeclaredProgramUpdateView from '@/features/student/personalCareer/views/DeclaredProgramUpdateView/DeclaredProgramUpdateView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'

const routerPush = vi.fn()
const mockRouteId = ref<string>('')

const showConfirmationModal = ref(false)
const displayConfirmationModal = vi.fn(() => {
  showConfirmationModal.value = true
})
const hideConfirmationModal = vi.fn(() => {
  showConfirmationModal.value = false
})

vi.mock('@/common/composables/use-modal/use-modal', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables/use-modal/use-modal')>()
  return {
    ...actual,
    useModal: () => ({
      showModal: showConfirmationModal,
      displayModal: displayConfirmationModal,
      hideModal: hideConfirmationModal
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

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()

  return {
    ...actual,
    onBeforeRouteLeave: vi.fn(),
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

const DeclaredProgramUpdateFormStub = {
  name: 'DeclaredProgramUpdateForm',
  props: ['declaredProgramDetailed'],
  emits: ['dirtyChange', 'programUpdated', 'cancel'],
  template: `<div data-testid="declared-program-update-form-stub"></div>`
}

const stubs = {
  PageTitle: PageTitleStub,
  DeclaredProgramSideMenu: DeclaredProgramSideMenuStub,
  DeclaredProgramUpdateForm: DeclaredProgramUpdateFormStub,
  ConfirmationModal: ConfirmationModalStub,
  UpdateInProgressBadge: UpdateInProgressBadgeStub
}

BddTest().given('a declared program update view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramUpdateView>>

  const mountComponentWithDefaults = async () => {
    wrapper = mountComponent(DeclaredProgramUpdateView, {
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

  const getConfirmationModal = () => wrapper.findComponent({ name: 'ConfirmationModal' })
  const getForm = () => wrapper.findComponent({ name: 'DeclaredProgramUpdateForm' })

  beforeEach(() => {
    vi.clearAllMocks()
    mockRouteId.value = 'declared-program-1'

    showConfirmationModal.value = false

    mockCanLeave.mockResolvedValue(true)
  })

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      await mountComponentWithDefaults()
    })

    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.exists()).toBe(true)
      expect(pageTitle.props('back')).toStrictEqual({
        name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED.name,
        params: { id: 'declared-program-1' }
      })

      const breadcrumbLinks = pageTitle.props('breadcrumbLinks') as Array<{ text: string, to?: string }>
      expect(breadcrumbLinks).toHaveLength(3)
      expect(breadcrumbLinks[0]).toEqual({ text: 'Accueil', to: ROUTES.STUDENT.HOME })
      expect(breadcrumbLinks[1]).toEqual({ text: 'Construire mon projet de vie' })
      expect(breadcrumbLinks[2]).toEqual({ text: 'Mon parcours' })
    })

    BddTest().then('it should build the title using the selected program title', async () => {
      await vi.waitFor(() => {
        const pageTitle = wrapper.findComponent({ name: 'PageTitle' })
        expect(String(pageTitle.props('title'))).toContain('Modifier Formation déclarée 1')
      })
    })

    BddTest().then('it should not render the wip badge by default', () => {
      const badge = wrapper.findComponent(UpdateInProgressBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('show')).toBe(false)
    })

    BddTest().and('when the form becomes dirty', () => {
      beforeEach(async () => {
        const form = getForm()
        expect(form.exists()).toBe(true)

        form.vm.$emit('dirtyChange', true)
        await nextTick()
        await flushPromises()
      })

      BddTest().then('it should render the wip badge', () => {
        const badge = wrapper.findComponent(UpdateInProgressBadgeStub)

        expect(badge.exists()).toBe(true)
        expect(badge.props('show')).toBe(true)
      })
    })

    BddTest().then('it should render the side menu with correct props', () => {
      const sideMenu = getSideMenu()
      const programs = getSideMenuPrograms()

      expect(sideMenu.exists()).toBe(true)
      expect(sideMenu.props('selectedProgramId')).toBe('declared-program-1')
      expect(sideMenu.props('countPrograms')).toBe(60)

      expect(programs).toHaveLength(3)
      expect(programs[0].title).toBe('Formation déclarée 1')
      expect(programs[1].title).toBe('Formation déclarée 2')
      expect(programs[2].title).toBe('Formation déclarée 3')
    })

    BddTest().then('it should render the confirmation modal closed by default', () => {
      const modal = getConfirmationModal()

      expect(modal.exists()).toBe(true)
      expect(modal.props('show')).toBe(false)
      expect(modal.props('description')).toBe('Les modifications non enregistrées seront perdues.')
    })

    BddTest().and('selecting a program from the side menu when canLeave is true', () => {
      let secondProgramId: string

      beforeEach(async () => {
        mockCanLeave.mockResolvedValue(true)

        const sideMenu = getSideMenu()
        const programs = getSideMenuPrograms()
        secondProgramId = programs[1].id

        sideMenu.vm.$emit('selectProgram', secondProgramId)
        await nextTick()
        await flushPromises()
      })

      BddTest().then('it should navigate immediately and not open the modal', () => {
        expect(routerPush).toHaveBeenCalledWith({
          name: ROUTES.STUDENT.PERSONAL_CAREER_UPDATE_DECLARED_PROGRAM.name,
          params: { id: secondProgramId }
        })
        expect(displayConfirmationModal).not.toHaveBeenCalled()
      })
    })

    BddTest().and('selecting a program from the side menu when canLeave is false', () => {
      let secondProgramId: string

      beforeEach(async () => {
        mockCanLeave.mockImplementation(async () => {
          displayConfirmationModal()
          return false
        })

        const sideMenu = getSideMenu()
        const programs = getSideMenuPrograms()
        secondProgramId = programs[1].id

        sideMenu.vm.$emit('selectProgram', secondProgramId)
        await nextTick()
        await flushPromises()
      })

      BddTest().then('it should open the confirmation modal and not navigate', () => {
        const modal = getConfirmationModal()

        expect(displayConfirmationModal).toHaveBeenCalledTimes(1)
        expect(modal.props('show')).toBe(true)
        expect(routerPush).not.toHaveBeenCalled()
      })

      BddTest().and('closing the modal', () => {
        beforeEach(async () => {
          const modal = getConfirmationModal()
          modal.vm.$emit('close')
          await nextTick()
          await flushPromises()
        })

        BddTest().then('it should call guard cancel and not navigate', () => {
          const modal = getConfirmationModal()

          expect(mockCancel).toHaveBeenCalledTimes(1)
          expect(modal.props('show')).toBe(true)
          expect(routerPush).not.toHaveBeenCalled()
        })
      })

      BddTest().and('confirming the modal', () => {
        beforeEach(async () => {
          const modal = getConfirmationModal()
          modal.vm.$emit('confirm')
          await nextTick()
          await flushPromises()
        })

        BddTest().then('it should call guard confirm', () => {
          expect(mockConfirm).toHaveBeenCalledTimes(1)
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
          expect(programs.length).toBeGreaterThan(3)
        })

        const programs = getSideMenuPrograms()
        expect(programs).toHaveLength(6)
        expect(programs[3].title).toBe('Formation déclarée 4')
        expect(programs[4].title).toBe('Formation déclarée 5')
      })

      BddTest().then('it should accumulate programs without duplicates', async () => {
        await vi.waitFor(() => {
          const programs = getSideMenuPrograms()
          expect(programs.length).toBe(6)
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

    BddTest().then('it should render title for that program', async () => {
      await vi.waitFor(() => {
        const pageTitle = wrapper.findComponent({ name: 'PageTitle' })
        expect(String(pageTitle.props('title'))).toContain('Modifier Formation déclarée 2')
      })
    })

    BddTest().then('it should render PageTitle back props with the route param id', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.props('back')).toStrictEqual({
        name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED.name,
        params: { id: 'declared-program-2' }
      })
    })
  })
})
