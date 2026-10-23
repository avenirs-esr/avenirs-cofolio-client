import type { RouteLocationRaw } from 'vue-router'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeAll, beforeEach, expect, vi } from 'vitest'
import { isNavigationFailure, NavigationFailureType, START_LOCATION } from 'vue-router'
import { ERole, EUniverse } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'

const NOT_FOUND_ROUTE_NAME = 'NotFound'
const ROOT_ROUTE_NAME = 'home'

const UNKNOWN_PATH = '/this-page-does-not-exist'

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

const DEFAULT_USER: UserState = {
  isLoggedIn: true,
  universes: [EUniverse.STUDENT],
  roles: Object.values(ERole),
  activeUniverse: EUniverse.STUDENT,
  hasAcceptedLatestCgu: true,
}

const { mockEnsureSession, mockRedirectToLogin, mockSwitchUniverse, mockUseCurrentUserSession } = vi.hoisted(() => ({
  mockEnsureSession: vi.fn(),
  mockRedirectToLogin: vi.fn(),
  mockSwitchUniverse: vi.fn(),
  mockUseCurrentUserSession: vi.fn(),
}))

const mockIsLoggedIn = ref(true)
const mockUniverses = ref<EUniverse[]>([])
const mockRoles = ref<ERole[]>([])
const mockActiveUniverse = ref<EUniverse>(EUniverse.STUDENT)
const mockHasAcceptedLatestCgu = ref(true)

vi.mock('@/features/auth/global/stores/auth.store', () => ({
  useAuthStore: () => ({
    ensureSession: mockEnsureSession,
    redirectToLogin: mockRedirectToLogin,
    get isLoggedIn () {
      return mockIsLoggedIn.value
    }
  })
}))

vi.mock('@/features/auth/global/composables/use-current-user-session/use-current-user-session', () => ({
  useCurrentUserSession: () => {
    mockUseCurrentUserSession()

    return {
      roles: mockRoles,
      universes: {
        available: mockUniverses,
        active: mockActiveUniverse,
        switch: mockSwitchUniverse
      },
      homeRoute: computed(() => ROUTES.STUDENT.HOME),
      cgu: {
        hasAcceptedLatest: mockHasAcceptedLatestCgu
      }
    }
  }
}))

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
    mockRedirectToLogin.mockReset().mockReturnValue({ name: ROUTES.AUTH.LOGIN.name })

    applyUserState(DEFAULT_USER)
    await router.push(ROUTES.STUDENT.CGU)
    await router.isReady()

    mockSwitchUniverse.mockReset()
    mockUseCurrentUserSession.mockReset()
    applyUserState({ ...DEFAULT_USER, ...user })

    if (isFirstNavigation) {
      router.currentRoute.value = START_LOCATION
    }
  }

  const expectNotFoundAt = (location: RouteLocationRaw) => {
    expect(getCurrentRouteName()).toBe(NOT_FOUND_ROUTE_NAME)
    expect(getCurrentRoute().fullPath).toBe(router.resolve(location).fullPath)
  }

  beforeAll(() => {
    // vue-router `scrollBehavior` calls it on every navigation, jsdom does not implement it.
    window.scrollTo = vi.fn()
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

    BddTest().then('it should not block the public auth cgu page', async () => {
      await router.push(ROUTES.AUTH.CGU)

      expect(getCurrentRouteName()).toBe(ROUTES.AUTH.CGU.name)
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

  BddTest().when('none of the universes of the user is allowed on the page', () => {
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
      const location = { name: ROUTES.STAFF.ADMIN.GROUP.DEFAULT.name, params: { id: 'été 2026/2' }, query: { tab: '2' }, hash: '#top' }

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

  BddTest().when('the user lacks every role required by the page', () => {
    beforeEach(async () => {
      await setupWith({ roles: [ERole.ROLE_STUDENT_PORTFOLIO] })
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

  BddTest().when('nobody is logged in and goes to the root page', () => {
    beforeEach(async () => {
      await setupWith({
        isLoggedIn: false
      })
    })

    BddTest().then('it should redirect to the login route, with the root page to come back to', async () => {
      await router.push({ name: ROOT_ROUTE_NAME })

      expect(mockRedirectToLogin).toHaveBeenCalledWith('/')
      expect(getCurrentRouteName()).toBe(ROUTES.AUTH.LOGIN.name)
    })

    BddTest().then('it should abort the navigation when a redirect to login is already in progress', async () => {
      mockRedirectToLogin.mockReturnValueOnce(undefined)

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
      await router.push({
        ...ROUTES.AUTH.LOGIN,
        query: {
          redirect: router.resolve(ROUTES.STUDENT.DELIVERABLES).fullPath
        }
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

  BddTest().when('the user is already logged in and opens the login page as first navigation', () => {
    beforeEach(async () => {
      await setupWith({
        isFirstNavigation: true
      })
    })

    BddTest().then('it should send the user to his home route instead of displaying the login page', async () => {
      await router.push(ROUTES.AUTH.LOGIN)

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.HOME.name)
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

    BddTest().then('it should not read the session of the user', async () => {
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

    BddTest().then('it should not read the session of the user', async () => {
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
})
