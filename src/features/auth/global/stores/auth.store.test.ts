import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { mockedStaffProfileOverview } from '@/__mocks__/fixtures/staffs/user.fixtures'
import { mockedProfileOverview } from '@/__mocks__/fixtures/student'
import { EUserCategory } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { BaseApiException } from '@/common/exceptions'
import { HttpStatusCode } from '@/common/utils'
import { useAuthStore } from '@/features/auth/global/stores/auth.store'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, expect, vi } from 'vitest'

const { mockGetProfile, mockGetMe, mockReplace } = vi.hoisted(() => ({
  mockGetProfile: vi.fn(),
  mockGetMe: vi.fn(),
  mockReplace: vi.fn(),
}))

const mockUnauthorizedError = new BaseApiException('Unauthorized', HttpStatusCode.UNAUTHORIZED)

vi.mock('@/api/avenir-esr', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/avenir-esr')>()
  return {
    ...actual,
    getProfile: mockGetProfile,
    getMe: mockGetMe
  }
})

const mockTo = { fullPath: '/target' } as RouteLocationNormalized

vi.mock('@/router', () => ({
  __esModule: true,
  default: {
    replace: mockReplace,
    currentRoute: { value: { fullPath: '/current-route' } }
  }
}))

const mockAddErrorMessage = vi.fn()

vi.mock('@/store', () => ({
  useToasterStore: () => ({
    addErrorMessage: mockAddErrorMessage
  })
}))

const mockCancelQueries = vi.fn()

vi.mock('@tanstack/vue-query', () => ({
  useQueryClient: () => ({
    cancelQueries: mockCancelQueries
  })
}))

