import { declaredProgramDetailedHandler } from '@/__mocks__/msw/handlers/student/declaredPrograms.handlers'
import { server } from '@/__mocks__/msw/server'
import { UpdateInProgressBadgeStub } from '@/common/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.stub'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { UpdatePageTitleStub } from '@/common/components/UpdatePageTitle/UpdatePageTitle.stub'
import { ROUTES } from '@/common/constants'
import DeclaredProgramUpdateView from '@/features/student/personalCareer/views/DeclaredProgramUpdateView/DeclaredProgramUpdateView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'

const routerReplace = vi.fn()

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
    id: ''
  },
})

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()

  return {
    ...actual,
    onBeforeRouteLeave: vi.fn(),
    useRoute: () => route,
    useRouter: () => ({
      replace: routerReplace
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
  UpdatePageTitle: UpdatePageTitleStub,
  DeclaredProgramUpdateForm: DeclaredProgramUpdateFormStub,
  ConfirmationModal: ConfirmationModalStub,
  UpdateInProgressBadge: UpdateInProgressBadgeStub
}

BddTest().given('a declared program update view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramUpdateView>>

  const mountComponentWithDefaults = async () => {
    server.use(declaredProgramDetailedHandler)

    wrapper = mountComponent(DeclaredProgramUpdateView, {
      global: { stubs }
    })

    await flushPromises()
  }

  const getConfirmationModal = () => wrapper.findComponent(ConfirmationModalStub)
  const getForm = () => wrapper.findComponent(DeclaredProgramUpdateFormStub)

  beforeEach(() => {
    vi.clearAllMocks()
    route.params.id = 'declared-program-1'

    confirmationModalOpened.value = false

    mockCanLeave.mockResolvedValue(true)
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      await mountComponentWithDefaults()
    })

    BddTest().then('it should render UpdatePageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent(UpdatePageTitleStub)

      expect(pageTitle.exists()).toBe(true)
      expect(pageTitle.props('trailingLinks')).toHaveLength(2)
    })

    BddTest().then('it should build the title using the selected program title', async () => {
      await vi.waitFor(() => {
        const pageTitle = wrapper.findComponent(UpdatePageTitleStub)
        expect(String(pageTitle.props('title'))).toContain('Formation déclarée 1')
      })
    })

    BddTest().then('it should always render the wip badge', () => {
      const badge = wrapper.findComponent(UpdateInProgressBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('show')).toBe(true)
    })

    BddTest().and('when the form becomes dirty', () => {
      beforeEach(async () => {
        const form = getForm()
        expect(form.exists()).toBe(true)

        form.vm.$emit('dirtyChange', true)
        await nextTick()
        await flushPromises()
      })

      BddTest().then('it should keep rendering the wip badge', () => {
        const badge = wrapper.findComponent(UpdateInProgressBadgeStub)

        expect(badge.exists()).toBe(true)
        expect(badge.props('show')).toBe(true)
      })
    })

    BddTest().then('it should render the confirmation modal closed by default', () => {
      const modal = getConfirmationModal()

      expect(modal.exists()).toBe(true)
      expect(modal.props('opened')).toBe(false)
      expect(modal.props('description')).toBe('Les modifications non enregistrées seront perdues.')
    })
  })

  BddTest().when('the component is mounted with an id param', () => {
    beforeEach(async () => {
      route.params.id = 'declared-program-2'
      await mountComponentWithDefaults()
    })

    BddTest().then('it should render title for that program', async () => {
      await vi.waitFor(() => {
        const pageTitle = wrapper.findComponent(UpdatePageTitleStub)
        expect(String(pageTitle.props('title'))).toContain('Formation déclarée 2')
      })
    })
  })
})
