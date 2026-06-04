import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { mockedStaffProfileOverview } from '@/__mocks__/fixtures/staffs/user.fixtures'
import { mockedProfileOverview } from '@/__mocks__/fixtures/student'
import { ROUTES } from '@/common/constants'
import { BaseApiException } from '@/common/exceptions'
import { HttpStatusCode } from '@/common/utils'
import { useAuthStore } from '@/features/auth/global/stores/auth.store'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, expect, vi } from 'vitest'

const { mockGetProfile, mockReplace } = vi.hoisted(() => ({
  mockGetProfile: vi.fn(),
  mockReplace: vi.fn(),
}))

const mockUnauthorizedError = new BaseApiException('Unauthorized', HttpStatusCode.UNAUTHORIZED)

vi.mock('@/api/avenir-esr', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/avenir-esr')>()
  return {
    ...actual,
    getProfile: mockGetProfile
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
      mockGetProfile.mockResolvedValueOnce(mockedProfileOverview)
      route = await store.ensureAuthenticated({ delegated: false, to: mockTo })
    })

    BddTest().then('it should try to load the session and succeed', () => {
      expect(mockGetProfile).toHaveBeenCalledTimes(1)
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
      expect(store.isLoggedIn).toBe(true)
      expect(store.profile).not.toBeNull()
    })

    BddTest().then('it should return undefined and not navigate to the login route', () => {
      expect(mockCancelQueries).not.toHaveBeenCalled()
      expect(route).toBeUndefined()
      expect(mockReplace).not.toHaveBeenCalled()
    })
  })

  BddTest().when('ensureAuthenticated is called with { delegated: false } and user authenticated as STAFF', () => {
    beforeEach(async () => {
      mockGetProfile.mockRejectedValueOnce(new BaseApiException('Not found', 404))
      mockGetProfile.mockResolvedValueOnce(mockedStaffProfileOverview)
      route = await store.ensureAuthenticated({ delegated: false, to: mockTo })
    })

    BddTest().then('it should try to load the session and succeed', () => {
      expect(mockGetProfile).toHaveBeenCalledTimes(2)
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
      expect(store.isLoggedIn).toBe(true)
      expect(store.profile).not.toBeNull()
    })

    BddTest().then('it should return undefined and not navigate to the login route', () => {
      expect(mockCancelQueries).not.toHaveBeenCalled()
      expect(route).toBeUndefined()
      expect(mockReplace).not.toHaveBeenCalled()
    })
  })

  BddTest().when('ensureAuthenticated is called with { delegated: false } and user not authenticated', () => {
    beforeEach(async () => {
      mockGetProfile.mockRejectedValueOnce(mockUnauthorizedError)
      route = await store.ensureAuthenticated({ delegated: false, to: mockTo })
    })

    BddTest().then('it should try to load the session and fail', () => {
      expect(mockGetProfile).toHaveBeenCalledTimes(1)
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
      mockGetProfile.mockRejectedValueOnce(mockUnauthorizedError)
      route = await store.ensureAuthenticated({ delegated: false })
    })

    BddTest().then('it should try to load the session and fail', () => {
      expect(mockGetProfile).toHaveBeenCalledTimes(1)
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
      mockGetProfile.mockResolvedValueOnce(mockedProfileOverview)
      route = await store.ensureAuthenticated({ delegated: true, to: mockTo })
    })

    BddTest().then('it should try to load the session and succeed', () => {
      expect(mockGetProfile).toHaveBeenCalledTimes(1)
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
      mockGetProfile.mockRejectedValueOnce(new BaseApiException('Not found', 404))
      mockGetProfile.mockResolvedValueOnce(mockedStaffProfileOverview)
      route = await store.ensureAuthenticated({ delegated: true, to: mockTo })
    })

    BddTest().then('it should try to load the session and succeed', () => {
      expect(mockGetProfile).toHaveBeenCalledTimes(2)
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
      mockGetProfile.mockRejectedValueOnce(mockUnauthorizedError)
      route = await store.ensureAuthenticated({ delegated: true, to: mockTo })
    })

    BddTest().then('it should try to load the session and fail', () => {
      expect(mockGetProfile).toHaveBeenCalledTimes(1)
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
      mockGetProfile.mockResolvedValueOnce(mockedProfileOverview)
      route = await store.ensureAuthenticated({ force: true, to: mockTo })
    })

    BddTest().then('it should bypass session loading and redirect immediately', () => {
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
      mockGetProfile.mockResolvedValueOnce(mockedProfileOverview)
      route = await store.ensureAuthenticated({ delegated: true, force: true, to: mockTo })
    })

    BddTest().then('it should bypass session loading and return the login route', () => {
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
      mockGetProfile.mockResolvedValueOnce(mockedProfileOverview)
      await store.ensureAuthenticated()
      store.invalidateSession()
    })

    BddTest().then('it should reset authentication related state', () => {
      expect(store.isLoggedIn).toBe(false)
      expect(store.profile).toBeNull()
    })
  })
})
