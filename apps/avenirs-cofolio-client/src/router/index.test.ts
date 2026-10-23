import type { RouteLocationRaw } from 'vue-router'
import type { LoggedInUserDTO } from '@/api/avenir-esr'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useQueryClient } from '@tanstack/vue-query'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { afterEach, beforeAll, beforeEach, expect, vi } from 'vitest'
import { isNavigationFailure, NavigationFailureType, START_LOCATION } from 'vue-router'
import { ERole, EUniverse } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { invalidateRouteAccess } from '@/common/utils/route/access-state/route-access-state'
import { INVALID_UNIVERSE, UNIVERSE_CGU, UNIVERSE_HOME } from '@/features/auth/global/composables/use-current-user-session/use-current-user-session.constants'

interface UserState {
  isLoggedIn: boolean
  universes: EUniverse[]
  roles: ERole[]
  activeUniverse: EUniverse
  hasAcceptedLatestCgu: boolean
}

interface SetupOptions extends Partial<UserState> {
  isFirstNavigation?: boolean
}

const NOT_FOUND_ROUTE_NAME = 'NotFound'
const ROOT_ROUTE_NAME = 'home'

const UNKNOWN_PATH = '/this-page-does-not-exist'
const RESTRICTED_LOCATION_WITH_PARAMS = {
  ...ROUTES.STAFF.ADMIN.USER,
  params: {
    id: '42'
  }
}

const DEFAULT_USER: UserState = {
  isLoggedIn: true,
  universes: [EUniverse.STUDENT],
  roles: Object.values(ERole),
  activeUniverse: EUniverse.STUDENT,
  hasAcceptedLatestCgu: true,
}

const { mockEnsureSession, mockUseCurrentUserSession, mockSwitchUniverse, mockIsAuthorized } = vi.hoisted(() => ({
  mockEnsureSession: vi.fn(),
  mockUseCurrentUserSession: vi.fn(),
  mockSwitchUniverse: vi.fn(),
  mockIsAuthorized: vi.fn()
}))

const mockIsLoggedIn = ref(true)
const mockSession = ref<Pick<LoggedInUserDTO, 'roles' | 'universes'>>()

vi.mock('@/features/auth/global/stores/auth.store', () => ({
  useAuthStore: () => ({
    ensureSession: mockEnsureSession,
    get isLoggedIn () {
      return mockIsLoggedIn.value
    },
    get session () {
      return mockSession.value
    }
  })
}))

const mockRoles = ref<ERole[]>([])
const mockUniverses = ref<EUniverse[]>([])
const mockActiveUniverse = ref<EUniverse>(EUniverse.STUDENT)
const mockHasAcceptedLatestCgu = ref(true)

const mockSessionUniverse = computed(() =>
  mockUniverses.value.includes(mockActiveUniverse.value)
    ? mockActiveUniverse.value
    : mockUniverses.value[0]
)
const activeUniverse = computed(() => mockSessionUniverse.value ?? INVALID_UNIVERSE)
const hasActiveUniverse = computed(() => mockSessionUniverse.value !== undefined)
const homeRoute = computed(() =>
  mockSessionUniverse.value
    ? UNIVERSE_HOME[mockSessionUniverse.value]
    : ROUTES.AUTH.LOGIN
)
const cguRoute = computed(() =>
  mockSessionUniverse.value
    ? UNIVERSE_CGU[mockSessionUniverse.value]
    : ROUTES.AUTH.CGU
)

vi.mock('@/features/auth/global/composables/use-current-user-session/use-current-user-session', () => ({
  useCurrentUserSession: () => {
    mockUseCurrentUserSession()

    return {
      roles: mockRoles,
      universes: {
        available: mockUniverses,
        active: activeUniverse,
        hasActive: hasActiveUniverse,
        switch: mockSwitchUniverse
      },
      homeRoute,
      cgu: {
        hasAcceptedLatest: mockHasAcceptedLatestCgu,
        route: cguRoute
      }
    }
  }
}))

vi.mock('@/common/constants/route-restrictions', async (importOriginal) => {
  const { ROUTE_RESTRICTIONS } = await importOriginal<typeof import('@/common/constants/route-restrictions')>()
  const { STAFF } = ROUTE_RESTRICTIONS
  return {
    ROUTE_RESTRICTIONS: {
      ...ROUTE_RESTRICTIONS,
      STAFF: {
        ...STAFF,
        ADMIN: {
          ...STAFF.ADMIN,
          USER: {
            isAuthorized: mockIsAuthorized
          }
        }
      }
    }
  }
})

const { default: router } = await import('@/router')
const getCurrentRoute = () => router.currentRoute.value
const getCurrentRouteName = () => getCurrentRoute().name

