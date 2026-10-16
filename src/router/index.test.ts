import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeAll, beforeEach, expect, vi } from 'vitest'
import { START_LOCATION } from 'vue-router'
import { EUserCategory } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'

const UNKNOWN_PATH = '/this-page-does-not-exist'
const NOT_FOUND_ROUTE_NAME = 'NotFound'

interface UserState {
  categories: EUserCategory[]
  activeProfileCategory: EUserCategory
  hasAcceptedLatestCgu: boolean
}

interface SetupOptions extends Partial<UserState> {
  isFirstNavigation?: boolean
}

const DEFAULT_USER: UserState = {
  categories: [EUserCategory.STUDENT],
  activeProfileCategory: EUserCategory.STUDENT,
  hasAcceptedLatestCgu: true,
}

const { mockEnsureAuthenticated, mockSwitchProfile } = vi.hoisted(() => ({
  mockEnsureAuthenticated: vi.fn(),
  mockSwitchProfile: vi.fn(),
}))

const mockCategories = ref<EUserCategory[]>([])
const mockActiveProfileCategory = ref<EUserCategory>(EUserCategory.STUDENT)
const mockHasAcceptedLatestCgu = ref(true)

vi.mock('@/features/auth/global/stores/auth.store', () => ({
  useAuthStore: () => ({
    ensureAuthenticated: mockEnsureAuthenticated,
  }),
}))

vi.mock('@/features/auth/global/composables/use-current-user-session/use-current-user-session', () => ({
  useCurrentUserSession: () => ({
    categories: mockCategories,
    activeProfileCategory: mockActiveProfileCategory,
    homeRoute: computed(() => ROUTES.STUDENT.HOME),
    hasAcceptedLatestCgu: mockHasAcceptedLatestCgu,
    switchProfile: mockSwitchProfile,
  }),
}))

const { default: router } = await import('@/router')

const getCurrentRoute = () => router.currentRoute.value
const getCurrentRouteName = () => getCurrentRoute().name

BddTest().given('the application router', () => {
  const applyUserState = ({ categories, activeProfileCategory, hasAcceptedLatestCgu }: UserState) => {
    mockCategories.value = categories
    mockActiveProfileCategory.value = activeProfileCategory
    mockHasAcceptedLatestCgu.value = hasAcceptedLatestCgu
  }

  const setupWith = async ({ isFirstNavigation = false, ...user }: SetupOptions = {}) => {
    mockEnsureAuthenticated.mockReset().mockResolvedValue(undefined)

    applyUserState(DEFAULT_USER)
    await router.push({ name: ROUTES.STUDENT.CGU.name })
    await router.isReady()

    mockSwitchProfile.mockReset()
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
      await router.push({
        name: ROUTES.STUDENT.DELIVERABLES.name
      })

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
      await router.push({
        name: ROUTES.STUDENT.DELIVERABLES.name
      })

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.CGU.name)
    })

    BddTest().then('it should keep the cgu page reachable without looping', async () => {
      await router.push({
        name: ROUTES.STUDENT.CGU.name
      })

      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.CGU.name)
    })

    BddTest().then('it should not block the public auth cgu page', async () => {
      await router.push({
        name: ROUTES.AUTH.CGU.name
      })

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
      await router.push({
        name: ROUTES.STUDENT.DELIVERABLES.name
      })

      expect(mockSwitchProfile).toHaveBeenCalledWith(EUserCategory.STUDENT)
      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.DELIVERABLES.name)
    })
  })

  BddTest().when('none of the profiles of the user is allowed on the page', () => {
    beforeEach(async () => {
      await setupWith()
    })

    BddTest().then('it should keep the user on the current page', async () => {
      await router.push({
        name: ROUTES.STAFF.HOME.name
      })

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
      await router.push({
        name: ROUTES.STAFF.HOME.name
      })

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

  BddTest().when('the user is not authenticated', () => {
    beforeEach(async () => {
      await setupWith()
      mockEnsureAuthenticated.mockReset().mockResolvedValue(false)
    })

    BddTest().then('it should apply the authentication result instead of displaying the page', async () => {
      await router.push(UNKNOWN_PATH)

      expect(mockEnsureAuthenticated).toHaveBeenCalledTimes(1)
      expect(getCurrentRouteName()).toBe(ROUTES.STUDENT.CGU.name)
    })
  })
})
