import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { meUnauthorizedHandler, mockedLoggedInUser } from '@/__mocks__/msw/handlers/shared/generic.handlers'
import { server } from '@/__mocks__/msw/server'
import { EUserCategory } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { useAuthStore } from '@/features/auth/global/stores/auth.store'
import { INVALID_SESSION } from '@/features/auth/global/stores/auth.store.constants'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, expect, vi } from 'vitest'

const mockTo = { fullPath: '/target' } as RouteLocationNormalized

const { mockReplace } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
}))

vi.mock('@/router', () => ({
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
const mockClear = vi.fn()

vi.mock('@tanstack/vue-query', () => ({
  useQueryClient: () => ({
    cancelQueries: mockCancelQueries,
    clear: mockClear
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

  afterEach(() => {
    server.resetHandlers()
  })

  BddTest().when('the store is initialized', () => {
    BddTest().then('it should expose default state', () => {
      expect(store).toBeDefined()
      expect(store.isLoggedIn).toBe(false)
      expect(store.session).toEqual(INVALID_SESSION)
      expect(store.selectedUserCategory).toBeUndefined()
      expect(store.ensureAuthenticated).toBeTypeOf('function')
      expect(store.invalidateSession).toBeTypeOf('function')
      expect(store.patchSession).toBeTypeOf('function')
    })
  })

  BddTest().when('ensureAuthenticated is called with { delegated: false } and user authenticated', () => {
    beforeEach(async () => {
      route = await store.ensureAuthenticated({ delegated: false, to: mockTo })
    })

    BddTest().then('it should try to load the session and succeed', () => {
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
      expect(store.isLoggedIn).toBe(true)
      expect(store.session).toEqual(mockedLoggedInUser)
    })

    BddTest().then('it should return undefined and not navigate to the login route', () => {
      expect(mockCancelQueries).not.toHaveBeenCalled()
      expect(route).toBeUndefined()
      expect(mockReplace).not.toHaveBeenCalled()
    })
  })

  BddTest().when('ensureAuthenticated is called with { delegated: false } and user not authenticated', () => {
    beforeEach(async () => {
      server.use(meUnauthorizedHandler)
      route = await store.ensureAuthenticated({ delegated: false, to: mockTo })
    })

    BddTest().then('it should try to load the session and fail', () => {
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
      expect(store.isLoggedIn).toBe(false)
      expect(store.session).toEqual(INVALID_SESSION)
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
      server.use(meUnauthorizedHandler)
      route = await store.ensureAuthenticated({ delegated: false })
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

  BddTest().when('ensureAuthenticated is called with { delegated: true } and user authenticated', () => {
    beforeEach(async () => {
      route = await store.ensureAuthenticated({ delegated: true, to: mockTo })
    })

    BddTest().then('it should try to load the session and succeed', () => {
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
      expect(store.isLoggedIn).toBe(true)
    })

    BddTest().then('it should return undefined and not navigate', () => {
      expect(mockCancelQueries).not.toHaveBeenCalled()
      expect(route).toBeUndefined()
      expect(mockReplace).not.toHaveBeenCalled()
    })
  })

  BddTest().when('ensureAuthenticated is called with { delegated: true } and user not authenticated', () => {
    beforeEach(async () => {
      server.use(meUnauthorizedHandler)
      route = await store.ensureAuthenticated({ delegated: true, to: mockTo })
    })

    BddTest().then('it should try to load the session and fail', () => {
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
      expect(store.isLoggedIn).toBe(false)
      expect(store.session).toEqual(INVALID_SESSION)
    })

    BddTest().then('it should return the login route instead of navigating', () => {
      expect(mockCancelQueries).toHaveBeenCalledTimes(1)
      expect(route).toEqual({
        name: ROUTES.AUTH.LOGIN.name,
        query: { redirect: '/target' },
      })
      expect(mockReplace).not.toHaveBeenCalled()
    })
  })

  BddTest().when('ensureAuthenticated is called with { force: true }', () => {
    beforeEach(async () => {
      route = await store.ensureAuthenticated({ force: true, to: mockTo })
    })

    BddTest().then('it should redirect immediately even though the session is valid', () => {
      expect(store.isLoggedIn).toBe(false)
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
      route = await store.ensureAuthenticated({ delegated: true, force: true, to: mockTo })
    })

    BddTest().then('it should return the login route even though the session is valid', () => {
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
      await store.ensureAuthenticated()
      store.selectedUserCategory = EUserCategory.STUDENT
      store.invalidateSession()
    })

    BddTest().then('it should reset authentication related state', () => {
      expect(store.isLoggedIn).toBe(false)
      expect(store.session).toEqual(INVALID_SESSION)
      expect(store.selectedUserCategory).toBeUndefined()
    })

    BddTest().then('it should clear the cached queries', () => {
      expect(mockClear).toHaveBeenCalledTimes(1)
    })
  })

  BddTest().when('patchSession is called with a loaded session', () => {
    beforeEach(async () => {
      await store.ensureAuthenticated()
      store.patchSession({ firstname: 'Jane' })
    })

    BddTest().then('it should merge the patch into the session', () => {
      expect(store.session).toEqual({ ...mockedLoggedInUser, firstname: 'Jane' })
    })
  })

  BddTest().when('patchSession is called without a session', () => {
    beforeEach(() => {
      store.patchSession({ firstname: 'Jane' })
    })

    BddTest().then('it should do nothing', () => {
      expect(store.session).toEqual(INVALID_SESSION)
    })
  })
})
