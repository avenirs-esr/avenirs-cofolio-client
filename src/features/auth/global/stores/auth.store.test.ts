import type { RouteLocationRaw } from 'vue-router'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mockAddErrorMessage } from 'tests/mocks'
import { mountComposable } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { meServerErrorHandler, meUnauthorizedHandler, mockedLoggedInUser } from '@/__mocks__/msw/handlers/shared/generic.handlers'
import { server } from '@/__mocks__/msw/server'
import { EUserCategory, getMe } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { useAuthStore } from '@/features/auth/global/stores/auth.store'
import { AUTH_PREFS_KEY, AUTH_SESSION_KEY } from '@/features/auth/global/stores/auth.store.constants'
import { SessionCheck } from '@/features/auth/global/stores/auth.store.types'

const TARGET = '/target'

const LOGIN_ROUTE = {
  name: ROUTES.AUTH.LOGIN.name,
  query: { redirect: TARGET },
}

vi.mock('@/store', () => ({
  useToasterStore: () => ({
    addErrorMessage: mockAddErrorMessage,
  }),
}))

const mockClear = vi.fn()

vi.mock('@tanstack/vue-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/vue-query')>()

  return { ...actual, useQueryClient: () => ({ clear: mockClear }) }
})

vi.mock('@/api/avenir-esr', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/avenir-esr')>()

  return { ...actual, getMe: vi.fn(actual.getMe) }
})

const { mockReplace, mockRoute, CURRENT_ROUTE } = vi.hoisted(() => {
  const CURRENT_ROUTE = '/current-route'

  return {
    mockReplace: vi.fn(),
    mockRoute: { value: { fullPath: CURRENT_ROUTE, meta: {} as { public?: boolean } } },
    CURRENT_ROUTE,
  }
})

vi.mock('@/router', () => ({
  default: {
    replace: mockReplace,
    currentRoute: mockRoute,
  },
}))

const CURRENT_LOGIN_ROUTE = {
  name: ROUTES.AUTH.LOGIN.name,
  query: { redirect: CURRENT_ROUTE },
}

function sendStorageEvent (newValue: string | null, key: string | null = AUTH_SESSION_KEY, storageArea: Storage = localStorage) {
  window.dispatchEvent(new StorageEvent('storage', { key, newValue, storageArea }))
}

function setVisibility (state: DocumentVisibilityState) {
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => state })
}

function hideTab () {
  setVisibility('hidden')
  document.dispatchEvent(new Event('visibilitychange'))
}

function showTab () {
  setVisibility('visible')
  document.dispatchEvent(new Event('visibilitychange'))
}

