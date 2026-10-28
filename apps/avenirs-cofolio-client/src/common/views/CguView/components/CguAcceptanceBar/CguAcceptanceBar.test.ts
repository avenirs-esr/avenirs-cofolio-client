import type { VueWrapper } from '@vue/test-utils'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { mockAddErrorMessage } from 'tests/mocks'
import { getAvButtonByTestId } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { mockedAcceptedCgu } from '@/__mocks__/fixtures/shared/cgu.fixtures'
import { acceptCguErrorHandler } from '@/__mocks__/msw/handlers/shared/cgu.handlers'
import { server } from '@/__mocks__/msw/server'
import { ConfirmationModalStub } from '@/common/components/overlay/modals/ConfirmationModal/ConfirmationModal.stub'
import { ROUTES } from '@/common/constants'
import CguAcceptanceBar from '@/common/views/CguView/components/CguAcceptanceBar/CguAcceptanceBar.vue'

const BUTTON_ACCEPT_LABEL = 'Accepter les CGU'
const BUTTON_REFUSE_LABEL = 'Refuser les CGU'
const MODAL_CLOSE_LABEL = 'Annuler'
const MODAL_CONFIRM_LABEL = 'Me déconnecter'
const MODAL_DESCRIPTION = 'Sans acceptation des nouvelles conditions générales d\'utilisation, vous ne pourrez plus utiliser Cofolio. Si vous confirmez, vous serez déconnecté.'
const MODAL_TITLE = 'Refuser les conditions générales d\'utilisation ?'

const { mockInvalidateSession, mockResolve, mockRoute, mockRouterReplace, mockSetAcceptedCgu, mockWindowLocationAssign } = vi.hoisted(() => ({
  mockInvalidateSession: vi.fn(),
  mockResolve: vi.fn(),
  mockRoute: { query: {} as Record<string, unknown> },
  mockRouterReplace: vi.fn(),
  mockSetAcceptedCgu: vi.fn(),
  mockWindowLocationAssign: vi.fn(),
}))

const mockHasAcceptedLatestCgu = ref(false)
const mockHomeRoute = ref(ROUTES.STUDENT.HOME.name)

vi.mock('@/features/auth/global/composables/use-current-user-session/use-current-user-session', () => ({
  useCurrentUserSession: () => ({
    homeRoute: mockHomeRoute,
    cgu: {
      hasAcceptedLatest: mockHasAcceptedLatestCgu,
      setAccepted: mockSetAcceptedCgu,
    },
  }),
}))

vi.mock('@/features/auth/global/stores/auth.store', () => ({
  useAuthStore: () => ({
    invalidateSession: mockInvalidateSession,
  }),
}))

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage,
    }),
  }
})

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => ({
    replace: mockRouterReplace,
    resolve: mockResolve,
  }),
}))

Object.defineProperty(window, 'location', {
  value: { assign: mockWindowLocationAssign },
  writable: true,
  configurable: true,
})

