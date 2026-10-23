import type { LoggedInUserDTO } from '@/api/avenir-esr'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { mockedAcceptedCgu, mockedOutdatedAcceptedCgu } from '@/__mocks__/fixtures/shared/cgu.fixtures'
import { meAs } from '@/__mocks__/msw/handlers/shared/generic.handlers'
import { server } from '@/__mocks__/msw/server'
import { EUniverse, EUserCategory } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { useCurrentUserSession } from '@/features/auth/global/composables/use-current-user-session/use-current-user-session'
import { INVALID_UNIVERSE, INVALID_USER_CATEGORY, UNIVERSE_CGU } from '@/features/auth/global/composables/use-current-user-session/use-current-user-session.constants'
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

BddTest().given('a use-current-user-session composable', () => {
  let authStore: ReturnType<typeof useAuthStore>
  let currentUserSession: ReturnType<typeof useCurrentUserSession>

  const createAuthStore = (currentUniverse?: EUniverse) => {
    setActivePinia(createPinia())
    authStore = useAuthStore()
    authStore.currentUniverse = currentUniverse
  }

  const loginWith = async ({
    user,
    currentUniverse
  }: {
    user?: Partial<LoggedInUserDTO>
    currentUniverse?: EUniverse
  } = {}) => {
    if (user) {
      server.use(meAs(user))
    }

    createAuthStore(currentUniverse)

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

    BddTest().then('it should expose no roles, no universes, no categories and no cgu', () => {
      expect(currentUserSession.roles.value).toEqual([])
      expect(currentUserSession.universes.available.value).toEqual([])
      expect(currentUserSession.universes.canSwitch.value).toBe(false)
      expect(currentUserSession.categories.value).toEqual([])
      expect(currentUserSession.cgu.accepted.value).toBeUndefined()
      expect(currentUserSession.cgu.hasAcceptedLatest.value).toBe(false)
    })

    BddTest().then('it should fall back to the login route without writing the placeholder universe into the store', () => {
      expect(currentUserSession.universes.default.value).toBe(INVALID_UNIVERSE)
      expect(currentUserSession.universes.active.value).toBe(INVALID_UNIVERSE)
      expect(currentUserSession.universes.hasActive.value).toBe(false)
      expect(currentUserSession.profile.activeCategory.value).toBe(INVALID_USER_CATEGORY)
      expect(currentUserSession.profile.hasCategory.value).toBe(false)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.AUTH.LOGIN)
      expect(authStore.currentUniverse).toBeUndefined()
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

    BddTest().then('it should expose the student universe and category only', () => {
      expect(currentUserSession.universes.available.value).toEqual([EUniverse.STUDENT])
      expect(currentUserSession.universes.canSwitch.value).toBe(false)
      expect(currentUserSession.categories.value).toEqual([EUserCategory.STUDENT])
    })

    BddTest().then('it should use the student universe, category and home route', () => {
      expect(currentUserSession.universes.active.value).toBe(EUniverse.STUDENT)
      expect(currentUserSession.universes.hasActive.value).toBe(true)
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

    BddTest().then('it should expose the staff universe and category only', () => {
      expect(currentUserSession.universes.available.value).toEqual([EUniverse.STAFF])
      expect(currentUserSession.universes.canSwitch.value).toBe(false)
      expect(currentUserSession.categories.value).toEqual([EUserCategory.STAFF])
    })

    BddTest().then('it should use the staff universe, category and home route', () => {
      expect(currentUserSession.universes.active.value).toBe(EUniverse.STAFF)
      expect(currentUserSession.profile.activeCategory.value).toBe(EUserCategory.STAFF)
      expect(currentUserSession.profile.hasCategory.value).toBe(true)
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

    BddTest().then('it should expose no universe nor category and fall back to the login route', () => {
      expect(currentUserSession.universes.active.value).toBe(INVALID_UNIVERSE)
      expect(currentUserSession.universes.hasActive.value).toBe(false)
      expect(currentUserSession.categories.value).toEqual([])
      expect(currentUserSession.profile.hasCategory.value).toBe(false)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.AUTH.LOGIN)
      expect(currentUserSession.cgu.hasAcceptedLatest.value).toBe(true)
    })

    BddTest().then('it should fall back to the public cgu route', () => {
      expect(currentUserSession.cgu.route.value).toEqual(ROUTES.AUTH.CGU)
    })
  })

  BddTest().when('a user with every universe is logged in', () => {
    beforeEach(async () => {
      await loginWith()
    })

    BddTest().then('it should expose every universe by priority, and every category once', () => {
      expect(currentUserSession.universes.available.value).toEqual([EUniverse.STAFF, EUniverse.STUDENT])
      expect(currentUserSession.universes.canSwitch.value).toBe(true)
      expect(currentUserSession.categories.value).toHaveLength(2)
      expect(currentUserSession.categories.value).toEqual(expect.arrayContaining([EUserCategory.STAFF, EUserCategory.STUDENT]))
    })

    BddTest().then('it should default to the highest priority universe', () => {
      expect(currentUserSession.universes.default.value).toBe(EUniverse.STAFF)
      expect(currentUserSession.universes.active.value).toBe(EUniverse.STAFF)
      expect(currentUserSession.profile.activeCategory.value).toBe(EUserCategory.STAFF)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.STAFF.HOME)
    })
  })

  BddTest().when('a user with every universe switches to the student universe', () => {
    beforeEach(async () => {
      await loginWith()
      await currentUserSession.universes.switch(EUniverse.STUDENT)
    })

    BddTest().then('it should expose the student universe, category, home route and cgu route', () => {
      expect(currentUserSession.universes.active.value).toBe(EUniverse.STUDENT)
      expect(currentUserSession.profile.activeCategory.value).toBe(EUserCategory.STUDENT)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.STUDENT.HOME)
      expect(currentUserSession.cgu.route.value).toEqual(ROUTES.STUDENT.CGU)
    })

    BddTest().then('it should remember the choice in the store and keep the default universe', () => {
      expect(authStore.currentUniverse).toBe(EUniverse.STUDENT)
      expect(currentUserSession.universes.default.value).toBe(EUniverse.STAFF)
    })
  })

  BddTest().when('a student tries to switch to the staff universe', () => {
    beforeEach(async () => {
      await loginWith({
        user: {
          universes: [EUniverse.STUDENT]
        }
      })
      await currentUserSession.universes.switch(EUniverse.STAFF)
    })

    BddTest().then('it should keep the current universe and store nothing', () => {
      expect(authStore.currentUniverse).toBeUndefined()
      expect(currentUserSession.universes.active.value).toBe(EUniverse.STUDENT)
    })
  })

  BddTest().when('the persisted universe is still granted to the user who logs in', () => {
    beforeEach(async () => {
      await loginWith({
        currentUniverse: EUniverse.STUDENT
      })
    })

    BddTest().then('it should honour it instead of the default universe', () => {
      expect(currentUserSession.universes.active.value).toBe(EUniverse.STUDENT)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.STUDENT.HOME)
    })
  })

  BddTest().when('the persisted universe is not granted to the user who logs in', () => {
    beforeEach(async () => {
      await loginWith({
        user: {
          universes: [EUniverse.STUDENT]
        },
        currentUniverse: EUniverse.STAFF
      })
    })

    BddTest().then('it should fall back to the default universe', () => {
      expect(currentUserSession.universes.active.value).toBe(EUniverse.STUDENT)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.STUDENT.HOME)
    })
  })

  BddTest().when('the session is invalidated after a universe switch', () => {
    beforeEach(async () => {
      await loginWith()
      await currentUserSession.universes.switch(EUniverse.STUDENT)
      authStore.invalidateSession()
    })

    BddTest().then('it should reset everything derived from the session without throwing', () => {
      expect(currentUserSession.roles.value).toEqual([])
      expect(currentUserSession.universes.available.value).toEqual([])
      expect(currentUserSession.universes.active.value).toBe(INVALID_UNIVERSE)
      expect(currentUserSession.universes.hasActive.value).toBe(false)
      expect(currentUserSession.categories.value).toEqual([])
      expect(currentUserSession.profile.activeCategory.value).toBe(INVALID_USER_CATEGORY)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.AUTH.LOGIN)
      expect(currentUserSession.cgu.hasAcceptedLatest.value).toBe(false)
    })

    BddTest().then('it should forget the universe choice', () => {
      expect(authStore.currentUniverse).toBeUndefined()
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

    BddTest().then('it should expose the cgu route of the active universe', () => {
      expect(currentUserSession.cgu.route.value).toEqual(ROUTES.STAFF.CGU)
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

    BddTest().then('it should expose the cgu route of the active universe, where he accepts the latest version', () => {
      expect(currentUserSession.cgu.route.value).toEqual(UNIVERSE_CGU[currentUserSession.universes.active.value])
    })
  })

  BddTest().when('a user who never accepted the cgu and without any universe is logged in', () => {
    beforeEach(async () => {
      await loginWith({
        user: {
          universes: [],
          acceptedCgu: undefined
        }
      })
    })

    BddTest().then('it should expose no universe nor acceptance', () => {
      expect(currentUserSession.universes.active.value).toBe(INVALID_UNIVERSE)
      expect(currentUserSession.categories.value).toEqual([])
      expect(currentUserSession.profile.hasCategory.value).toBe(false)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.AUTH.LOGIN)
      expect(currentUserSession.cgu.accepted.value).toBeUndefined()
      expect(currentUserSession.cgu.hasAcceptedLatest.value).toBe(false)
    })

    BddTest().then('it should fall back to the public cgu route', () => {
      expect(currentUserSession.cgu.route.value).toEqual(ROUTES.AUTH.CGU)
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

    BddTest().then('it should expose the cgu route of the active universe, where he accepts the latest version', () => {
      expect(currentUserSession.cgu.route.value).toEqual(UNIVERSE_CGU[currentUserSession.universes.active.value])
    })

    BddTest().then('it should take the acceptance into account once cgu.setAccepted is called', () => {
      currentUserSession.cgu.setAccepted(mockedAcceptedCgu)

      expect(currentUserSession.cgu.accepted.value).toEqual(mockedAcceptedCgu)
      expect(currentUserSession.cgu.hasAcceptedLatest.value).toBe(true)
    })
  })
})
