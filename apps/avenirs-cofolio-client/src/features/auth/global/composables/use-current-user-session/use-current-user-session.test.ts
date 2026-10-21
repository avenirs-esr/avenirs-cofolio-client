import type { LoggedInUserDTO } from '@/api/avenir-esr'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { mockedAcceptedCgu, mockedOutdatedAcceptedCgu } from '@/__mocks__/fixtures/shared/cgu.fixtures'
import { meAs, mockedLoggedInUser } from '@/__mocks__/msw/handlers/shared/generic.handlers'
import { server } from '@/__mocks__/msw/server'
import { EUniverse, EUserCategory } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { useCurrentUserSession } from '@/features/auth/global/composables/use-current-user-session/use-current-user-session'
import { INVALID_USER_CATEGORY } from '@/features/auth/global/composables/use-current-user-session/use-current-user-session.constants'
import { useAuthStore } from '@/features/auth/global/stores/auth.store'

vi.mock('@/router', () => ({
  default: {
    replace: vi.fn(),
    currentRoute: { value: { fullPath: '/current-route' } }
  }
}))

vi.mock('@/store', () => ({
  useToasterStore: () => ({
    addErrorMessage: vi.fn()
  })
}))

vi.mock('@tanstack/vue-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/vue-query')>()

  return {
    ...actual,
    useQueryClient: () => ({ clear: vi.fn() })
  }
})