BddTest().given('an auth store with mocked dependencies', () => {
  let store: ReturnType<typeof useAuthStore>
  let route: RouteLocationRaw | false | undefined
  let check: SessionCheck

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    store = useAuthStore()
  })

  afterEach(() => {
    store.$dispose()
    server.resetHandlers()
  })

  BddTest().when('the store is initialized', () => {
    BddTest().then('it should expose default state', () => {
      expect(store.isLoggedIn).toBe(false)
      expect(store.session).toBeUndefined()
      expect(store.selectedUserCategory).toBeUndefined()
      expect(store.ensureSession).toBeTypeOf('function')
      expect(store.revalidateSession).toBeTypeOf('function')
      expect(store.redirectToLogin).toBeTypeOf('function')
      expect(store.invalidateSession).toBeTypeOf('function')
      expect(store.patchSession).toBeTypeOf('function')
    })
  })

  BddTest().when('ensureSession is called without a session and the api returns a valid one', () => {
    beforeEach(async () => {
      route = await store.ensureSession(TARGET)
    })

    BddTest().then('it should load the session', () => {
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
      expect(store.isLoggedIn).toBe(true)
      expect(store.session).toEqual(mockedLoggedInUser)
    })

    BddTest().then('it should let the navigation go on without any redirection', () => {
      expect(route).toBeUndefined()
      expect(mockClear).not.toHaveBeenCalled()
    })
  })

  BddTest().when('ensureSession is called again once the session is loaded', () => {
    beforeEach(async () => {
      await store.ensureSession(TARGET)
      server.use(meUnauthorizedHandler)
      route = await store.ensureSession(TARGET)
    })

    BddTest().then('it should trust the loaded session instead of calling the api again', () => {
      expect(route).toBeUndefined()
      expect(store.isLoggedIn).toBe(true)
      expect(store.session).toEqual(mockedLoggedInUser)
      expect(getMe).toHaveBeenCalledTimes(1)
      expect(mockClear).not.toHaveBeenCalled()
    })
  })

  BddTest().when('ensureSession is called without a session and the api answers 401', () => {
    beforeEach(async () => {
      server.use(meUnauthorizedHandler)
      route = await store.ensureSession(TARGET)
    })

    BddTest().then('it should stay without a session and display no error', () => {
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
      expect(store.isLoggedIn).toBe(false)
      expect(store.session).toBeUndefined()
    })

    BddTest().then('it should return the login route with the target as redirect', () => {
      expect(route).toEqual(LOGIN_ROUTE)
    })

    BddTest().then('it should invalidate the session and clear the cached queries', () => {
      expect(mockClear).toHaveBeenCalledTimes(1)
    })
  })

  BddTest().when('ensureSession is called without a session and the api answers 500', () => {
    beforeEach(async () => {
      server.use(meServerErrorHandler)
      route = await store.ensureSession(TARGET)
    })

    BddTest().then('it should display the error and abort the navigation', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledTimes(1)
      expect(route).toBe(false)
    })

    BddTest().then('it should not redirect to login', () => {
      expect(store.isLoggedIn).toBe(false)
      expect(mockClear).not.toHaveBeenCalled()
    })
  })

  BddTest().when('ensureSession is called several times at once without a session (concurrent navigations)', () => {
    let routes: (RouteLocationRaw | false | undefined)[]

    beforeEach(async () => {
      server.use(meUnauthorizedHandler)
      routes = await Promise.all([
        store.ensureSession(TARGET),
        store.ensureSession(TARGET),
        store.ensureSession(TARGET),
      ])
    })

    BddTest().then('it should only redirect the first navigation and abort the others', () => {
      expect(routes).toEqual([LOGIN_ROUTE, false, false])
    })

    BddTest().then('it should only call the api and invalidate the session once', () => {
      expect(getMe).toHaveBeenCalledTimes(1)
      expect(mockClear).toHaveBeenCalledTimes(1)
    })
  })

  BddTest().when('ensureSession is called again after a redirect to login (new navigation without a session)', () => {
    beforeEach(async () => {
      server.use(meUnauthorizedHandler)
      await store.ensureSession(TARGET)
      route = await store.ensureSession(TARGET)
    })

    BddTest().then('it should check the session again and redirect again instead of staying blocked', () => {
      expect(route).toEqual(LOGIN_ROUTE)
      expect(getMe).toHaveBeenCalledTimes(2)
      expect(mockClear).toHaveBeenCalledTimes(2)
    })
  })

  BddTest().when('revalidateSession is called on an outdated session and the api returns a valid one', () => {
    beforeEach(async () => {
      await store.ensureSession(TARGET)
      store.patchSession({ firstname: 'Outdated' })
      store.selectedUserCategory = EUserCategory.STUDENT
      check = await store.revalidateSession()
    })

    BddTest().then('it should refresh the session and keep the selected category', () => {
      expect(check).toBe(SessionCheck.VALID)
      expect(store.session).toEqual(mockedLoggedInUser)
      expect(store.selectedUserCategory).toBe(EUserCategory.STUDENT)
    })

    BddTest().then('it should not clear anything', () => {
      expect(mockClear).not.toHaveBeenCalled()
    })
  })

  BddTest().when('revalidateSession is called mid-session and the api answers 401', () => {
    beforeEach(async () => {
      await store.ensureSession(TARGET)
      server.use(meUnauthorizedHandler)
      check = await store.revalidateSession()
    })

    BddTest().then('it should report the user as unauthorized without displaying an error', () => {
      expect(check).toBe(SessionCheck.UNAUTHORIZED)
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })

    BddTest().then('it should leave the invalidation to redirectToLogin', () => {
      expect(store.isLoggedIn).toBe(true)
      expect(mockClear).not.toHaveBeenCalled()
    })
  })

  BddTest().when('revalidateSession is called mid-session and the api answers 500', () => {
    beforeEach(async () => {
      await store.ensureSession(TARGET)
      server.use(meServerErrorHandler)
      check = await store.revalidateSession()
    })

    BddTest().then('it should display the error and report a failure', () => {
      expect(check).toBe(SessionCheck.ERROR)
      expect(mockAddErrorMessage).toHaveBeenCalledTimes(1)
    })

    BddTest().then('it should keep the session instead of logging the user out', () => {
      expect(store.isLoggedIn).toBe(true)
      expect(store.session).toEqual(mockedLoggedInUser)
      expect(mockClear).not.toHaveBeenCalled()
    })
  })

  BddTest().when('revalidateSession is called several times at once (burst of 401)', () => {
    let checks: SessionCheck[]

    beforeEach(async () => {
      checks = await Promise.all([
        store.revalidateSession(),
        store.revalidateSession(),
        store.revalidateSession(),
      ])
    })

    BddTest().then('it should share a single request and its result', () => {
      expect(checks).toEqual([SessionCheck.VALID, SessionCheck.VALID, SessionCheck.VALID])
      expect(getMe).toHaveBeenCalledTimes(1)
    })
  })

  BddTest().when('revalidateSession is called again once the previous call settled', () => {
    beforeEach(async () => {
      await store.revalidateSession()
      await store.revalidateSession()
    })

    BddTest().then('it should call the api again', () => {
      expect(getMe).toHaveBeenCalledTimes(2)
    })
  })

  BddTest().when('redirectToLogin is called with a loaded session', () => {
    beforeEach(async () => {
      await store.ensureSession(TARGET)
      store.selectedUserCategory = EUserCategory.STUDENT
      route = store.redirectToLogin(TARGET)
    })

    BddTest().then('it should return the login route with the target as redirect', () => {
      expect(route).toEqual(LOGIN_ROUTE)
    })

    BddTest().then('it should drop the session and clear the cached queries', () => {
      expect(store.isLoggedIn).toBe(false)
      expect(store.session).toBeUndefined()
      expect(store.selectedUserCategory).toBeUndefined()
      expect(mockClear).toHaveBeenCalledTimes(1)
    })
  })

  BddTest().when('redirectToLogin is called several times (burst of 401)', () => {
    let routes: (RouteLocationRaw | undefined)[]

    beforeEach(() => {
      routes = [
        store.redirectToLogin(TARGET),
        store.redirectToLogin(TARGET),
        store.redirectToLogin(TARGET),
      ]
    })

    BddTest().then('it should only return the login route to the first call', () => {
      expect(routes).toEqual([LOGIN_ROUTE, undefined, undefined])
    })

    BddTest().then('it should only invalidate the session once', () => {
      expect(mockClear).toHaveBeenCalledTimes(1)
    })
  })

  BddTest().when('a session comes back after a redirect to login (late 401 confirmed valid by /me)', () => {
    beforeEach(async () => {
      store.redirectToLogin(TARGET)
      await store.revalidateSession()
      route = store.redirectToLogin(TARGET)
    })

    BddTest().then('it should redirect again at the next expiry instead of staying blocked', () => {
      expect(route).toEqual(LOGIN_ROUTE)
      expect(mockClear).toHaveBeenCalledTimes(2)
    })
  })

  BddTest().when('invalidateSession is called after setting some state', () => {
    beforeEach(async () => {
      await store.ensureSession(TARGET)
      store.selectedUserCategory = EUserCategory.STUDENT
      store.invalidateSession()
    })

    BddTest().then('it should reset authentication related state', () => {
      expect(store.isLoggedIn).toBe(false)
      expect(store.session).toBeUndefined()
      expect(store.selectedUserCategory).toBeUndefined()
    })

    BddTest().then('it should clear the cached queries', () => {
      expect(mockClear).toHaveBeenCalledTimes(1)
    })
  })

  BddTest().when('patchSession is called with a loaded session', () => {
    beforeEach(async () => {
      await store.ensureSession(TARGET)
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
      expect(store.session).toBeUndefined()
    })
  })
})

