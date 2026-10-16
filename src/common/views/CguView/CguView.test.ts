import type { VueWrapper } from '@vue/test-utils'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mockAddErrorMessage } from 'tests/mocks'
import { getAvButtonByTestId, mountComponent } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { mockedAcceptedCgu, mockedCgu } from '@/__mocks__/fixtures/shared/cgu.fixtures'
import { acceptCguErrorHandler, cguQueryErrorHandler, cguQueryLoadingHandler } from '@/__mocks__/msw/handlers/shared/cgu.handlers'
import { server } from '@/__mocks__/msw/server'
import { QuerySuspenseStub } from '@/common/components/feedback/QuerySuspense/QuerySuspense.stub'
import { PageTitleStub } from '@/common/components/navigation/PageTitle/PageTitle.stub'
import { ConfirmationModalStub } from '@/common/components/overlay/modals/ConfirmationModal/ConfirmationModal.stub'
import { ROUTES } from '@/common/constants'
import CguView from '@/common/views/CguView/CguView.vue'

const TITLE = 'Conditions générales d\'utilisation'

const { mockRoute, mockRouterReplace, mockWindowLocationAssign, mockSetAcceptedCgu } = vi.hoisted(() => ({
  mockRoute: { query: {} as Record<string, unknown> },
  mockRouterReplace: vi.fn(),
  mockWindowLocationAssign: vi.fn(),
  mockSetAcceptedCgu: vi.fn(),
}))

const mockHasAcceptedLatestCgu = ref(true)
const mockHomeRoute = ref({ name: 'student-home' })

vi.mock('@/features/auth/global/composables/use-current-user/use-current-user', () => ({
  useCurrentUser: () => ({
    hasAcceptedLatestCgu: mockHasAcceptedLatestCgu,
    homeRoute: mockHomeRoute,
    setAcceptedCgu: mockSetAcceptedCgu,
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
    resolve: (path: string) => ({ matched: [{}], fullPath: path }),
  }),
}))

Object.defineProperty(window, 'location', {
  value: { assign: mockWindowLocationAssign },
  writable: true,
  configurable: true,
})

