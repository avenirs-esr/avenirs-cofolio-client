import type { LoggedInUserDTO } from '@/api/avenir-esr'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { mockedAcceptedCgu, mockedOutdatedAcceptedCgu } from '@/__mocks__/fixtures/shared/cgu.fixtures'
import { meAs, meWithoutAcceptedCguHandler, mockedLoggedInUser } from '@/__mocks__/msw/handlers/shared/generic.handlers'
import { server } from '@/__mocks__/msw/server'
import { ERole, EUserCategory } from '@/api/avenir-esr'
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

BddTest().given('the current user session composable with the API served by MSW', () => {
  let authStore: ReturnType<typeof useAuthStore>
  let currentUserSession: ReturnType<typeof useCurrentUserSession>
  let unmount: () => void

  const mountWith = async ({
    user,
    selectedCategory,
    isLoggedIn = true,
    acceptedCgu = true
  }: {
    user?: Partial<LoggedInUserDTO>
    selectedCategory?: EUserCategory
    isLoggedIn?: boolean
    acceptedCgu?: boolean
  } = {}) => {
    if (!acceptedCgu) {
      server.use(meWithoutAcceptedCguHandler)
    }
    else if (user) {
      server.use(meAs(user))
    }

    const mounted = mountComposable(() => {
      authStore = useAuthStore()
      currentUserSession = useCurrentUserSession()
    }, {
      usePinia: true,
      useTanstack: true
    })

    unmount = mounted.unmount
    authStore.selectedUserCategory = selectedCategory

    if (isLoggedIn) {
      await authStore.ensureAuthenticated('/target')
    }
  }

  afterEach(() => {
    unmount()
    server.resetHandlers()
  })

  BddTest().when('nobody is logged in', () => {
    beforeEach(async () => {
      await mountWith({
        isLoggedIn: false
      })
    })

    BddTest().then('it should expose no roles, no categories and no cgu', () => {
      expect(currentUserSession.roles.value).toEqual([])
      expect(currentUserSession.categories.value).toEqual([])
      expect(currentUserSession.canSwitchProfile.value).toBe(false)
      expect(currentUserSession.acceptedCgu.value).toBeUndefined()
      expect(currentUserSession.hasAcceptedLatestCgu.value).toBe(false)
    })

    BddTest().then('it should fall back to the login route without writing the placeholder category into the store', () => {
      expect(currentUserSession.defaultProfileCategory.value).toBe(INVALID_USER_CATEGORY)
      expect(currentUserSession.activeProfileCategory.value).toBe(INVALID_USER_CATEGORY)
      expect(currentUserSession.hasProfileCategory.value).toBe(false)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.AUTH.LOGIN)
      expect(authStore.selectedUserCategory).toBeUndefined()
    })
  })

  BddTest().when('a user with only the STUDENT role is logged in', () => {
    beforeEach(async () => {
      await mountWith({
        user: {
          roles: [ERole.ROLE_STUDENT]
        }
      })
    })

    BddTest().then('it should expose the student category only', () => {
      expect(currentUserSession.roles.value).toEqual([ERole.ROLE_STUDENT])
      expect(currentUserSession.categories.value).toEqual([EUserCategory.STUDENT])
      expect(currentUserSession.canSwitchProfile.value).toBe(false)
    })

    BddTest().then('it should use the student category and home route', () => {
      expect(currentUserSession.activeProfileCategory.value).toBe(EUserCategory.STUDENT)
      expect(currentUserSession.hasProfileCategory.value).toBe(true)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.STUDENT.HOME)
    })
  })

  BddTest().when('a user with only the STAFF role is logged in', () => {
    beforeEach(async () => {
      await mountWith({
        user: {
          roles: [ERole.ROLE_STAFF]
        }
      })
    })

    BddTest().then('it should expose the staff category only', () => {
      expect(currentUserSession.roles.value).toEqual([ERole.ROLE_STAFF])
      expect(currentUserSession.categories.value).toEqual([EUserCategory.STAFF])
      expect(currentUserSession.canSwitchProfile.value).toBe(false)
    })

    BddTest().then('it should use the staff category and home route', () => {
      expect(currentUserSession.activeProfileCategory.value).toBe(EUserCategory.STAFF)
      expect(currentUserSession.hasProfileCategory.value).toBe(true)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.STAFF.HOME)
    })
  })

  BddTest().when('a user with only the ADMIN role is logged in', () => {
    beforeEach(async () => {
      await mountWith({
        user: {
          roles: [ERole.ROLE_ADMIN]
        }
      })
    })

    BddTest().then('it should expose the staff category only', () => {
      expect(currentUserSession.roles.value).toEqual([ERole.ROLE_ADMIN])
      expect(currentUserSession.categories.value).toEqual([EUserCategory.STAFF])
      expect(currentUserSession.canSwitchProfile.value).toBe(false)
    })

    BddTest().then('it should use the staff category and home route', () => {
      expect(currentUserSession.activeProfileCategory.value).toBe(EUserCategory.STAFF)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.STAFF.HOME)
    })
  })

  BddTest().when('a user with the STUDENT, STAFF and SUPER_ADMIN roles is logged in', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should expose every category once, by priority', () => {
      expect(currentUserSession.roles.value).toEqual(mockedLoggedInUser.roles)
      expect(currentUserSession.categories.value).toEqual([EUserCategory.STAFF, EUserCategory.STUDENT])
      expect(currentUserSession.canSwitchProfile.value).toBe(true)
    })

    BddTest().then('it should default to the highest priority category', () => {
      expect(currentUserSession.defaultProfileCategory.value).toBe(EUserCategory.STAFF)
      expect(currentUserSession.activeProfileCategory.value).toBe(EUserCategory.STAFF)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.STAFF.HOME)
    })
  })

  BddTest().when('a user with both profiles switches to the student profile', () => {
    beforeEach(async () => {
      await mountWith()
      await currentUserSession.switchProfile(EUserCategory.STUDENT)
    })

    BddTest().then('it should expose the student category and home route', () => {
      expect(currentUserSession.activeProfileCategory.value).toBe(EUserCategory.STUDENT)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.STUDENT.HOME)
    })

    BddTest().then('it should remember the choice in the store and keep the default category', () => {
      expect(authStore.selectedUserCategory).toBe(EUserCategory.STUDENT)
      expect(currentUserSession.defaultProfileCategory.value).toBe(EUserCategory.STAFF)
    })
  })

  BddTest().when('a student tries to switch to the staff profile', () => {
    beforeEach(async () => {
      await mountWith({
        user: {
          roles: [ERole.ROLE_STUDENT]
        }
      })
      await currentUserSession.switchProfile(EUserCategory.STAFF)
    })

    BddTest().then('it should keep the current category and store nothing', () => {
      expect(authStore.selectedUserCategory).toBeUndefined()
      expect(currentUserSession.activeProfileCategory.value).toBe(EUserCategory.STUDENT)
    })
  })

  BddTest().when('the persisted profile choice is still granted to the user who logs in', () => {
    beforeEach(async () => {
      await mountWith({
        selectedCategory: EUserCategory.STUDENT
      })
    })

    BddTest().then('it should honour the choice instead of the default category', () => {
      expect(currentUserSession.activeProfileCategory.value).toBe(EUserCategory.STUDENT)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.STUDENT.HOME)
    })
  })

  BddTest().when('the persisted profile choice is not granted to the user who logs in', () => {
    beforeEach(async () => {
      await mountWith({
        user: {
          roles: [ERole.ROLE_STUDENT]
        },
        selectedCategory: EUserCategory.STAFF
      })
    })

    BddTest().then('it should fall back to the default category', () => {
      expect(currentUserSession.activeProfileCategory.value).toBe(EUserCategory.STUDENT)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.STUDENT.HOME)
    })
  })

  BddTest().when('the session is invalidated after a profile switch', () => {
    beforeEach(async () => {
      await mountWith()
      await currentUserSession.switchProfile(EUserCategory.STUDENT)
      authStore.invalidateSession()
    })

    BddTest().then('it should reset everything derived from the session', () => {
      expect(currentUserSession.roles.value).toEqual([])
      expect(currentUserSession.categories.value).toEqual([])
      expect(currentUserSession.activeProfileCategory.value).toBe(INVALID_USER_CATEGORY)
      expect(currentUserSession.homeRoute.value).toEqual(ROUTES.AUTH.LOGIN)
      expect(currentUserSession.hasAcceptedLatestCgu.value).toBe(false)
    })

    BddTest().then('it should forget the profile choice', () => {
      expect(authStore.selectedUserCategory).toBeUndefined()
    })
  })

  BddTest().when('a user who accepted the latest cgu version is logged in', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should expose the acceptance as up to date', () => {
      expect(currentUserSession.acceptedCgu.value).toEqual(mockedAcceptedCgu)
      expect(currentUserSession.hasAcceptedLatestCgu.value).toBe(true)
    })
  })

  BddTest().when('a user who accepted an outdated cgu version is logged in', () => {
    beforeEach(async () => {
      await mountWith({
        user: {
          acceptedCgu: mockedOutdatedAcceptedCgu
        }
      })
    })

    BddTest().then('it should expose the acceptance as outdated', () => {
      expect(currentUserSession.acceptedCgu.value).toEqual(mockedOutdatedAcceptedCgu)
      expect(currentUserSession.hasAcceptedLatestCgu.value).toBe(false)
    })
  })

  BddTest().when('a user who never accepted the cgu is logged in', () => {
    beforeEach(async () => {
      await mountWith({
        acceptedCgu: false
      })
    })

    BddTest().then('it should expose no acceptance at all', () => {
      expect(currentUserSession.acceptedCgu.value).toBeUndefined()
      expect(currentUserSession.hasAcceptedLatestCgu.value).toBe(false)
    })

    BddTest().then('it should take the acceptance into account once setAcceptedCgu is called', () => {
      currentUserSession.setAcceptedCgu(mockedAcceptedCgu)

      expect(currentUserSession.acceptedCgu.value).toEqual(mockedAcceptedCgu)
      expect(currentUserSession.hasAcceptedLatestCgu.value).toBe(true)
    })
  })
})
