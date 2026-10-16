import { mockedAcceptedCgu, mockedOutdatedAcceptedCgu } from '@/__mocks__/fixtures/shared/cgu.fixtures'
import { mockedStaffProfileOverview } from '@/__mocks__/fixtures/staffs/user.fixtures'
import { mockedProfileOverview } from '@/__mocks__/fixtures/student'
import { meAs, meWithoutAcceptedCguHandler, mockedLoggedInUser } from '@/__mocks__/msw/handlers/shared/generic.handlers'
import { getProfileErrorHandler, getProfilePendingHandler } from '@/__mocks__/msw/handlers/student/overviews.handlers'
import { server } from '@/__mocks__/msw/server'
import { ERole, EUserCategory } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { useCurrentUser } from '@/features/auth/global/composables/use-current-user/use-current-user'
import { INVALID_PROFILE, INVALID_USER_CATEGORY } from '@/features/auth/global/composables/use-current-user/use-current-user.constants'
import { useAuthStore } from '@/features/auth/global/stores/auth.store'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComposable } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'

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

BddTest().given('the current user composable with the API served by MSW', () => {
  let authStore: ReturnType<typeof useAuthStore>
  let currentUser: ReturnType<typeof useCurrentUser>
  let unmount: () => void

  beforeEach(() => {
    const mounted = mountComposable(() => {
      authStore = useAuthStore()
      currentUser = useCurrentUser()
    }, {
      usePinia: true,
      useTanstack: true,
      useI18n: true
    })

    unmount = mounted.unmount
  })

  afterEach(() => {
    unmount()
    server.resetHandlers()
  })

  const profileLoaded = async () => {
    await flushPromises()
    await vi.waitFor(() => expect(currentUser.isProfileLoading.value).toBe(false))
  }

  const login = async () => {
    await authStore.ensureAuthenticated()
    await profileLoaded()
  }

  BddTest().when('nobody is logged in', () => {
    BddTest().then('it should expose no roles, no categories and no cgu', () => {
      expect(currentUser.roles.value).toEqual([])
      expect(currentUser.categories.value).toEqual([])
      expect(currentUser.canSwitchProfile.value).toBe(false)
      expect(currentUser.acceptedCgu.value).toBeUndefined()
      expect(currentUser.hasAcceptedLatestCgu.value).toBe(false)
    })

    BddTest().then('it should fall back to the login route and an empty profile', () => {
      expect(currentUser.activeProfileCategory.value).toBe(INVALID_USER_CATEGORY)
      expect(currentUser.isProfileLoading.value).toBe(false)
      expect(currentUser.profile.value).toEqual(INVALID_PROFILE)
      expect(currentUser.homeRoute.value).toEqual(ROUTES.AUTH.LOGIN)
    })
  })

  BddTest().when('a user with only the STUDENT role is logged in', () => {
    beforeEach(async () => {
      server.use(meAs({ roles: [ERole.ROLE_STUDENT] }))
      await login()
    })

    BddTest().then('it should expose the student category only', () => {
      expect(currentUser.roles.value).toEqual([ERole.ROLE_STUDENT])
      expect(currentUser.categories.value).toEqual([EUserCategory.STUDENT])
      expect(currentUser.canSwitchProfile.value).toBe(false)
    })

    BddTest().then('it should expose the student home route and profile', () => {
      expect(currentUser.activeProfileCategory.value).toBe(EUserCategory.STUDENT)
      expect(currentUser.isProfileLoading.value).toBe(false)
      expect(currentUser.profile.value).toEqual(mockedProfileOverview)
      expect(currentUser.homeRoute.value).toEqual(ROUTES.STUDENT.HOME)
    })
  })

  BddTest().when('a user with only the STAFF role is logged in', () => {
    beforeEach(async () => {
      server.use(meAs({ roles: [ERole.ROLE_STAFF] }))
      await login()
    })

    BddTest().then('it should expose the staff category only', () => {
      expect(currentUser.roles.value).toEqual([ERole.ROLE_STAFF])
      expect(currentUser.categories.value).toEqual([EUserCategory.STAFF])
      expect(currentUser.canSwitchProfile.value).toBe(false)
    })

    BddTest().then('it should expose the staff home route and profile', () => {
      expect(currentUser.activeProfileCategory.value).toBe(EUserCategory.STAFF)
      expect(currentUser.isProfileLoading.value).toBe(false)
      expect(currentUser.profile.value).toEqual(mockedStaffProfileOverview)
      expect(currentUser.homeRoute.value).toEqual(ROUTES.STAFF.HOME)
    })
  })

  BddTest().when('a user with the STUDENT, STAFF and SUPER_ADMIN roles is logged in', () => {
    beforeEach(async () => {
      await login()
    })

    BddTest().then('it should expose every category once, by priority', () => {
      expect(currentUser.roles.value).toEqual(mockedLoggedInUser.roles)
      expect(currentUser.categories.value).toEqual([EUserCategory.STAFF, EUserCategory.STUDENT])
      expect(currentUser.canSwitchProfile.value).toBe(true)
    })

    BddTest().then('it should default to the highest priority category', () => {
      expect(currentUser.activeProfileCategory.value).toBe(EUserCategory.STAFF)
      expect(currentUser.profile.value).toEqual(mockedStaffProfileOverview)
      expect(currentUser.homeRoute.value).toEqual(ROUTES.STAFF.HOME)
    })
  })

  BddTest().when('a user with both profiles switches to the student profile', () => {
    beforeEach(async () => {
      await login()
      await currentUser.switchProfile(EUserCategory.STUDENT)
      await profileLoaded()
    })

    BddTest().then('it should expose the student category, home route and profile', () => {
      expect(currentUser.activeProfileCategory.value).toBe(EUserCategory.STUDENT)
      expect(currentUser.profile.value).toEqual(mockedProfileOverview)
      expect(currentUser.homeRoute.value).toEqual(ROUTES.STUDENT.HOME)
    })

    BddTest().then('it should remember the choice in the store', () => {
      expect(authStore.selectedUserCategory).toBe(EUserCategory.STUDENT)
    })
  })

  BddTest().when('a student tries to switch to the staff profile', () => {
    beforeEach(async () => {
      server.use(meAs({ roles: [ERole.ROLE_STUDENT] }))
      await login()
      await currentUser.switchProfile(EUserCategory.STAFF)
      await profileLoaded()
    })

    BddTest().then('it should keep the current profile and store nothing', () => {
      expect(authStore.selectedUserCategory).toBeUndefined()
      expect(currentUser.activeProfileCategory.value).toBe(EUserCategory.STUDENT)
      expect(currentUser.profile.value).toEqual(mockedProfileOverview)
    })
  })

  BddTest().when('the persisted profile choice is still granted to the user who logs in', () => {
    beforeEach(async () => {
      authStore.selectedUserCategory = EUserCategory.STUDENT
      await login()
    })

    BddTest().then('it should honour the choice instead of the default category', () => {
      expect(currentUser.activeProfileCategory.value).toBe(EUserCategory.STUDENT)
      expect(currentUser.profile.value).toEqual(mockedProfileOverview)
    })
  })

  BddTest().when('the persisted profile choice is not granted to the user who logs in', () => {
    beforeEach(async () => {
      authStore.selectedUserCategory = EUserCategory.STAFF
      server.use(meAs({ roles: [ERole.ROLE_STUDENT] }))
      await login()
    })

    BddTest().then('it should fall back to the default category', () => {
      expect(currentUser.activeProfileCategory.value).toBe(EUserCategory.STUDENT)
      expect(currentUser.profile.value).toEqual(mockedProfileOverview)
      expect(currentUser.homeRoute.value).toEqual(ROUTES.STUDENT.HOME)
    })
  })

  BddTest().when('the session is invalidated after a profile switch', () => {
    beforeEach(async () => {
      await login()
      await currentUser.switchProfile(EUserCategory.STUDENT)
      await profileLoaded()
      authStore.invalidateSession()
      await profileLoaded()
    })

    BddTest().then('it should reset everything derived from the session', () => {
      expect(currentUser.roles.value).toEqual([])
      expect(currentUser.categories.value).toEqual([])
      expect(currentUser.activeProfileCategory.value).toBe(INVALID_USER_CATEGORY)
      expect(currentUser.profile.value).toEqual(INVALID_PROFILE)
      expect(currentUser.homeRoute.value).toEqual(ROUTES.AUTH.LOGIN)
      expect(currentUser.hasAcceptedLatestCgu.value).toBe(false)
    })

    BddTest().then('it should forget the profile choice', () => {
      expect(authStore.selectedUserCategory).toBeUndefined()
    })
  })

  BddTest().when('a user is logged in and the profile request is still pending', () => {
    beforeEach(async () => {
      server.use(meAs({ roles: [ERole.ROLE_STUDENT] }), getProfilePendingHandler)
      await authStore.ensureAuthenticated()
      await flushPromises()
    })

    BddTest().then('it should be loading and expose an empty profile', () => {
      expect(currentUser.activeProfileCategory.value).toBe(EUserCategory.STUDENT)
      expect(currentUser.isProfileLoading.value).toBe(true)
      expect(currentUser.profile.value).toEqual(INVALID_PROFILE)
    })
  })

  BddTest().when('a user is logged in and the profile request fails', () => {
    beforeEach(async () => {
      server.use(meAs({ roles: [ERole.ROLE_STUDENT] }), getProfileErrorHandler)
      await login()
    })

    BddTest().then('it should stop loading and expose an empty profile', () => {
      expect(currentUser.activeProfileCategory.value).toBe(EUserCategory.STUDENT)
      expect(currentUser.isProfileLoading.value).toBe(false)
      expect(currentUser.profile.value).toEqual(INVALID_PROFILE)
    })
  })

  BddTest().when('a user who accepted the latest cgu version is logged in', () => {
    beforeEach(async () => {
      await login()
    })

    BddTest().then('it should expose the acceptance as up to date', () => {
      expect(currentUser.acceptedCgu.value).toEqual(mockedAcceptedCgu)
      expect(currentUser.hasAcceptedLatestCgu.value).toBe(true)
    })
  })

  BddTest().when('a user who accepted an outdated cgu version is logged in', () => {
    beforeEach(async () => {
      server.use(meAs({ acceptedCgu: mockedOutdatedAcceptedCgu }))
      await login()
    })

    BddTest().then('it should expose the acceptance as outdated', () => {
      expect(currentUser.acceptedCgu.value).toEqual(mockedOutdatedAcceptedCgu)
      expect(currentUser.hasAcceptedLatestCgu.value).toBe(false)
    })
  })

  BddTest().when('a user who never accepted the cgu is logged in', () => {
    beforeEach(async () => {
      server.use(meWithoutAcceptedCguHandler)
      await login()
    })

    BddTest().then('it should expose no acceptance at all', () => {
      expect(currentUser.acceptedCgu.value).toBeUndefined()
      expect(currentUser.hasAcceptedLatestCgu.value).toBe(false)
    })

    BddTest().then('it should take the acceptance into account once setAcceptedCgu is called', () => {
      currentUser.setAcceptedCgu(mockedAcceptedCgu)

      expect(currentUser.acceptedCgu.value).toEqual(mockedAcceptedCgu)
      expect(currentUser.hasAcceptedLatestCgu.value).toBe(true)
    })
  })
})