BddTest().given('a cgu view', () => {
  let wrapper: VueWrapper<InstanceType<typeof CguView>>

  const stubs = {
    AvButton: AvButtonStub,
    ConfirmationModal: ConfirmationModalStub,
    PageTitle: PageTitleStub,
    QuerySuspense: QuerySuspenseStub,
  }

  const mountDefault = () => {
    wrapper = mountComponent(CguView, { global: { stubs } })
  }

  const getPageTitle = () => wrapper.findComponent(PageTitleStub)
  const getVersion = () => wrapper.find('[data-testid="cgu-version"]')
  const getLastPublication = () => wrapper.find('[data-testid="cgu-last-publication"]')
  const getContent = () => wrapper.find('[data-testid="cgu-content"]')
  const getLoader = () => wrapper.find('[data-testid="query-suspense-loading"]')
  const getError = () => wrapper.find('[data-testid="query-suspense-error"]')
  const getAcceptanceBar = () => wrapper.find('[data-testid="cgu-acceptance-bar"]')
  const getRefusalModal = () => wrapper.findComponent(ConfirmationModalStub)

  beforeEach(() => {
    vi.clearAllMocks()
    mockHasAcceptedLatestCgu.value = true
    mockRoute.query = {}
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  BddTest().when('the latest cgu are loaded', () => {
    beforeEach(() => {
      mountDefault()
    })

    BddTest().then('it should render PageTitle with correct props', () => {
      expect(getPageTitle().props('title')).toBe(TITLE)
      expect(getPageTitle().props('trailingLinks')).toEqual([{ text: TITLE }])
    })

    BddTest().then('it should render the cgu version and its last publication date', async () => {
      await vi.waitFor(() => {
        expect(getVersion().text()).toBe(`Version ${mockedCgu.version}`)
      })
      expect(getLastPublication().text()).toBe('Dernière publication le 12 mars 2026')
    })

    BddTest().then('it should render the sanitized cgu content', async () => {
      await vi.waitFor(() => {
        expect(getContent().exists()).toBe(true)
      })
      expect(getContent().html()).toContain('Article 1 - Objet')
      expect(getError().exists()).toBe(false)
    })
  })

  BddTest().when('the latest cgu are loading', () => {
    beforeEach(() => {
      server.use(cguQueryLoadingHandler)
      mountDefault()
    })

    BddTest().then('it should render the loader', () => {
      expect(getLoader().exists()).toBe(true)
      expect(getContent().exists()).toBe(false)
    })
  })

  BddTest().when('the latest cgu fail to load', () => {
    beforeEach(() => {
      server.use(cguQueryErrorHandler)
      mountDefault()
    })

    BddTest().then('it should render the error message', async () => {
      await vi.waitFor(() => {
        expect(getError().exists()).toBe(true)
      })
      expect(getContent().exists()).toBe(false)
    })
  })

  BddTest().when('the user has already accepted the latest cgu version', () => {
    beforeEach(() => {
      mountDefault()
    })

    BddTest().then('it should not render the acceptance bar', () => {
      expect(getAcceptanceBar().exists()).toBe(false)
    })
  })

  BddTest().when('the logged in user has not accepted the latest cgu version', () => {
    beforeEach(() => {
      mockHasAcceptedLatestCgu.value = false
      mountDefault()
    })

    BddTest().then('it should render the acceptance bar with both actions', () => {
      expect(getAcceptanceBar().exists()).toBe(true)
      expect(getAvButtonByTestId(wrapper, 'cgu-accept-button').props('label')).toBe('Accepter les CGU')
      expect(getAvButtonByTestId(wrapper, 'cgu-refuse-button').props('label')).toBe('Refuser les CGU')
    })

    BddTest().then('it should not open the refusal modal by default', () => {
      expect(getRefusalModal().props('opened')).toBe(false)
    })

    BddTest().then('it should store the acceptance and redirect to the home route when accepting', async () => {
      await getAvButtonByTestId(wrapper, 'cgu-accept-button').trigger('click')

      await vi.waitFor(() => {
        expect(mockSetAcceptedCgu).toHaveBeenCalledWith(mockedAcceptedCgu)
      })
      expect(mockRouterReplace).toHaveBeenCalledWith(mockHomeRoute.value)
    })

    BddTest().then('it should open the refusal confirmation modal when refusing', async () => {
      await getAvButtonByTestId(wrapper, 'cgu-refuse-button').trigger('click')

      expect(getRefusalModal().props('opened')).toBe(true)
      expect(getRefusalModal().props('title')).toBe('Refuser les conditions générales d\'utilisation ?')
      expect(mockWindowLocationAssign).not.toHaveBeenCalled()
    })

    BddTest().then('it should log the user out when the refusal is confirmed', async () => {
      await getAvButtonByTestId(wrapper, 'cgu-refuse-button').trigger('click')
      await getRefusalModal().vm.$emit('confirm')

      expect(mockWindowLocationAssign).toHaveBeenCalledWith(__AUTH_LOGOUT_URL__)
    })

    BddTest().then('it should close the refusal modal when it is dismissed', async () => {
      await getAvButtonByTestId(wrapper, 'cgu-refuse-button').trigger('click')
      await getRefusalModal().vm.$emit('close')

      expect(getRefusalModal().props('opened')).toBe(false)
    })
  })

  BddTest().when('the logged in user accepts the cgu with an intended destination', () => {
    beforeEach(() => {
      mockHasAcceptedLatestCgu.value = false
      mockRoute.query = { redirect: ROUTES.STUDENT.DELIVERABLES.path }
      mountDefault()
    })

    BddTest().then('it should redirect to the intended destination', async () => {
      await getAvButtonByTestId(wrapper, 'cgu-accept-button').trigger('click')

      await vi.waitFor(() => {
        expect(mockRouterReplace).toHaveBeenCalledWith(ROUTES.STUDENT.DELIVERABLES.path)
      })
    })
  })

  BddTest().when('the cgu acceptance fails', () => {
    beforeEach(() => {
      mockHasAcceptedLatestCgu.value = false
      server.use(acceptCguErrorHandler)
      mountDefault()
    })

    BddTest().then('it should display an error message and stay on the page', async () => {
      await getAvButtonByTestId(wrapper, 'cgu-accept-button').trigger('click')

      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalled()
      })
      expect(mockSetAcceptedCgu).not.toHaveBeenCalled()
      expect(mockRouterReplace).not.toHaveBeenCalled()
    })
  })
})
