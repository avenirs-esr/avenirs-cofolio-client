import type { VueWrapper } from '@vue/test-utils'
import type { Ref } from 'vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ConfirmationModalStub, QuerySuspenseStub, UpdatePageTitleStub } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { mockedAlertConfigurationDTO } from '@/__mocks__/fixtures/global-alert.fixtures'
import { getAlertConfigErrorHandler } from '@/__mocks__/msw/handlers/global-alert.handlers'
import { server } from '@/__mocks__/msw/server'
import AlertUpdateView from '@/features/global-alert/views/AlertUpdateView/AlertUpdateView.vue'
import { AlertUpdateFormStub } from '@/features/global-alert/views/AlertUpdateView/components/forms/AlertUpdateForm/AlertUpdateForm.stub'

const GUARD_DESCRIPTION = 'Êtes-vous certain(e) de vouloir annuler les modifications\u00A0? Les changements non enregistrés seront perdus.'
const TITLE = 'Modifier l\'alerte globale'

const mockRouterBack = vi.fn()

const mockModalOpened = ref(false)
const mockOpenModal = vi.fn()
const mockCloseModal = vi.fn()

let mockGuardIsDirty: Ref<boolean>
const mockConfirm = vi.fn()
const mockCancel = vi.fn()
const mockUseUnsavedChangesGuard = vi.fn((options: { isDirty: Ref<boolean> }) => {
  mockGuardIsDirty = options.isDirty
  return {
    confirm: mockConfirm,
    cancel: mockCancel,
  }
})

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRouter: () => ({
      back: mockRouterBack,
    }),
  }
})

vi.mock('@avenirs-esr/shared', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/shared')>()
  return {
    ...actual,
    useModal: () => ({
      modalOpened: mockModalOpened,
      openModal: mockOpenModal,
      closeModal: mockCloseModal,
    }),
    useUnsavedChangesGuard: (options: { isDirty: Ref<boolean> }) => mockUseUnsavedChangesGuard(options),
  }
})

BddTest().given('an AlertUpdateView view', () => {
  let wrapper: VueWrapper<InstanceType<typeof AlertUpdateView>>

  const stubs = {
    AlertUpdateForm: AlertUpdateFormStub,
    ConfirmationModal: ConfirmationModalStub,
    QuerySuspense: QuerySuspenseStub,
    UpdatePageTitle: UpdatePageTitleStub,
  }

  const getPageTitle = () => wrapper.findComponent(UpdatePageTitleStub)
  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getForm = () => wrapper.findComponent(AlertUpdateFormStub)
  const getConfirmationModal = () => wrapper.findComponent(ConfirmationModalStub)

  const mountView = async () => {
    wrapper = mountComponent(AlertUpdateView, {
      global: { stubs },
    })
    await vi.waitFor(() => {
      expect(getQuerySuspense().props('isLoading')).toBe(false)
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockModalOpened.value = false
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  BddTest().when('the view is mounted', () => {
    beforeEach(async () => {
      await mountView()
    })

    BddTest().then('it should render the page title', () => {
      expect(getPageTitle().props()).toMatchObject({
        title: TITLE,
        trailingLinks: [{
          text: TITLE
        }]
      })
    })

    BddTest().then('it should render QuerySuspense with the query state', () => {
      expect(getQuerySuspense().props()).toMatchObject({
        isLoading: false,
        error: null
      })
    })

    BddTest().then('it should give the loaded alert to the form', () => {
      expect(getForm().props('alert')).toEqual(mockedAlertConfigurationDTO)
    })

    BddTest().then('it should connect the guard to the confirmation modal', () => {
      expect(mockUseUnsavedChangesGuard).toHaveBeenCalledWith(expect.objectContaining({
        openModal: mockOpenModal,
        closeModal: mockCloseModal
      }))
    })

    BddTest().then('it should render the confirmation modal closed by default', () => {
      expect(getConfirmationModal().props()).toMatchObject({
        opened: false,
        description: GUARD_DESCRIPTION
      })
    })

    BddTest().and('the form becomes dirty', () => {
      beforeEach(() => {
        getForm().vm.$emit('dirtyChange', true)
      })

      BddTest().then('it should guard the unsaved changes', () => {
        expect(mockGuardIsDirty.value).toBe(true)
      })
    })

    BddTest().and('the form emits cancel', () => {
      beforeEach(() => {
        getForm().vm.$emit('cancel')
      })

      BddTest().then('it should navigate back', () => {
        expect(mockRouterBack).toHaveBeenCalledTimes(1)
      })
    })

    BddTest().and('the form emits alertUpdated', () => {
      beforeEach(() => {
        getForm().vm.$emit('dirtyChange', true)
        getForm().vm.$emit('alertUpdated')
      })

      BddTest().then('it should release the guard', () => {
        expect(mockGuardIsDirty.value).toBe(false)
      })

      BddTest().then('it should navigate back', () => {
        expect(mockRouterBack).toHaveBeenCalledTimes(1)
      })
    })

    BddTest().and('the modal is opened', () => {
      beforeEach(async () => {
        mockModalOpened.value = true
        await flushPromises()
      })

      BddTest().then('it should display the confirmation modal', () => {
        expect(getConfirmationModal().props('opened')).toBe(true)
      })
    })

    BddTest().and('the confirmation modal is confirmed', () => {
      beforeEach(() => {
        getConfirmationModal().vm.$emit('confirm')
      })

      BddTest().then('it should call guard confirm', () => {
        expect(mockConfirm).toHaveBeenCalledTimes(1)
      })
    })

    BddTest().and('the confirmation modal is closed', () => {
      beforeEach(() => {
        getConfirmationModal().vm.$emit('close')
      })

      BddTest().then('it should call guard cancel', () => {
        expect(mockCancel).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().when('the alert query fails', () => {
    beforeEach(async () => {
      server.use(getAlertConfigErrorHandler)
      await mountView()
    })

    BddTest().then('it should pass the error to QuerySuspense', () => {
      expect(getQuerySuspense().props('error')).toBeTruthy()
    })

    BddTest().then('it should not render the form', () => {
      expect(getForm().exists()).toBe(false)
    })
  })
})