BddTest().given('the application router', () => {
  const applyUserState = ({ isLoggedIn, universes, roles, activeUniverse, hasAcceptedLatestCgu }: UserState) => {
    mockIsLoggedIn.value = isLoggedIn
    mockUniverses.value = universes
    mockRoles.value = roles
    mockActiveUniverse.value = activeUniverse
    mockHasAcceptedLatestCgu.value = hasAcceptedLatestCgu
  }

  const setupWith = async ({ isFirstNavigation = false, ...user }: SetupOptions = {}) => {
    mockEnsureSession.mockReset().mockResolvedValue(undefined)
    mockIsAuthorized.mockReset().mockResolvedValue(true)

    applyUserState(DEFAULT_USER)
    await router.push(ROUTES.STUDENT.CGU)
    await router.isReady()

    mockSwitchUniverse.mockReset()
    mockUseCurrentUserSession.mockReset()
    applyUserState({
      ...DEFAULT_USER,
      ...user
    })

    if (isFirstNavigation) {
      router.currentRoute.value = START_LOCATION
    }
  }

  const setSession = (rights: typeof mockSession.value) => {
    mockIsLoggedIn.value = !!rights
    mockSession.value = rights && { ...rights }
    if (rights) {
      mockRoles.value = rights.roles
      mockUniverses.value = rights.universes
    }
  }

  const settle = async () => {
    for (let task = 0; task < 5; task++) {
      await new Promise(resolve => setTimeout(resolve))
      await Promise.allSettled(vi.mocked(router.replace).mock.results.map(({ value }) => value))
      await flushPromises()
    }
  }

  const resetSession = async () => {
    mockIsLoggedIn.value = false
    mockSession.value = undefined
    await settle()
  }

  const expectNotFoundAt = (location: RouteLocationRaw) => {
    expect(getCurrentRouteName()).toBe(NOT_FOUND_ROUTE_NAME)
    expect(getCurrentRoute().fullPath).toBe(router.resolve(location).fullPath)
  }

  beforeAll(() => {
    // vue-router `scrollBehavior` calls it on every navigation, jsdom does not implement it.
    window.scrollTo = vi.fn()
  })

  beforeEach(() => {
    vi.spyOn(router, 'replace')
  })

  afterEach(() => {
    vi.mocked(router.replace).mockRestore()
  })

  BddTest().when('the user has accepted the latest cgu version', () => {
    beforeEach(async () => {
      await setupWith()
    })

    BddTest().then('it should let the navigation through inside the student universe', async () => {
      await router.push(ROUTES.STUDENT.DELIVERABLES)

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.DELIVERABLES.name)
      expect(mockSwitchUniverse).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the user has not accepted the latest cgu version', () => {
    beforeEach(async () => {
      await setupWith({
        hasAcceptedLatestCgu: false
      })
    })

    BddTest().then('it should redirect to the cgu page while the layout record is reused', async () => {
      await router.push(ROUTES.STUDENT.DELIVERABLES)

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.CGU.name)
    })

    BddTest().then('it should keep the cgu page reachable without looping', async () => {
      await router.push(ROUTES.AUTH.CGU)
      await router.push(ROUTES.STUDENT.CGU)

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.CGU.name)
    })

    BddTest().then('it should send the user from the public auth cgu page to the cgu page of his universe', async () => {
      await router.push(ROUTES.AUTH.CGU)

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.CGU.name)
    })
  })

  BddTest().when('the revalidated session has not accepted the latest cgu version, unlike the restored one', () => {
    beforeEach(async () => {
      await setupWith()
      mockEnsureSession.mockImplementationOnce(async () => {
        mockHasAcceptedLatestCgu.value = false
      })
    })

    BddTest().then('it should redirect to the cgu page', async () => {
      await router.push(ROUTES.STUDENT.DELIVERABLES)

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.CGU.name)
    })
  })

  BddTest().when('no session is stored in the tab and the one established on the first page has not accepted the latest cgu version', () => {
    beforeEach(async () => {
      await setupWith({
        isLoggedIn: false,
        hasAcceptedLatestCgu: false
      })
    })

    BddTest().then('it should redirect to the cgu page', async () => {
      await router.push(ROUTES.STUDENT.DELIVERABLES)

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.CGU.name)
    })
  })

  BddTest().when('the active universe is not the one allowed on the page', () => {
    beforeEach(async () => {
      await setupWith({
        universes: [EUniverse.STAFF, EUniverse.STUDENT],
        activeUniverse: EUniverse.STAFF
      })
    })

    BddTest().then('it should switch to the universe allowed on the page and let the navigation through', async () => {
      await router.push(ROUTES.STUDENT.DELIVERABLES)

      expect(mockSwitchUniverse).toHaveBeenCalledWith(EUniverse.STUDENT)
      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.DELIVERABLES.name)
    })
  })

  BddTest().when('the page of another universe takes time to load', () => {
    const loadingGuard = vi.fn<() => Promise<void>>()
    let loadPage: () => void
    let removeLoadingGuard: () => void

    beforeEach(async () => {
      await setupWith({
        universes: [EUniverse.STAFF, EUniverse.STUDENT],
        activeUniverse: EUniverse.STAFF
      })
      loadingGuard.mockReset().mockImplementation(() => new Promise((resolve) => {
        loadPage = () => resolve()
      }))
      removeLoadingGuard = router.beforeResolve(loadingGuard)
    })

    afterEach(() => {
      removeLoadingGuard()
    })

    BddTest().then('it should switch the universe once the page is displayed, not while it loads', async () => {
      const navigation = router.push(ROUTES.STUDENT.DELIVERABLES)
      await vi.waitFor(() => expect(loadingGuard).toHaveBeenCalled())

      expect(mockSwitchUniverse).not.toHaveBeenCalled()

      loadPage()
      await navigation

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.DELIVERABLES.name)
      expect(mockSwitchUniverse).toHaveBeenCalledWith(EUniverse.STUDENT)
    })
  })

  BddTest().when('the navigation to a page of another universe does not end', () => {
    let removeAbortingGuard: () => void

    beforeEach(async () => {
      await setupWith({
        universes: [EUniverse.STAFF, EUniverse.STUDENT],
        activeUniverse: EUniverse.STAFF
      })

      removeAbortingGuard = router.beforeResolve(() => false)
    })

    afterEach(() => {
      removeAbortingGuard()
    })

    BddTest().then('it should stay on the current page without switching universe', async () => {
      await router.push(ROUTES.STUDENT.DELIVERABLES)

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.CGU.name)
      expect(mockSwitchUniverse).not.toHaveBeenCalled()
    })
  })

  BddTest().when('none of the user universes is allowed on the page', () => {
    beforeEach(async () => {
      await setupWith()
    })

    BddTest().then('it should display the not found page at the address of the page', async () => {
      await router.push(ROUTES.STAFF.HOME)

      expectNotFoundAt(ROUTES.STAFF.HOME)
      expect(mockSwitchUniverse).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the address of a page the user cannot access has encoded parameters, a query and a hash', () => {
    beforeEach(async () => {
      await setupWith()
      document.body.innerHTML = '<div id="top"></div>'
    })

    BddTest().then('it should display the not found page without changing the address', async () => {
      const location = {
        name: ROUTES.STAFF.ADMIN.GROUP.DEFAULT.name,
        params: {
          id: 'été 2026/2'
        },
        query: {
          tab: '2'
        },
        hash: '#top'
      }

      await router.push(location)

      expectNotFoundAt(location)
    })
  })

  BddTest().when('the address of a page the user cannot access cannot be decoded', () => {
    beforeEach(async () => {
      await setupWith()
    })

    BddTest().then('it should display the not found page all the same', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      await router.push('/staff/admin/group/50%')

      expect(getCurrentRouteName()).toBe(NOT_FOUND_ROUTE_NAME)
      warn.mockRestore()
    })
  })

  BddTest().when('the first navigation, to a page with an authorization callback, establishes the session', () => {
    beforeEach(async () => {
      await setupWith({
        isLoggedIn: false,
        universes: [EUniverse.STAFF],
        activeUniverse: EUniverse.STAFF
      })
      mockEnsureSession.mockImplementation(async () => {
        setSession({
          roles: [ERole.ROLE_ADMIN],
          universes: [EUniverse.STAFF]
        })
      })
    })

    afterEach(async () => {
      await resetSession()
    })

    BddTest().then('it should call the callback once, with the session confirmed before the check', async () => {
      await router.push(RESTRICTED_LOCATION_WITH_PARAMS)

      expect(mockIsAuthorized).toHaveBeenCalledTimes(1)
      expect(getCurrentRouteName()).toBe(RESTRICTED_LOCATION_WITH_PARAMS.name)
    })
  })

  BddTest().when('the user lacks every role required by the page', () => {
    beforeEach(async () => {
      await setupWith({
        roles: [ERole.ROLE_STUDENT_PORTFOLIO]
      })
    })

    BddTest().then('it should display the not found page at the address of the page', async () => {
      await router.push(ROUTES.STUDENT.ACTIVITIES)

      expectNotFoundAt(ROUTES.STUDENT.ACTIVITIES)
    })

    BddTest().then('it should let the user reach a page requiring one of his roles', async () => {
      await router.push(ROUTES.STUDENT.SKILLS)

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.SKILLS.name)
    })

    BddTest().then('it should let the user reach a page requiring no role', async () => {
      await router.push(ROUTES.STUDENT.DELIVERABLES)

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.DELIVERABLES.name)
    })
  })

  BddTest().when('the user holds one of the roles accepted by the page', () => {
    beforeEach(async () => {
      await setupWith({
        universes: [EUniverse.STAFF],
        activeUniverse: EUniverse.STAFF,
        roles: [ERole.ROLE_STAFF_ACTIVITY_VIEWER]
      })
    })

    BddTest().then('it should let the navigation through', async () => {
      await router.push(ROUTES.STAFF.ACTIVITIES)

      expect(getCurrentRouteName()).toBe(ROUTES.STAFF.ACTIVITIES.name)
    })
  })

  BddTest().when('the user holds a role accepted by each level of the page', () => {
    beforeEach(async () => {
      await setupWith({
        universes: [EUniverse.STAFF],
        activeUniverse: EUniverse.STAFF,
        roles: [ERole.ROLE_ADMIN, ERole.ROLE_EXTERNAL_USER_MANAGER]
      })
    })

    BddTest().then('it should let the navigation through', async () => {
      await router.push(ROUTES.STAFF.ADMIN.USERS)

      expect(getCurrentRouteName()).toBe(ROUTES.STAFF.ADMIN.USERS.name)
    })
  })

  BddTest().when('the user holds the role accepted by the page but not the one required by its group', () => {
    beforeEach(async () => {
      await setupWith({
        universes: [EUniverse.STAFF],
        activeUniverse: EUniverse.STAFF,
        roles: [ERole.ROLE_EXTERNAL_USER_MANAGER]
      })
    })

    BddTest().then('it should display the not found page at the address of the page', async () => {
      await router.push(ROUTES.STAFF.ADMIN.USERS)

      expectNotFoundAt(ROUTES.STAFF.ADMIN.USERS)
    })
  })

  BddTest().when('the page has an authorization callback', () => {
    beforeEach(async () => {
      await setupWith({
        universes: [EUniverse.STAFF],
        activeUniverse: EUniverse.STAFF
      })
    })

    BddTest().then('it should give it the page params, and let the navigation through when it gives access', async () => {
      await router.push(RESTRICTED_LOCATION_WITH_PARAMS)

      expect(mockIsAuthorized).toHaveBeenCalledWith(...Object.values(RESTRICTED_LOCATION_WITH_PARAMS.params))
      expect(getCurrentRouteName()).toBe(RESTRICTED_LOCATION_WITH_PARAMS.name)
    })

    BddTest().then('it should display the not found page at the address of the page when it denies access', async () => {
      mockIsAuthorized.mockResolvedValue(false)

      await router.push(RESTRICTED_LOCATION_WITH_PARAMS)

      expectNotFoundAt(RESTRICTED_LOCATION_WITH_PARAMS)
    })

    BddTest().then('it should display the not found page at the address of the page when it throws', async () => {
      mockIsAuthorized.mockRejectedValue(new Error('Network Error'))

      await router.push(RESTRICTED_LOCATION_WITH_PARAMS)

      expectNotFoundAt(RESTRICTED_LOCATION_WITH_PARAMS)
    })

    BddTest().then('it should let it use composables relying on inject(), such as useQueryClient()', async () => {
      mockIsAuthorized.mockImplementation(() => useQueryClient() !== undefined)
      const wrapper = mountComponent({
        render: () => null
      }, {
        global: {
          plugins: [router]
        }
      })

      await router.push(RESTRICTED_LOCATION_WITH_PARAMS)
      const routeName = getCurrentRouteName()
      wrapper.unmount()

      expect(routeName).toBe(RESTRICTED_LOCATION_WITH_PARAMS.name)
    })
  })

  BddTest().when('the user does not meet the criteria of a page with an authorization callback', () => {
    beforeEach(async () => {
      await setupWith({
        universes: [EUniverse.STAFF],
        activeUniverse: EUniverse.STAFF,
        roles: [ERole.ROLE_EXTERNAL_USER_MANAGER]
      })
    })

    BddTest().then('it should display the not found page without calling the callback', async () => {
      await router.push(RESTRICTED_LOCATION_WITH_PARAMS)

      expectNotFoundAt(RESTRICTED_LOCATION_WITH_PARAMS)
      expect(mockIsAuthorized).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the page has no restriction', () => {
    beforeEach(async () => {
      await setupWith({
        universes: [EUniverse.STAFF, EUniverse.STUDENT],
        activeUniverse: EUniverse.STAFF
      })
    })

    BddTest().then('it should let the navigation through without switching universe', async () => {
      await router.push(UNKNOWN_PATH)

      expect(getCurrentRouteName()).toBe(NOT_FOUND_ROUTE_NAME)
      expect(mockSwitchUniverse).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the page has no restriction on the first navigation', () => {
    beforeEach(async () => {
      await setupWith({
        isFirstNavigation: true
      })
    })

    BddTest().then('it should display the page instead of sending the user to his home route', async () => {
      await router.push(UNKNOWN_PATH)

      expect(getCurrentRouteName()).toBe(NOT_FOUND_ROUTE_NAME)
    })
  })

  BddTest().when('the user goes to the root page', () => {
    beforeEach(async () => {
      await setupWith()
    })

    BddTest().then('it should send the user to his home route', async () => {
      await router.push({ name: ROOT_ROUTE_NAME })

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.HOME.name)
    })
  })

  BddTest().when('nobody is logged in in the tab and goes to the root page', () => {
    beforeEach(async () => {
      await setupWith({
        isLoggedIn: false
      })
    })

    BddTest().then('it should ask the api, and send the user to login when it answers 401, with the root page to come back to', async () => {
      mockEnsureSession.mockResolvedValueOnce({
        ...ROUTES.AUTH.LOGIN,
        query: {
          redirect: '/'
        }
      })

      await router.push({ name: ROOT_ROUTE_NAME })

      expect(mockEnsureSession).toHaveBeenCalledWith('/')
      expect(getCurrentRouteName()).toBe(ROUTES.AUTH.LOGIN.name)
    })

    BddTest().then('it should send the user to his home route when the api confirms a session', async () => {
      mockEnsureSession.mockImplementationOnce(async () => {
        mockIsLoggedIn.value = true
      })

      await router.push({ name: ROOT_ROUTE_NAME })

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.HOME.name)
    })

    BddTest().then('it should abort the navigation when a redirect to login is already in progress', async () => {
      mockEnsureSession.mockResolvedValueOnce(false)

      const failure = await router.push({ name: ROOT_ROUTE_NAME })

      expect(isNavigationFailure(failure, NavigationFailureType.aborted)).toBe(true)
      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.CGU.name)
    })
  })

  BddTest().when('the user is already logged in and goes to the login page', () => {
    beforeEach(async () => {
      await setupWith()
    })

    BddTest().then('it should send the user to his home route', async () => {
      await router.push(ROUTES.AUTH.LOGIN)

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.HOME.name)
    })

    BddTest().then('it should send the user to the page of the redirect query parameter', async () => {
      const redirect = router.resolve(ROUTES.STUDENT.DELIVERABLES).fullPath

      await router.push({
        ...ROUTES.AUTH.LOGIN,
        query: { redirect }
      })

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.DELIVERABLES.name)
    })

    BddTest().then('it should ignore a redirect query parameter pointing to the login page itself', async () => {
      await router.push({
        ...ROUTES.AUTH.LOGIN,
        query: {
          redirect: router.resolve(ROUTES.AUTH.LOGIN).fullPath
        }
      })

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.HOME.name)
    })

    BddTest().then('it should ignore a redirect query parameter that is not a path of the application', async () => {
      await router.push({
        ...ROUTES.AUTH.LOGIN,
        query: {
          redirect: 'https://example.com/elsewhere'
        }
      })

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.HOME.name)
    })
  })

  BddTest().when('the user is already logged in and goes to the login page without having accepted the latest cgu version', () => {
    beforeEach(async () => {
      await setupWith({
        hasAcceptedLatestCgu: false
      })
    })

    BddTest().then('it should redirect to the cgu page with the initial redirect target', async () => {
      const redirect = router.resolve(ROUTES.STUDENT.DELIVERABLES).fullPath

      await router.push({
        ...ROUTES.AUTH.LOGIN,
        query: { redirect }
      })

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.CGU.name)
      expect(router.currentRoute.value.query.redirect).toBe(redirect)
    })

    BddTest().then('it should redirect to the cgu page with his home route as redirect target, without any', async () => {
      await router.push(ROUTES.AUTH.LOGIN)

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.CGU.name)
      expect(router.currentRoute.value.query.redirect).toBe(router.resolve(ROUTES.STUDENT.HOME).fullPath)
    })
  })

  BddTest().when('the user is already logged in and has not accepted the latest cgu version', () => {
    beforeEach(async () => {
      await setupWith({
        hasAcceptedLatestCgu: false
      })
    })

    BddTest().then('it should redirect to the cgu page when accessing a protected page', async () => {
      const redirect = router.resolve(ROUTES.STUDENT.DELIVERABLES).fullPath

      await router.push(ROUTES.STUDENT.DELIVERABLES)

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.CGU.name)
      expect(router.currentRoute.value.query.redirect).toBe(redirect)
    })

    BddTest().then('it should redirect the root page to the cgu page, with his home route as redirect target', async () => {
      await router.push({ name: ROOT_ROUTE_NAME })

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.CGU.name)
      expect(router.currentRoute.value.query.redirect).toBe(router.resolve(ROUTES.STUDENT.HOME).fullPath)
    })

    BddTest().then('it should display the cgu page with its redirect target, rather than redirecting it to itself', async () => {
      const redirect = router.resolve(ROUTES.STUDENT.DELIVERABLES).fullPath

      await router.push({
        ...ROUTES.STUDENT.CGU,
        query: { redirect }
      })

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.CGU.name)
      expect(router.currentRoute.value.query.redirect).toBe(redirect)
    })

    BddTest().then('it should let the user reach the redirect target once he has accepted the latest version', async () => {
      await router.push(ROUTES.STUDENT.DELIVERABLES)
      mockHasAcceptedLatestCgu.value = true

      await router.push(String(router.currentRoute.value.query.redirect))

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.DELIVERABLES.name)
    })

    BddTest().then('it should display the not found page as is, which the cgu page would lead to were it inaccessible', async () => {
      await router.push(UNKNOWN_PATH)

      expect(getCurrentRouteName()).toBe(NOT_FOUND_ROUTE_NAME)
    })
  })

  BddTest().when('the user is logged in without any universe, his home route being the login page', () => {
    beforeEach(async () => {
      await setupWith({
        universes: []
      })
    })

    BddTest().then('it should display nothing, on the root page, rather than the login page', async () => {
      await router.push(ROUTES.AUTH.LOGIN)

      expect(getCurrentRouteName()).toBe(ROOT_ROUTE_NAME)
    })

    BddTest().then('it should display nothing on the root page, rather than redirecting to the login page', async () => {
      await router.push({ name: ROOT_ROUTE_NAME })

      expect(getCurrentRouteName()).toBe(ROOT_ROUTE_NAME)
    })

    BddTest().then('it should not send him to the cgu page, even without having accepted the latest version', async () => {
      mockHasAcceptedLatestCgu.value = false

      await router.push(ROUTES.STUDENT.DELIVERABLES)

      expectNotFoundAt(ROUTES.STUDENT.DELIVERABLES)
    })
  })

  BddTest().when('nobody is logged in and goes to the login page', () => {
    beforeEach(async () => {
      await setupWith({
        isLoggedIn: false
      })
    })

    BddTest().then('it should display the login page without reading any session', async () => {
      await router.push(ROUTES.AUTH.LOGIN)

      expect(getCurrentRouteName()).toBe(ROUTES.AUTH.LOGIN.name)
      expect(mockUseCurrentUserSession).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the user is not authenticated', () => {
    beforeEach(async () => {
      await setupWith({
        isLoggedIn: false
      })
      mockEnsureSession.mockReset().mockResolvedValueOnce(ROUTES.AUTH.LOGIN)
    })

    BddTest().then('it should redirect to the login route instead of displaying a restricted page', async () => {
      await router.push(ROUTES.STUDENT.DELIVERABLES)

      expect(mockEnsureSession).toHaveBeenCalledWith(router.resolve(ROUTES.STUDENT.DELIVERABLES).fullPath)
      expect(getCurrentRouteName()).toBe(ROUTES.AUTH.LOGIN.name)
    })

    BddTest().then('it should not read the user session', async () => {
      await router.push(ROUTES.STUDENT.DELIVERABLES)

      expect(mockUseCurrentUserSession).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the session cannot be established (error already displayed, or redirect to login already in progress)', () => {
    beforeEach(async () => {
      await setupWith({
        isLoggedIn: false
      })
      mockEnsureSession.mockReset().mockResolvedValue(false)
    })

    BddTest().then('it should abort the navigation and stay on the current page', async () => {
      await router.push(ROUTES.STUDENT.DELIVERABLES)

      expect(mockEnsureSession).toHaveBeenCalledTimes(1)
      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.CGU.name)
    })

    BddTest().then('it should not read the user session', async () => {
      await router.push(ROUTES.STUDENT.DELIVERABLES)

      expect(mockUseCurrentUserSession).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the page is public', () => {
    beforeEach(async () => {
      await setupWith()
      mockEnsureSession.mockClear()
    })

    BddTest().then('it should not check the session', async () => {
      await router.push(ROUTES.AUTH.CGU)

      expect(getCurrentRouteName()).toBe(ROUTES.AUTH.CGU.name)
      expect(mockEnsureSession).not.toHaveBeenCalled()
    })

    BddTest().then('it should not check the session on a page outside ROUTES either', async () => {
      await router.push(UNKNOWN_PATH)

      expect(getCurrentRouteName()).toBe(NOT_FOUND_ROUTE_NAME)
      expect(mockEnsureSession).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the session rights change while a page is displayed', () => {
    const PORTFOLIO_USER = { roles: [ERole.ROLE_STUDENT_PORTFOLIO], universes: [EUniverse.STUDENT] }

    beforeEach(async () => {
      await setupWith()
      setSession(PORTFOLIO_USER)
      await router.push(ROUTES.STUDENT.SKILLS)
      await settle()
      mockEnsureSession.mockClear()
      vi.mocked(window.scrollTo).mockClear()
    })

    afterEach(async () => {
      await resetSession()
    })

    BddTest().then('it should check the page again, without scrolling, and keep it while it remains accessible', async () => {
      setSession({
        ...PORTFOLIO_USER,
        roles: [ERole.ROLE_STUDENT_PORTFOLIO, ERole.ROLE_STUDENT_ACTIVITY]
      })
      await settle()

      expect(mockEnsureSession).toHaveBeenCalledTimes(1)
      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.SKILLS.name)
      expect(window.scrollTo).not.toHaveBeenCalled()
    })

    BddTest().then('it should send the user to his home route, at the top, once the page is no longer accessible', async () => {
      setSession({
        ...PORTFOLIO_USER,
        roles: [ERole.ROLE_STUDENT_ACTIVITY]
      })
      await settle()

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.HOME.name)
      expect(window.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }))
    })

    BddTest().then('it should display nothing, on the root page, once he has no universe left', async () => {
      setSession({
        ...PORTFOLIO_USER,
        universes: []
      })
      await settle()

      expect(getCurrentRouteName()).toBe(ROOT_ROUTE_NAME)
    })

    BddTest().then('it should not check the page again when the session is fetched again with the same rights', async () => {
      setSession({ ...PORTFOLIO_USER })
      await settle()

      expect(mockEnsureSession).not.toHaveBeenCalled()
    })

    BddTest().then('it should not check the page again when the same rights come in another order', async () => {
      setSession({
        ...PORTFOLIO_USER,
        roles: [ERole.ROLE_STUDENT_PORTFOLIO, ERole.ROLE_STUDENT_ACTIVITY]
      })
      await settle()
      mockEnsureSession.mockClear()
      setSession({
        ...PORTFOLIO_USER,
        roles: [ERole.ROLE_STUDENT_ACTIVITY, ERole.ROLE_STUDENT_PORTFOLIO]
      })
      await settle()

      expect(mockEnsureSession).not.toHaveBeenCalled()
    })

    BddTest().then('it should leave a session that disappears to the auth store', async () => {
      setSession(undefined)
      await settle()

      expect(mockEnsureSession).not.toHaveBeenCalled()
      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.SKILLS.name)
    })

    BddTest().then('it should check again a page displayed since an earlier check, even for the same rights', async () => {
      const LOST_PORTFOLIO = { ...PORTFOLIO_USER, roles: [ERole.ROLE_STUDENT_ACTIVITY] }
      setSession(LOST_PORTFOLIO)
      await settle()

      const navigation = router.push(ROUTES.STUDENT.SKILLS)
      setSession(PORTFOLIO_USER)
      await navigation
      await settle()
      setSession(LOST_PORTFOLIO)
      await settle()

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.HOME.name)
    })

    BddTest().then('it should not check the page again endlessly when its check does not end', async () => {
      mockEnsureSession.mockResolvedValue(false)
      setSession({
        ...PORTFOLIO_USER,
        roles: [ERole.ROLE_STUDENT_PORTFOLIO, ERole.ROLE_STUDENT_ACTIVITY]
      })
      await settle()

      expect(mockEnsureSession).toHaveBeenCalledTimes(1)
      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.SKILLS.name)
    })
  })

  BddTest().when('the session rights change while the not found page of a page the user cannot access is displayed', () => {
    beforeEach(async () => {
      await setupWith()
      setSession({
        roles: [ERole.ROLE_STUDENT_ACTIVITY],
        universes: [EUniverse.STUDENT]
      })
      await router.push(ROUTES.STUDENT.SKILLS)
      await settle()
    })

    afterEach(async () => {
      await resetSession()
    })

    BddTest().then('it should display the page, at the same address, once the user can access it', async () => {
      expectNotFoundAt(ROUTES.STUDENT.SKILLS)

      setSession({
        roles: [ERole.ROLE_STUDENT_PORTFOLIO],
        universes: [EUniverse.STUDENT]
      })
      await settle()

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.SKILLS.name)
    })

    BddTest().then('it should keep the not found page while the user still cannot access the page, rather than sending him to his home route', async () => {
      setSession({
        roles: [ERole.ROLE_STUDENT_ACTIVITY, ERole.ROLE_STUDENT_EMPLOYMENT_KIT],
        universes: [EUniverse.STUDENT]
      })
      await settle()

      expectNotFoundAt(ROUTES.STUDENT.SKILLS)
    })
  })

  BddTest().when('a session appears while the login page is displayed, the user having logged in from another tab', () => {
    beforeEach(async () => {
      await setupWith({
        isLoggedIn: false
      })
      await router.push(ROUTES.AUTH.LOGIN)
    })

    afterEach(async () => {
      await resetSession()
    })

    BddTest().then('it should send the user to his home route', async () => {
      setSession({
        roles: Object.values(ERole),
        universes: [EUniverse.STUDENT]
      })
      await settle()

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.HOME.name)
    })
  })

  BddTest().when('the session rights change while a navigation is pending', () => {
    const PORTFOLIO_USER = { roles: [ERole.ROLE_STUDENT_PORTFOLIO], universes: [EUniverse.STUDENT] }

    let endHold: ((result?: false | Error) => void) | undefined
    let removeHold: () => void

    const startNavigation = async (location: RouteLocationRaw) => {
      const navigation = router.push(location).catch(() => undefined)
      await vi.waitFor(() => expect(endHold).toBeDefined())
      return { navigation }
    }

    beforeEach(async () => {
      await setupWith()
      setSession(PORTFOLIO_USER)
      await router.push(ROUTES.STUDENT.SKILLS)
      await settle()

      endHold = undefined
      let isHolding = false
      removeHold = router.beforeEach(() => {
        if (isHolding) {
          return
        }

        isHolding = true
        return new Promise<false | undefined>((resolve, reject) => {
          endHold = result => result instanceof Error ? reject(result) : resolve(result)
        })
      })
    })

    afterEach(async () => {
      removeHold()
      await resetSession()
    })

    BddTest().then('it should check the navigation again before confirming it, and display the not found page once access is lost', async () => {
      const { navigation } = await startNavigation(ROUTES.STUDENT.BUILD_PROJECT)
      setSession({
        ...PORTFOLIO_USER,
        roles: [ERole.ROLE_STUDENT_ACTIVITY]
      })

      await settle()
      endHold!()
      await navigation
      await settle()

      expectNotFoundAt(ROUTES.STUDENT.BUILD_PROJECT)
    })

    BddTest().then('it should let it through when the page remains accessible', async () => {
      const { navigation } = await startNavigation(ROUTES.STUDENT.BUILD_PROJECT)
      setSession({
        ...PORTFOLIO_USER,
        roles: [ERole.ROLE_STUDENT_PORTFOLIO, ERole.ROLE_STUDENT_ACTIVITY]
      })

      await settle()
      endHold!()
      await navigation
      await settle()

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.BUILD_PROJECT.name)
    })

    BddTest().then('it should send the user to login when the session disappears before the navigation is confirmed', async () => {
      const { navigation } = await startNavigation(ROUTES.STUDENT.BUILD_PROJECT)
      mockEnsureSession.mockResolvedValue(ROUTES.AUTH.LOGIN)
      setSession(undefined)

      await settle()
      endHold!()
      await navigation
      await settle()

      expect(getCurrentRouteName()).toBe(ROUTES.AUTH.LOGIN.name)
    })

    BddTest().then('it should check the displayed page again once the navigation is aborted', async () => {
      const { navigation } = await startNavigation(ROUTES.STUDENT.DELIVERABLES)
      setSession({
        ...PORTFOLIO_USER,
        roles: [ERole.ROLE_STUDENT_ACTIVITY]
      })

      await settle()
      endHold!(false)
      await navigation
      await settle()

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.HOME.name)
    })

    BddTest().then('it should check the displayed page again once the navigation ends with an error, logged', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      const error = new Error('Failed to load the page')
      const { navigation } = await startNavigation(ROUTES.STUDENT.DELIVERABLES)
      setSession({
        ...PORTFOLIO_USER,
        roles: [ERole.ROLE_STUDENT_ACTIVITY]
      })

      await settle()
      endHold!(error)
      await navigation
      await settle()

      expect(consoleError).toHaveBeenCalledWith(error)
      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.HOME.name)
      consoleError.mockRestore()
    })
  })

  BddTest().when('the data of the authorization callbacks of the displayed page may have changed', () => {
    const ADMIN = {
      roles: [ERole.ROLE_ADMIN],
      universes: [EUniverse.STAFF]
    }

    beforeEach(async () => {
      await setupWith({
        universes: [EUniverse.STAFF],
        activeUniverse: EUniverse.STAFF
      })
      setSession(ADMIN)
      await router.push(RESTRICTED_LOCATION_WITH_PARAMS)
      await settle()
      mockIsAuthorized.mockClear()
      vi.mocked(window.scrollTo).mockClear()
    })

    afterEach(async () => {
      await resetSession()
    })

    BddTest().then('it should call the callback again, and keep the page, without scrolling, while it gives access', async () => {
      invalidateRouteAccess()
      await settle()

      expect(mockIsAuthorized).toHaveBeenCalledTimes(1)
      expect(mockIsAuthorized).toHaveBeenCalledWith(...Object.values(RESTRICTED_LOCATION_WITH_PARAMS.params))
      expect(getCurrentRouteName()).toBe(RESTRICTED_LOCATION_WITH_PARAMS.name)
      expect(window.scrollTo).not.toHaveBeenCalled()
    })

    BddTest().then('it should send the user to his home route once the callback denies access', async () => {
      mockIsAuthorized.mockResolvedValue(false)
      invalidateRouteAccess()
      await settle()

      expect(mockIsAuthorized).toHaveBeenCalledTimes(1)
      expect(getCurrentRouteName()).toBe(ROUTES.STAFF.HOME.name)
    })
  })

  BddTest().when('the data of the authorization callbacks may have changed while the displayed page has none', () => {
    beforeEach(async () => {
      await setupWith()
      setSession({
        roles: [ERole.ROLE_STUDENT_PORTFOLIO],
        universes: [EUniverse.STUDENT]
      })
      await router.push(ROUTES.STUDENT.SKILLS)
      await settle()
      mockEnsureSession.mockClear()
    })

    afterEach(async () => {
      await resetSession()
    })

    BddTest().then('it should not check the page again', async () => {
      invalidateRouteAccess()
      await settle()

      expect(mockEnsureSession).not.toHaveBeenCalled()
      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.SKILLS.name)
    })
  })

  BddTest().when('the data of the authorization callbacks may have changed while the not found page of a page they denied is displayed', () => {
    beforeEach(async () => {
      await setupWith({
        universes: [EUniverse.STAFF],
        activeUniverse: EUniverse.STAFF
      })
      setSession({
        roles: [ERole.ROLE_ADMIN],
        universes: [EUniverse.STAFF]
      })
      mockIsAuthorized.mockResolvedValue(false)
      await router.push(RESTRICTED_LOCATION_WITH_PARAMS)
      await settle()
    })

    afterEach(async () => {
      await resetSession()
    })

    BddTest().then('it should display the page, at the same address, once the callback gives access', async () => {
      expectNotFoundAt(RESTRICTED_LOCATION_WITH_PARAMS)

      mockIsAuthorized.mockResolvedValue(true)
      invalidateRouteAccess()
      await settle()

      expect(getCurrentRouteName()).toBe(RESTRICTED_LOCATION_WITH_PARAMS.name)
    })
  })

  BddTest().when('the data of the authorization callbacks of a pending navigation may have changed', () => {
    let endHold: (() => void) | undefined
    let removeHold: () => void

    beforeEach(async () => {
      await setupWith({
        universes: [EUniverse.STAFF],
        activeUniverse: EUniverse.STAFF
      })
      setSession({
        roles: [ERole.ROLE_ADMIN],
        universes: [EUniverse.STAFF]
      })
      await router.push(ROUTES.STAFF.HOME)
      await settle()

      endHold = undefined
      let isHolding = false
      removeHold = router.beforeEach(() => {
        if (isHolding) {
          return
        }

        isHolding = true
        return new Promise<undefined>((resolve) => {
          endHold = () => resolve(undefined)
        })
      })
    })

    afterEach(async () => {
      removeHold()
      await resetSession()
    })

    BddTest().then('it should call the callback again before confirming it, and display the not found page once it denies access', async () => {
      const navigation = router.push(RESTRICTED_LOCATION_WITH_PARAMS).catch(() => undefined)
      await vi.waitFor(() => expect(endHold).toBeDefined())
      mockIsAuthorized.mockResolvedValue(false)
      invalidateRouteAccess()
      await settle()
      endHold!()
      await navigation
      await settle()

      expect(mockIsAuthorized).toHaveBeenCalledTimes(2)
      expectNotFoundAt(RESTRICTED_LOCATION_WITH_PARAMS)
    })
  })
})