BddTest().given('an auth store with mocked dependencies', () => {
  let store: ReturnType<typeof useAuthStore>
  let route: RouteLocationRaw | undefined

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    store = useAuthStore()
  })

  BddTest().when('the store is initialized', () => {
    BddTest().then('it should expose default state', () => {
      expect(store).toBeDefined()
      expect(store.isLoggedIn).toBe(false)
      expect(store.ensureAuthenticated).toBeTypeOf('function')
      expect(store.invalidateSession).toBeTypeOf('function')
      expect(store.profile).toBeNull()
    })
  })

  BddTest().when('ensureAuthenticated is called with { delegated: false } and user authenticated as STUDENT', () => {
    beforeEach(async () => {
      mockGetMe.mockResolvedValueOnce({ firstname: 'John', lastname: 'Doe', roles: ['ROLE_STUDENT'] })
      mockGetProfile.mockResolvedValueOnce(mockedProfileOverview)
      route = await store.ensureAuthenticated({ delegated: false, to: mockTo })
    })

    BddTest().then('it should try to load the session and succeed', () => {
      expect(mockGetProfile).toHaveBeenCalledTimes(1)
      expect(mockGetProfile).toHaveBeenCalledWith(EUserCategory.STUDENT, expect.anything())
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
      expect(store.isLoggedIn).toBe(true)
      expect(store.profile).not.toBeNull()
      expect(store.categories).toEqual([EUserCategory.STUDENT])
    })

    BddTest().then('it should return undefined and not navigate to the login route', () => {
      expect(mockCancelQueries).not.toHaveBeenCalled()
      expect(route).toBeUndefined()
      expect(mockReplace).not.toHaveBeenCalled()
    })
  })

  BddTest().when('ensureAuthenticated is called with { delegated: false } and user authenticated as STAFF', () => {
    beforeEach(async () => {
      mockGetMe.mockResolvedValueOnce({ firstname: 'John', lastname: 'Doe', roles: ['ROLE_STAFF'] })
      mockGetProfile.mockResolvedValueOnce(mockedStaffProfileOverview)
      route = await store.ensureAuthenticated({ delegated: false, to: mockTo })
    })

    BddTest().then('it should try to load the session and succeed', () => {
      expect(mockGetProfile).toHaveBeenCalledTimes(1)
      expect(mockGetProfile).toHaveBeenCalledWith(EUserCategory.STAFF, expect.anything())
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
      expect(store.isLoggedIn).toBe(true)
      expect(store.profile).not.toBeNull()
      expect(store.categories).toEqual([EUserCategory.STAFF])
    })

    BddTest().then('it should return undefined and not navigate to the login route', () => {
      expect(mockCancelQueries).not.toHaveBeenCalled()
      expect(route).toBeUndefined()
      expect(mockReplace).not.toHaveBeenCalled()
    })
  })

  BddTest().when('ensureAuthenticated is called with { delegated: false } and user authenticated with several roles', () => {
    beforeEach(async () => {
      mockGetMe.mockResolvedValueOnce({ firstname: 'John', lastname: 'Doe', roles: ['ROLE_STUDENT', 'ROLE_STAFF', 'ROLE_SUPER_ADMIN'] })
      mockGetProfile.mockResolvedValueOnce(mockedProfileOverview)
      route = await store.ensureAuthenticated({ delegated: false, to: mockTo })
    })

    BddTest().then('it should expose every category granted by the roles', () => {
      expect(store.categories).toEqual([EUserCategory.STUDENT, EUserCategory.STAFF])
    })
  })

  BddTest().when('ensureAuthenticated is called with { delegated: false } and user not authenticated', () => {
    beforeEach(async () => {
      mockGetMe.mockRejectedValueOnce(mockUnauthorizedError)
      route = await store.ensureAuthenticated({ delegated: false, to: mockTo })
    })

    BddTest().then('it should try to load the session and fail', () => {
      expect(mockGetProfile).not.toHaveBeenCalled()
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
      expect(store.isLoggedIn).toBe(false)
      expect(store.profile).toBeNull()
    })

    BddTest().then('it should return undefined and navigate to the login route', () => {
      expect(mockCancelQueries).toHaveBeenCalledTimes(1)
      expect(route).toBeUndefined()
      expect(mockReplace).toHaveBeenCalledWith({
        name: ROUTES.AUTH.LOGIN.name,
        query: { redirect: '/target' },
      })
    })
  })

  BddTest().when('ensureAuthenticated is called without to and user not authenticated', () => {
    beforeEach(async () => {
      mockGetMe.mockRejectedValueOnce(mockUnauthorizedError)
      route = await store.ensureAuthenticated({ delegated: false })
    })

    BddTest().then('it should try to load the session and fail', () => {
      expect(mockGetProfile).not.toHaveBeenCalled()
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
      expect(store.isLoggedIn).toBe(false)
      expect(store.profile).toBeNull()
    })

    BddTest().then('it should return undefined and navigate to the login route', () => {
      expect(mockCancelQueries).toHaveBeenCalledTimes(1)
      expect(route).toBeUndefined()
      expect(mockReplace).toHaveBeenCalledWith({
        name: ROUTES.AUTH.LOGIN.name,
        query: { redirect: '/current-route' },
      })
    })
  })

  BddTest().when('ensureAuthenticated is called with { delegated: true } and user authenticated as STUDENT', () => {
    beforeEach(async () => {
      mockGetMe.mockResolvedValueOnce({ firstname: 'John', lastname: 'Doe', roles: ['ROLE_STUDENT'] })
      mockGetProfile.mockResolvedValueOnce(mockedProfileOverview)
      route = await store.ensureAuthenticated({ delegated: true, to: mockTo })
    })

    BddTest().then('it should try to load the session and succeed', () => {
      expect(mockGetProfile).toHaveBeenCalledTimes(1)
      expect(mockGetProfile).toHaveBeenCalledWith(EUserCategory.STUDENT, expect.anything())
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
      expect(store.isLoggedIn).toBe(true)
      expect(store.profile).not.toBeNull()
    })

    BddTest().then('it should return undefined and not navigate', () => {
      expect(mockCancelQueries).not.toHaveBeenCalled()
      expect(route).toBeUndefined()
      expect(mockReplace).not.toHaveBeenCalled()
    })
  })

  BddTest().when('ensureAuthenticated is called with { delegated: true } and user authenticated as STAFF', () => {
    beforeEach(async () => {
      mockGetMe.mockResolvedValueOnce({ firstname: 'John', lastname: 'Doe', roles: ['ROLE_STAFF'] })
      mockGetProfile.mockResolvedValueOnce(mockedStaffProfileOverview)
      route = await store.ensureAuthenticated({ delegated: true, to: mockTo })
    })

    BddTest().then('it should try to load the session and succeed', () => {
      expect(mockGetProfile).toHaveBeenCalledTimes(1)
      expect(mockGetProfile).toHaveBeenCalledWith(EUserCategory.STAFF, expect.anything())
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
      expect(store.isLoggedIn).toBe(true)
      expect(store.profile).not.toBeNull()
    })

    BddTest().then('it should not return the login route and not navigate', () => {
      expect(mockCancelQueries).not.toHaveBeenCalled()
      expect(route).toBeUndefined()
      expect(mockReplace).not.toHaveBeenCalled()
    })
  })

  BddTest().when('ensureAuthenticated is called with { delegated: true } and user not authenticated', () => {
    beforeEach(async () => {
      mockGetMe.mockRejectedValueOnce(mockUnauthorizedError)
      route = await store.ensureAuthenticated({ delegated: true, to: mockTo })
    })

    BddTest().then('it should try to load the session and fail', () => {
      expect(mockGetProfile).not.toHaveBeenCalled()
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
      expect(store.isLoggedIn).toBe(false)
      expect(store.profile).toBeNull()
    })

    BddTest().then('it should return the login route instead of navigating', () => {
      expect(mockCancelQueries).toHaveBeenCalledTimes(1)
      expect(route).toBeDefined()
      expect((route as any).name).toBe(ROUTES.AUTH.LOGIN.name)
      expect((route as any).query).toEqual({ redirect: '/target' })
      expect(mockReplace).not.toHaveBeenCalled()
    })
  })

  BddTest().when('ensureAuthenticated is called with { force: true }', () => {
    beforeEach(async () => {
      mockGetMe.mockResolvedValueOnce({ firstname: 'John', lastname: 'Doe', roles: ['ROLE_STUDENT'] })
      mockGetProfile.mockResolvedValueOnce(mockedProfileOverview)
      route = await store.ensureAuthenticated({ force: true, to: mockTo })
    })

    BddTest().then('it should bypass session loading and redirect immediately', () => {
      expect(mockGetMe).not.toHaveBeenCalled()
      expect(mockGetProfile).not.toHaveBeenCalled()
      expect(mockCancelQueries).toHaveBeenCalledTimes(1)
      expect(route).toBeUndefined()
      expect(mockReplace).toHaveBeenCalledWith({
        name: ROUTES.AUTH.LOGIN.name,
        query: { redirect: '/target' },
      })
    })
  })

  BddTest().when('ensureAuthenticated is called with { delegated: true, force: true }', () => {
    beforeEach(async () => {
      mockGetMe.mockResolvedValueOnce({ firstname: 'John', lastname: 'Doe', roles: ['ROLE_STUDENT'] })
      mockGetProfile.mockResolvedValueOnce(mockedProfileOverview)
      route = await store.ensureAuthenticated({ delegated: true, force: true, to: mockTo })
    })

    BddTest().then('it should bypass session loading and return the login route', () => {
      expect(mockGetMe).not.toHaveBeenCalled()
      expect(mockGetProfile).not.toHaveBeenCalled()
      expect(mockCancelQueries).toHaveBeenCalledTimes(1)
      expect(route).toEqual({
        name: ROUTES.AUTH.LOGIN.name,
        query: { redirect: '/target' },
      })
      expect(mockReplace).not.toHaveBeenCalled()
    })
  })

  BddTest().when('invalidateSession is called after setting some state', () => {
    beforeEach(async () => {
      mockGetMe.mockResolvedValueOnce({ firstname: 'John', lastname: 'Doe', roles: ['ROLE_STUDENT'] })
      mockGetProfile.mockResolvedValueOnce(mockedProfileOverview)
      await store.ensureAuthenticated()
      store.invalidateSession()
    })

    BddTest().then('it should reset authentication related state', () => {
      expect(store.isLoggedIn).toBe(false)
      expect(store.profile).toBeNull()
      expect(store.categories).toEqual([])
    })
  })
})
