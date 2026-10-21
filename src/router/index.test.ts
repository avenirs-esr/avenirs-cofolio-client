import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeAll, beforeEach, expect, vi } from 'vitest'
import { isNavigationFailure, NavigationFailureType, START_LOCATION } from 'vue-router'
import { ERole, EUserCategory } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'

const NOT_FOUND_ROUTE_NAME = 'NotFound'
const ROOT_ROUTE_NAME = 'home'

const UNKNOWN_PATH = '/this-page-does-not-exist'

interface UserState {
  isLoggedIn: boolean
  categories: EUserCategory[]
  roles: ERole[]
  activeProfileCategory: EUserCategory
  hasAcceptedLatestCgu: boolean
}

interface SetupOptions extends Partial<UserState> {
  isFirstNavigation?: boolean
  startsOnLoginPage?: boolean
}

const DEFAULT_USER: UserState = {
  isLoggedIn: true,
  categories: [EUserCategory.STUDENT],
  roles: Object.values(ERole),
  activeProfileCategory: EUserCategory.STUDENT,
  hasAcceptedLatestCgu: true,
}

const { mockEnsureSession, mockSwitchProfile, mockUseCurrentUserSession } = vi.hoisted(() => ({
  mockEnsureSession: vi.fn(),
  mockSwitchProfile: vi.fn(),
  mockUseCurrentUserSession: vi.fn(),
}))

const mockIsLoggedIn = ref(true)
const mockCategories = ref<EUserCategory[]>([])
const mockRoles = ref<ERole[]>([])
const mockActiveProfileCategory = ref<EUserCategory>(EUserCategory.STUDENT)
const mockHasAcceptedLatestCgu = ref(true)

vi.mock('@/features/auth/global/stores/auth.store', () => ({
  useAuthStore: () => ({
    ensureSession: mockEnsureSession,
    get isLoggedIn () {
      return mockIsLoggedIn.value
    }
  })
}))

vi.mock('@/features/auth/global/composables/use-current-user-session/use-current-user-session', () => ({
  useCurrentUserSession: () => {
    mockUseCurrentUserSession()

    return {
      categories: mockCategories,
      roles: mockRoles,
      profile: {
        activeCategory: mockActiveProfileCategory,
        switch: mockSwitchProfile
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
  const applyUserState = ({ isLoggedIn, categories, roles, activeProfileCategory, hasAcceptedLatestCgu }: UserState) => {
    mockIsLoggedIn.value = isLoggedIn
    mockCategories.value = categories
    mockRoles.value = roles
    mockActiveProfileCategory.value = activeProfileCategory
    mockHasAcceptedLatestCgu.value = hasAcceptedLatestCgu
  }

  const setupWith = async ({ isFirstNavigation = false, startsOnLoginPage = false, ...user }: SetupOptions = {}) => {
    mockEnsureSession.mockReset().mockResolvedValue(undefined)

    applyUserState({ ...DEFAULT_USER, isLoggedIn: !startsOnLoginPage })
    await router.push(startsOnLoginPage ? ROUTES.AUTH.LOGIN : ROUTES.STUDENT.CGU)
    await router.isReady()

    mockSwitchProfile.mockReset()
    mockUseCurrentUserSession.mockReset()
    applyUserState({ ...DEFAULT_USER, ...user })

    if (isFirstNavigation) {
      router.currentRoute.value = START_LOCATION
    }
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
      expect(mockSwitchProfile).not.toHaveBeenCalled()
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

  BddTest().when('the active profile is not the one allowed on the page', () => {
    beforeEach(async () => {
      await setupWith({
        categories: [EUserCategory.STAFF, EUserCategory.STUDENT],
        activeProfileCategory: EUserCategory.STAFF
      })
    })

    BddTest().then('it should switch to the profile allowed on the page and let the navigation through', async () => {
      await router.push(ROUTES.STUDENT.DELIVERABLES)

      expect(mockSwitchProfile).toHaveBeenCalledWith(EUserCategory.STUDENT)
      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.DELIVERABLES.name)
    })
  })

  BddTest().when('none of the profiles of the user is allowed on the page', () => {
    beforeEach(async () => {
      await setupWith()
    })

    BddTest().then('it should keep the user on the current page', async () => {
      const failure = await router.push(ROUTES.STAFF.HOME)

      expect(isNavigationFailure(failure, NavigationFailureType.aborted)).toBe(true)
      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.CGU.name)
      expect(mockSwitchProfile).not.toHaveBeenCalled()
    })
  })

  BddTest().when('none of the profiles of the user is allowed on the page of the first navigation', () => {
    beforeEach(async () => {
      await setupWith({
        isFirstNavigation: true
      })
    })

    BddTest().then('it should send the user to his home route', async () => {
      await router.push(ROUTES.STAFF.HOME)

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.HOME.name)
    })
  })

  BddTest().when('the user comes from the login page and none of his profiles is allowed on the page', () => {
    beforeEach(async () => {
      await setupWith({
        startsOnLoginPage: true
      })
    })

    BddTest().then('it should send the user to his home route instead of keeping him on the login page', async () => {
      await router.push(ROUTES.STAFF.HOME)

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.HOME.name)
    })
  })

  BddTest().when('the user lacks every role required by the page', () => {
    beforeEach(async () => {
      await setupWith({ roles: [ERole.ROLE_STUDENT_PORTFOLIO] })
    })

    BddTest().then('it should keep the user on the current page', async () => {
      const failure = await router.push(ROUTES.STUDENT.ACTIVITIES)

      expect(isNavigationFailure(failure, NavigationFailureType.aborted)).toBe(true)
      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.CGU.name)
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

  BddTest().when('the user lacks every role required by the page of the first navigation', () => {
    beforeEach(async () => {
      await setupWith({ roles: [], isFirstNavigation: true })
    })

    BddTest().then('it should send the user to his home route', async () => {
      await router.push(ROUTES.STUDENT.ACTIVITIES)

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.HOME.name)
    })
  })

  BddTest().when('the page has no role restriction', () => {
    beforeEach(async () => {
      await setupWith({
        categories: [EUserCategory.STAFF, EUserCategory.STUDENT],
        activeProfileCategory: EUserCategory.STAFF
      })
    })

    BddTest().then('it should let the navigation through without switching profile', async () => {
      await router.push(UNKNOWN_PATH)

      expect(getCurrentRouteName()).toBe(NOT_FOUND_ROUTE_NAME)
      expect(mockSwitchProfile).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the page has no role restriction on the first navigation', () => {
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

    BddTest().then('it should redirect to the login route instead of displaying the page', async () => {
      await router.push(UNKNOWN_PATH)

      expect(mockEnsureSession).toHaveBeenCalledWith(UNKNOWN_PATH)
      expect(getCurrentRouteName()).toBe(ROUTES.AUTH.LOGIN.name)
    })

    BddTest().then('it should not read the session of the user', async () => {
      await router.push(UNKNOWN_PATH)

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
      await router.push(UNKNOWN_PATH)

      expect(mockEnsureSession).toHaveBeenCalledTimes(1)
      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.CGU.name)
    })

    BddTest().then('it should not read the session of the user', async () => {
      await router.push(UNKNOWN_PATH)

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

      expect(mockEnsureSession).not.toHaveBeenCalled()
      expect(mockUseCurrentUserSession).not.toHaveBeenCalled()
    })
  })
})