BddTest().given('the current user session composable with the API served by MSW', () => {
  let authStore: ReturnType<typeof useAuthStore>
  let currentUserSession: ReturnType<typeof useCurrentUserSession>

  const createAuthStore = (selectedCategory?: EUserCategory) => {
    setActivePinia(createPinia())
    authStore = useAuthStore()
    authStore.selectedUserCategory = selectedCategory
  }

  const loginWith = async ({
    user,
    selectedCategory
  }: {
    user?: Partial<LoggedInUserDTO>
    selectedCategory?: EUserCategory
  } = {}) => {
    if (user) {
      server.use(meAs(user))
    }

    createAuthStore(selectedCategory)

    expect(await authStore.ensureSession('/target')).toBeUndefined()

    currentUserSession = useCurrentUserSession()
  }

  afterEach(() => {
    authStore.$dispose()
    vi.unstubAllEnvs()
    server.resetHandlers()
  })

  BddTest().when('nobody is logged in and the application runs in development', () => {
    beforeEach(() => {
      vi.stubEnv('DEV', true)
      createAuthStore()
    })

    BddTest().then('it should throw in development, where the router guard is expected to guarantee a session', () => {
      expect(() => useCurrentUserSession()).toThrow('without an active session')
    })
  })

  BddTest().when('nobody is logged in and the application runs in production', () => {
    beforeEach(() => {
      vi.stubEnv('DEV', false)
      createAuthStore()
      currentUserSession = useCurrentUserSession()
    })

    BddTest().then('it should expose no roles, no categories and no cgu', () => {
      expect(currentUserSession.roles.value).toEqual([])
      expect(currentUserSession.categories.value).toEqual([])
      expect(currentUserSession.profile.canSwitch.value).toBe(false)
      expect(currentUserSession.cgu.accepted.value).toBeUndefined()
      expect(currentUserSession.cgu.hasAcceptedLatest.value).toBe(false)
    })

    BddTest().then('it should fall back to the login route without writing the placeholder category into the store', () => {
      expect(currentUserSession.profile.defaultCategory.value).toBe(INVALID_USER_CATEGORY)
      expect(currentUserSession.profile.activeCategory.value).toBe(INVALID_USER_CATEGORY)
      expect(currentUserSession.profile.hasCategory.value).toBe(false)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.AUTH.LOGIN)
      expect(authStore.selectedUserCategory).toBeUndefined()
    })
  })

  BddTest().when('a user with only the STUDENT universe is logged in', () => {
    beforeEach(async () => {
      await loginWith({
        user: {
          universes: [EUniverse.STUDENT]
        }
      })
    })

    BddTest().then('it should expose the student category only', () => {
      expect(currentUserSession.universes.value).toEqual([EUniverse.STUDENT])
      expect(currentUserSession.categories.value).toEqual([EUserCategory.STUDENT])
      expect(currentUserSession.profile.canSwitch.value).toBe(false)
    })

    BddTest().then('it should use the student category and home route', () => {
      expect(currentUserSession.profile.activeCategory.value).toBe(EUserCategory.STUDENT)
      expect(currentUserSession.profile.hasCategory.value).toBe(true)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.STUDENT.HOME)
    })
  })

  BddTest().when('a user with only the STAFF universe is logged in', () => {
    beforeEach(async () => {
      await loginWith({
        user: {
          universes: [EUniverse.STAFF]
        }
      })
    })

    BddTest().then('it should expose the staff category only', () => {
      expect(currentUserSession.universes.value).toEqual([EUniverse.STAFF])
      expect(currentUserSession.categories.value).toEqual([EUserCategory.STAFF])
      expect(currentUserSession.profile.canSwitch.value).toBe(false)
    })

    BddTest().then('it should use the staff category and home route', () => {
      expect(currentUserSession.profile.activeCategory.value).toBe(EUserCategory.STAFF)
      expect(currentUserSession.profile.hasCategory.value).toBe(true)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.STAFF.HOME)
    })
  })

  BddTest().when('a user with a STAFF universe is logged in', () => {
    beforeEach(async () => {
      await loginWith({
        user: {
          universes: [EUniverse.STAFF]
        }
      })
    })

    BddTest().then('it should expose the staff category only', () => {
      expect(currentUserSession.universes.value).toEqual([EUniverse.STAFF])
      expect(currentUserSession.categories.value).toEqual([EUserCategory.STAFF])
      expect(currentUserSession.profile.canSwitch.value).toBe(false)
    })

    BddTest().then('it should use the staff category and home route', () => {
      expect(currentUserSession.profile.activeCategory.value).toBe(EUserCategory.STAFF)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.STAFF.HOME)
    })
  })

  BddTest().when('a user without any universe is logged in', () => {
    beforeEach(async () => {
      await loginWith({
        user: {
          universes: []
        }
      })
    })

    BddTest().then('it should expose no category and fall back to the login route', () => {
      expect(currentUserSession.categories.value).toEqual([])
      expect(currentUserSession.profile.hasCategory.value).toBe(false)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.AUTH.LOGIN)
    })
  })

  BddTest().when('a user with every universe is logged in', () => {
    beforeEach(async () => {
      await loginWith()
    })

    BddTest().then('it should expose every category once, by priority', () => {
      expect(currentUserSession.universes.value).toEqual(mockedLoggedInUser.universes)
      expect(currentUserSession.categories.value).toEqual([EUserCategory.STAFF, EUserCategory.STUDENT])
      expect(currentUserSession.profile.canSwitch.value).toBe(true)
    })

    BddTest().then('it should default to the highest priority category', () => {
      expect(currentUserSession.profile.defaultCategory.value).toBe(EUserCategory.STAFF)
      expect(currentUserSession.profile.activeCategory.value).toBe(EUserCategory.STAFF)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.STAFF.HOME)
    })
  })

  BddTest().when('a user with both profiles switches to the student profile', () => {
    beforeEach(async () => {
      await loginWith()
      await currentUserSession.profile.switch(EUserCategory.STUDENT)
    })

    BddTest().then('it should expose the student category and home route', () => {
      expect(currentUserSession.profile.activeCategory.value).toBe(EUserCategory.STUDENT)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.STUDENT.HOME)
    })

    BddTest().then('it should remember the choice in the store and keep the default category', () => {
      expect(authStore.selectedUserCategory).toBe(EUserCategory.STUDENT)
      expect(currentUserSession.profile.defaultCategory.value).toBe(EUserCategory.STAFF)
    })
  })

  BddTest().when('a student tries to switch to the staff profile', () => {
    beforeEach(async () => {
      await loginWith({
        user: {
          universes: [EUniverse.STUDENT]
        }
      })
      await currentUserSession.profile.switch(EUserCategory.STAFF)
    })

    BddTest().then('it should keep the current category and store nothing', () => {
      expect(authStore.selectedUserCategory).toBeUndefined()
      expect(currentUserSession.profile.activeCategory.value).toBe(EUserCategory.STUDENT)
    })
  })

  BddTest().when('the persisted profile choice is still granted to the user who logs in', () => {
    beforeEach(async () => {
      await loginWith({
        selectedCategory: EUserCategory.STUDENT
      })
    })

    BddTest().then('it should honour the choice instead of the default category', () => {
      expect(currentUserSession.profile.activeCategory.value).toBe(EUserCategory.STUDENT)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.STUDENT.HOME)
    })
  })

  BddTest().when('the persisted profile choice is not granted to the user who logs in', () => {
    beforeEach(async () => {
      await loginWith({
        user: {
          universes: [EUniverse.STUDENT]
        },
        selectedCategory: EUserCategory.STAFF
      })
    })

    BddTest().then('it should fall back to the default category', () => {
      expect(currentUserSession.profile.activeCategory.value).toBe(EUserCategory.STUDENT)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.STUDENT.HOME)
    })
  })

  BddTest().when('the session is invalidated after a profile switch', () => {
    beforeEach(async () => {
      await loginWith()
      await currentUserSession.profile.switch(EUserCategory.STUDENT)
      authStore.invalidateSession()
    })

    BddTest().then('it should reset everything derived from the session without throwing', () => {
      expect(currentUserSession.roles.value).toEqual([])
      expect(currentUserSession.categories.value).toEqual([])
      expect(currentUserSession.profile.activeCategory.value).toBe(INVALID_USER_CATEGORY)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.AUTH.LOGIN)
      expect(currentUserSession.cgu.hasAcceptedLatest.value).toBe(false)
    })

    BddTest().then('it should forget the profile choice', () => {
      expect(authStore.selectedUserCategory).toBeUndefined()
    })
  })

  BddTest().when('a user who accepted the latest cgu version is logged in', () => {
    beforeEach(async () => {
      await loginWith()
    })

    BddTest().then('it should expose the acceptance as up to date', () => {
      expect(currentUserSession.cgu.accepted.value).toEqual(mockedAcceptedCgu)
      expect(currentUserSession.cgu.hasAcceptedLatest.value).toBe(true)
    })
  })

  BddTest().when('a user who accepted an outdated cgu version is logged in', () => {
    beforeEach(async () => {
      await loginWith({
        user: {
          acceptedCgu: mockedOutdatedAcceptedCgu
        }
      })
    })

    BddTest().then('it should expose the acceptance as outdated', () => {
      expect(currentUserSession.cgu.accepted.value).toEqual(mockedOutdatedAcceptedCgu)
      expect(currentUserSession.cgu.hasAcceptedLatest.value).toBe(false)
    })
  })

  BddTest().when('a user who never accepted the cgu is logged in', () => {
    beforeEach(async () => {
      await loginWith({
        user: {
          acceptedCgu: undefined
        }
      })
    })

    BddTest().then('it should expose no acceptance at all', () => {
      expect(currentUserSession.cgu.accepted.value).toBeUndefined()
      expect(currentUserSession.cgu.hasAcceptedLatest.value).toBe(false)
    })

    BddTest().then('it should take the acceptance into account once cgu.setAccepted is called', () => {
      currentUserSession.cgu.setAccepted(mockedAcceptedCgu)

      expect(currentUserSession.cgu.accepted.value).toEqual(mockedAcceptedCgu)
      expect(currentUserSession.cgu.hasAcceptedLatest.value).toBe(true)
    })
  })
})