BddTest().given('an auth store shared with the other tabs of the browser', () => {
  let store: ReturnType<typeof useAuthStore>

  beforeEach(() => {
    vi.clearAllMocks()
    setVisibility('visible')
    mockRoute.value.meta = {}
    setActivePinia(createPinia())
    store = useAuthStore()
  })

  afterEach(() => {
    store.$dispose()
    Reflect.deleteProperty(document, 'visibilityState')
    server.resetHandlers()
  })

  BddTest().when('another tab stores a session (login or revalidation) while this tab has none', () => {
    beforeEach(() => {
      server.use(meUnauthorizedHandler)
      sendStorageEvent(JSON.stringify({ session: mockedLoggedInUser }))
    })

    BddTest().then('it should adopt the session without calling the api', () => {
      expect(store.isLoggedIn).toBe(true)
      expect(store.session).toEqual(mockedLoggedInUser)
      expect(getMe).not.toHaveBeenCalled()
    })
  })

  BddTest().when('another tab patches the session already loaded here', () => {
    beforeEach(async () => {
      await store.ensureSession(TARGET)
      sendStorageEvent(JSON.stringify({ session: { ...mockedLoggedInUser, firstname: 'Jane' } }))
    })

    BddTest().then('it should replace the session with the patched one', () => {
      expect(store.session).toEqual({ ...mockedLoggedInUser, firstname: 'Jane' })
      expect(getMe).toHaveBeenCalledTimes(1)
    })
  })

  BddTest().when('another tab drops the session while this tab displays a protected page', () => {
    beforeEach(async () => {
      await store.ensureSession(TARGET)
      store.selectedUserCategory = EUserCategory.STUDENT
      sendStorageEvent('{}')
      await vi.waitFor(() => expect(mockReplace).toHaveBeenCalledTimes(1))
    })

    BddTest().then('it should go to the login route like a 401 received here', () => {
      expect(mockReplace).toHaveBeenCalledWith(CURRENT_LOGIN_ROUTE)
    })

    BddTest().then('it should reset the state and clear the cached queries without calling the api again', () => {
      expect(store.isLoggedIn).toBe(false)
      expect(store.selectedUserCategory).toBeUndefined()
      expect(mockClear).toHaveBeenCalledTimes(1)
      expect(getMe).toHaveBeenCalledTimes(1)
    })
  })

  BddTest().when('another tab removes the session entry', () => {
    beforeEach(async () => {
      await store.ensureSession(TARGET)
      sendStorageEvent(null)
      await vi.waitFor(() => expect(mockReplace).toHaveBeenCalledTimes(1))
    })

    BddTest().then('it should handle it as a dropped session', () => {
      expect(mockReplace).toHaveBeenCalledWith(CURRENT_LOGIN_ROUTE)
      expect(store.isLoggedIn).toBe(false)
    })
  })

  BddTest().when('another tab clears the whole localStorage', () => {
    beforeEach(async () => {
      await store.ensureSession(TARGET)
      sendStorageEvent(null, null)
      await vi.waitFor(() => expect(mockReplace).toHaveBeenCalledTimes(1))
    })

    BddTest().then('it should handle it as a dropped session', () => {
      expect(mockReplace).toHaveBeenCalledWith(CURRENT_LOGIN_ROUTE)
      expect(store.isLoggedIn).toBe(false)
    })
  })

  BddTest().when('another tab writes an unreadable session entry', () => {
    beforeEach(async () => {
      await store.ensureSession(TARGET)
      sendStorageEvent('{not json')
      await flushPromises()
    })

    BddTest().then('it should ignore it instead of logging the user out', () => {
      expect(store.isLoggedIn).toBe(true)
      expect(mockReplace).not.toHaveBeenCalled()
      expect(mockClear).not.toHaveBeenCalled()
    })
  })

  BddTest().when('another tab drops the session while this tab is hidden', () => {
    beforeEach(async () => {
      await store.ensureSession(TARGET)
      hideTab()
      sendStorageEvent('{}')
      await flushPromises()
    })

    BddTest().then('it should reset the state right away without navigating', () => {
      expect(store.isLoggedIn).toBe(false)
      expect(mockClear).toHaveBeenCalledTimes(1)
      expect(mockReplace).not.toHaveBeenCalled()
    })
  })

  BddTest().when('this tab is shown again after another tab dropped the session while it was hidden', () => {
    beforeEach(async () => {
      await store.ensureSession(TARGET)
      hideTab()
      sendStorageEvent('{}')
      showTab()
      await vi.waitFor(() => expect(mockReplace).toHaveBeenCalledTimes(1))
    })

    BddTest().then('it should go to the login route with the current page as target', () => {
      expect(mockReplace).toHaveBeenCalledWith(CURRENT_LOGIN_ROUTE)
    })
  })

  BddTest().when('this tab is shown again after a session came back from another tab (login again)', () => {
    beforeEach(async () => {
      await store.ensureSession(TARGET)
      hideTab()
      sendStorageEvent('{}')
      sendStorageEvent(JSON.stringify({ session: { ...mockedLoggedInUser, firstname: 'Jane' } }))
      showTab()
      await flushPromises()
    })

    BddTest().then('it should keep the new session and not redirect', () => {
      expect(store.session).toEqual({ ...mockedLoggedInUser, firstname: 'Jane' })
      expect(mockReplace).not.toHaveBeenCalled()
    })
  })

  BddTest().when('this tab is shown again after one of its own requests revalidated the session', () => {
    beforeEach(async () => {
      await store.ensureSession(TARGET)
      hideTab()
      sendStorageEvent('{}')
      await store.revalidateSession()
      showTab()
      await flushPromises()
    })

    BddTest().then('it should keep the session and not redirect', () => {
      expect(store.isLoggedIn).toBe(true)
      expect(mockReplace).not.toHaveBeenCalled()
    })
  })

  BddTest().when('this tab is hidden then shown again while the session did not change', () => {
    beforeEach(async () => {
      await store.ensureSession(TARGET)
      hideTab()
      showTab()
      await flushPromises()
    })

    BddTest().then('it should do nothing', () => {
      expect(store.isLoggedIn).toBe(true)
      expect(mockReplace).not.toHaveBeenCalled()
      expect(mockClear).not.toHaveBeenCalled()
    })
  })

  BddTest().when('another tab drops the session while this tab displays a public page', () => {
    beforeEach(async () => {
      await store.ensureSession(TARGET)
      mockRoute.value.meta = { public: true }
      sendStorageEvent('{}')
      await vi.waitFor(() => expect(store.isLoggedIn).toBe(false))
      await flushPromises()
    })

    BddTest().then('it should reset the state without sending the user to login', () => {
      expect(mockClear).toHaveBeenCalledTimes(1)
      expect(mockReplace).not.toHaveBeenCalled()
    })
  })

  BddTest().when('a storage event does not concern the session entry of the localStorage', () => {
    beforeEach(async () => {
      await store.ensureSession(TARGET)
      sendStorageEvent(JSON.stringify({ selectedUserCategory: EUserCategory.STUDENT }), AUTH_PREFS_KEY)
      sendStorageEvent('dark', 'theme')
      sendStorageEvent('{}', AUTH_SESSION_KEY, sessionStorage)
      await flushPromises()
    })

    BddTest().then('it should keep the session and not redirect', () => {
      expect(store.isLoggedIn).toBe(true)
      expect(mockReplace).not.toHaveBeenCalled()
      expect(mockClear).not.toHaveBeenCalled()
    })
  })

  BddTest().when('another tab drops the session while this tab has none', () => {
    beforeEach(async () => {
      sendStorageEvent('{}')
      await flushPromises()
    })

    BddTest().then('it should do nothing', () => {
      expect(mockReplace).not.toHaveBeenCalled()
      expect(mockClear).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the store is disposed', () => {
    beforeEach(async () => {
      await store.ensureSession(TARGET)
      store.$dispose()
      sendStorageEvent('{}')
      await flushPromises()
    })

    BddTest().then('it should stop reacting to the other tabs', () => {
      expect(mockReplace).not.toHaveBeenCalled()
      expect(mockClear).not.toHaveBeenCalled()
    })
  })
})

BddTest().given('an auth store with the persistence plugin', () => {
  let store: ReturnType<typeof useAuthStore>
  let unmount: () => void

  const createStore = () => {
    const mounted = mountComposable(() => useAuthStore(), {
      usePinia: true,
    })

    unmount = mounted.unmount

    return mounted.result
  }

  const disposeStore = () => {
    store.$dispose()
    unmount()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  afterEach(() => {
    disposeStore()
    server.resetHandlers()
  })

  BddTest().when('a session is loaded and a category is selected', () => {
    beforeEach(async () => {
      store = createStore()
      await store.ensureSession(TARGET)
      store.selectedUserCategory = EUserCategory.STUDENT
      await flushPromises()
    })

    BddTest().then('it should persist the session and the category in two separate localStorage entries', () => {
      expect(JSON.parse(localStorage.getItem(AUTH_SESSION_KEY) ?? '{}')).toEqual({ session: mockedLoggedInUser })
      expect(JSON.parse(localStorage.getItem(AUTH_PREFS_KEY) ?? '{}')).toEqual({ selectedUserCategory: EUserCategory.STUDENT })
    })
  })

  BddTest().when('the store is created again with persisted data (page reload)', () => {
    beforeEach(() => {
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ session: mockedLoggedInUser }))
      localStorage.setItem(AUTH_PREFS_KEY, JSON.stringify({ selectedUserCategory: EUserCategory.STUDENT }))
      server.use(meUnauthorizedHandler)
      store = createStore()
    })

    BddTest().then('it should restore the session and the category', () => {
      expect(store.isLoggedIn).toBe(true)
      expect(store.session).toEqual(mockedLoggedInUser)
      expect(store.selectedUserCategory).toBe(EUserCategory.STUDENT)
    })

    BddTest().then('it should trust the restored session without calling the api', async () => {
      expect(await store.ensureSession(TARGET)).toBeUndefined()
      expect(getMe).not.toHaveBeenCalled()
    })
  })

  BddTest().when('another tab stores a session', () => {
    const payload = JSON.stringify({ session: mockedLoggedInUser })

    beforeEach(async () => {
      store = createStore()
      sendStorageEvent(payload)
      await flushPromises()
    })

    BddTest().then('it should persist exactly what it received, so that no event bounces back to the other tabs', () => {
      expect(localStorage.getItem(AUTH_SESSION_KEY)).toBe(payload)
    })
  })

  BddTest().when('the session is invalidated (logout)', () => {
    beforeEach(async () => {
      store = createStore()
      await store.ensureSession(TARGET)
      store.selectedUserCategory = EUserCategory.STUDENT
      await flushPromises()
      store.invalidateSession()
      await flushPromises()
    })

    BddTest().then('it should drop the session and the category in memory', () => {
      expect(store.session).toBeUndefined()
      expect(store.isLoggedIn).toBe(false)
      expect(store.selectedUserCategory).toBeUndefined()
    })

    BddTest().then('it should persist the drop, so that the other tabs see it', () => {
      expect(JSON.parse(localStorage.getItem(AUTH_SESSION_KEY) ?? 'null')).toEqual({})
      expect(JSON.parse(localStorage.getItem(AUTH_PREFS_KEY) ?? 'null')).toEqual({})
    })

    BddTest().then('it should start without session nor category after a reload', () => {
      disposeStore()
      store = createStore()

      expect(store.isLoggedIn).toBe(false)
      expect(store.selectedUserCategory).toBeUndefined()
    })
  })

  BddTest().when('a redirect to login is triggered (401 confirmed by /me)', () => {
    beforeEach(async () => {
      store = createStore()
      await store.ensureSession(TARGET)
      await flushPromises()
      store.redirectToLogin(TARGET)
      await flushPromises()
    })

    BddTest().then('it should persist the drop as well, so that the other tabs follow', () => {
      expect(JSON.parse(localStorage.getItem(AUTH_SESSION_KEY) ?? 'null')).toEqual({})
    })
  })
})