BddTest().given('a cgu acceptance bar', () => {
  let wrapper: VueWrapper<InstanceType<typeof CguAcceptanceBar>>

  const stubs = {
    AvButton: AvButtonStub,
    ConfirmationModal: ConfirmationModalStub,
  }

  const mountWith = ({
    hasAcceptedLatest = false,
    query = {}
  }: {
    hasAcceptedLatest?: boolean
    query?: Record<string, unknown>
  } = {}) => {
    mockHasAcceptedLatestCgu.value = hasAcceptedLatest
    mockRoute.query = query

    wrapper = mountComponent(CguAcceptanceBar, {
      global: { stubs }
    })
  }

  const getAcceptanceBar = () => wrapper.find('[data-testid="cgu-acceptance-bar"]')
  const getSpacer = () => wrapper.find('.cgu-acceptance-spacer')
  const getAcceptButton = () => getAvButtonByTestId(wrapper, 'cgu-accept-button')
  const getRefuseButton = () => getAvButtonByTestId(wrapper, 'cgu-refuse-button')
  const getRefusalModal = () => wrapper.findComponent(ConfirmationModalStub)

  beforeEach(() => {
    vi.clearAllMocks()
    mockResolve.mockImplementation((path: string) => ({
      matched: [{}],
      fullPath: path
    }))
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  BddTest().when('the user has already accepted the latest cgu version', () => {
    beforeEach(() => {
      mountWith({
        hasAcceptedLatest: true
      })
    })

    BddTest().then('it should render neither the acceptance bar nor its spacer', () => {
      expect(getAcceptanceBar().exists()).toBe(false)
      expect(getSpacer().exists()).toBe(false)
    })
  })

  BddTest().when('the user has not accepted the latest cgu version', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the acceptance bar with both actions', () => {
      expect(getAcceptanceBar().exists()).toBe(true)
      expect(getAcceptButton().props('label')).toBe(BUTTON_ACCEPT_LABEL)
      expect(getRefuseButton().props('label')).toBe(BUTTON_REFUSE_LABEL)
    })

    BddTest().then('it should render a hidden spacer so that the bar does not cover the end of the page', () => {
      const spacer = getSpacer()
      expect(spacer.exists()).toBe(true)
      expect(spacer.attributes('aria-hidden')).toBe('true')
    })

    BddTest().then('it should not open the refusal modal by default', () => {
      expect(getRefusalModal().props('opened')).toBe(false)
    })

    BddTest().then('it should store the acceptance and redirect to the home route when accepting', async () => {
      await getAcceptButton().trigger('click')

      await vi.waitFor(() => {
        expect(mockSetAcceptedCgu).toHaveBeenCalledWith(mockedAcceptedCgu)
      })
      expect(mockRouterReplace).toHaveBeenCalledWith(mockHomeRoute.value)
    })

    BddTest().then('it should open the refusal confirmation modal without leaving when refusing', async () => {
      await getRefuseButton().trigger('click')

      const modal = getRefusalModal()
      expect(modal.props('opened')).toBe(true)
      expect(modal.props('title')).toBe(MODAL_TITLE)
      expect(modal.props('description')).toBe(MODAL_DESCRIPTION)
      expect(modal.props('confirmButtonLabel')).toBe(MODAL_CONFIRM_LABEL)
      expect(modal.props('closeButtonLabel')).toBe(MODAL_CLOSE_LABEL)

      expect(mockInvalidateSession).not.toHaveBeenCalled()
      expect(mockWindowLocationAssign).not.toHaveBeenCalled()
    })

    BddTest().then('it should invalidate the session and go to the logout url when the refusal is confirmed', async () => {
      await getRefuseButton().trigger('click')
      await getRefusalModal().vm.$emit('confirm')

      expect(mockInvalidateSession).toHaveBeenCalledTimes(1)
      expect(mockWindowLocationAssign).toHaveBeenCalledWith(__AUTH_LOGOUT_URL__)
    })

    BddTest().then('it should close the refusal modal and keep the session when it is dismissed', async () => {
      await getRefuseButton().trigger('click')

      const modal = getRefusalModal()
      await modal.vm.$emit('close')
      expect(modal.props('opened')).toBe(false)

      expect(mockInvalidateSession).not.toHaveBeenCalled()
      expect(mockWindowLocationAssign).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the user accepts the cgu with an intended destination', () => {
    beforeEach(() => {
      mountWith({
        query: {
          redirect: ROUTES.STUDENT.DELIVERABLES.path
        }
      })
    })

    BddTest().then('it should redirect to the intended destination', async () => {
      await getAcceptButton().trigger('click')

      await vi.waitFor(() => {
        expect(mockRouterReplace).toHaveBeenCalledWith(ROUTES.STUDENT.DELIVERABLES.path)
      })
    })
  })

  BddTest().when('the user accepts the cgu with an intended destination that matches no route', () => {
    beforeEach(() => {
      mockResolve.mockReturnValue({ matched: [], fullPath: '/nowhere' })
      mountWith({
        query: {
          redirect: '/nowhere'
        }
      })
    })

    BddTest().then('it should redirect to the home route instead', async () => {
      await getAcceptButton().trigger('click')

      await vi.waitFor(() => {
        expect(mockRouterReplace).toHaveBeenCalledWith(mockHomeRoute.value)
      })
    })
  })

  BddTest().when('the user accepts the cgu with an intended destination that is not a single path', () => {
    beforeEach(() => {
      mountWith({
        query: {
          redirect: ['/first', '/second']
        }
      })
    })

    BddTest().then('it should redirect to the home route instead', async () => {
      await getAcceptButton().trigger('click')

      await vi.waitFor(() => {
        expect(mockRouterReplace).toHaveBeenCalledWith(mockHomeRoute.value)
      })
    })
  })

  BddTest().when('the cgu acceptance fails', () => {
    beforeEach(() => {
      server.use(acceptCguErrorHandler)
      mountWith()
    })

    BddTest().then('it should display an error message and stay on the page', async () => {
      await getAcceptButton().trigger('click')

      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalled()
      })
      expect(mockSetAcceptedCgu).not.toHaveBeenCalled()
      expect(mockRouterReplace).not.toHaveBeenCalled()
    })
  })
})
