import type { RouteLocationRaw } from 'vue-router'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { meUnauthorizedHandler, mockedLoggedInUser } from '@/__mocks__/msw/handlers/shared/generic.handlers'
import { server } from '@/__mocks__/msw/server'
import { EUserCategory } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { useAuthStore } from '@/features/auth/global/stores/auth.store'
import { INVALID_SESSION } from '@/features/auth/global/stores/auth.store.constants'

const TARGET = '/target'

const LOGIN_ROUTE = {
  name: ROUTES.AUTH.LOGIN.name,
  query: { redirect: TARGET },
}

const mockAddErrorMessage = vi.fn()

vi.mock('@/store', () => ({
  useToasterStore: () => ({
    addErrorMessage: mockAddErrorMessage,
  }),
}))

const mockCancelQueries = vi.fn()
const mockClear = vi.fn()

vi.mock('@tanstack/vue-query', () => ({
  useQueryClient: () => ({
    cancelQueries: mockCancelQueries,
    clear: mockClear,
  }),
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

  BddTest().when('ensureAuthenticated is called and the api returns a valid session', () => {
    beforeEach(async () => {
      route = await store.ensureAuthenticated(TARGET)
    })

    BddTest().then('it should load the session', () => {
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
      expect(store.isLoggedIn).toBe(true)
      expect(store.session).toEqual(mockedLoggedInUser)
    })

    BddTest().then('it should not ask for any redirection', () => {
      expect(route).toBeUndefined()
      expect(mockCancelQueries).not.toHaveBeenCalled()
      expect(mockClear).not.toHaveBeenCalled()
    })
  })

  BddTest().when('ensureAuthenticated is called again once the session is loaded', () => {
    beforeEach(async () => {
      await store.ensureAuthenticated(TARGET)
      server.use(meUnauthorizedHandler)
      route = await store.ensureAuthenticated(TARGET)
    })

    BddTest().then('it should trust the loaded session instead of calling the api again', () => {
      expect(route).toBeUndefined()
      expect(store.isLoggedIn).toBe(true)
      expect(store.session).toEqual(mockedLoggedInUser)
      expect(mockCancelQueries).not.toHaveBeenCalled()
    })
  })

  BddTest().when('ensureAuthenticated is called and the api answers 401', () => {
    beforeEach(async () => {
      server.use(meUnauthorizedHandler)
      route = await store.ensureAuthenticated(TARGET)
    })

    BddTest().then('it should fail to load the session without displaying an error', () => {
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
      expect(store.isLoggedIn).toBe(false)
      expect(store.session).toEqual(INVALID_SESSION)
    })

    BddTest().then('it should return the login route with the target as redirect', () => {
      expect(route).toEqual(LOGIN_ROUTE)
    })

    BddTest().then('it should invalidate the session and cancel the pending queries', () => {
      expect(mockClear).toHaveBeenCalledTimes(1)
      expect(mockCancelQueries).toHaveBeenCalledTimes(1)
    })
  })

  BddTest().when('ensureAuthenticated is forced before any session load', () => {
    beforeEach(async () => {
      route = await store.ensureAuthenticated(TARGET, true)
    })

    BddTest().then('it should redirect immediately instead of loading the session', () => {
      expect(route).toEqual(LOGIN_ROUTE)
      expect(store.isLoggedIn).toBe(false)
      expect(store.session).toEqual(INVALID_SESSION)
    })

    BddTest().then('it should invalidate the session and cancel the pending queries', () => {
      expect(mockClear).toHaveBeenCalledTimes(1)
      expect(mockCancelQueries).toHaveBeenCalledTimes(1)
    })
  })

  BddTest().when('ensureAuthenticated is forced after the session was loaded (401 received mid-session)', () => {
    beforeEach(async () => {
      await store.ensureAuthenticated(TARGET)
      route = await store.ensureAuthenticated(TARGET, true)
    })

    BddTest().then('it should return the login route', () => {
      expect(route).toEqual(LOGIN_ROUTE)
    })

    BddTest().then('it should drop the loaded session and cancel the pending queries', () => {
      expect(store.isLoggedIn).toBe(false)
      expect(store.session).toEqual(INVALID_SESSION)
      expect(mockClear).toHaveBeenCalledTimes(1)
      expect(mockCancelQueries).toHaveBeenCalledTimes(1)
    })
  })

  BddTest().when('ensureAuthenticated is forced several times at once (burst of 401)', () => {
    let routes: (RouteLocationRaw | undefined)[]

    beforeEach(async () => {
      routes = await Promise.all([
        store.ensureAuthenticated(TARGET, true),
        store.ensureAuthenticated(TARGET, true),
        store.ensureAuthenticated(TARGET, true),
      ])
    })

    BddTest().then('it should only return the login route to the first call', () => {
      expect(routes).toEqual([LOGIN_ROUTE, undefined, undefined])
    })

    BddTest().then('it should only invalidate the session and cancel the queries once', () => {
      expect(mockClear).toHaveBeenCalledTimes(1)
      expect(mockCancelQueries).toHaveBeenCalledTimes(1)
    })
  })

  BddTest().when('invalidateSession is called after setting some state', () => {
    beforeEach(async () => {
      await store.ensureAuthenticated(TARGET)
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
      await store.ensureAuthenticated(TARGET)
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
