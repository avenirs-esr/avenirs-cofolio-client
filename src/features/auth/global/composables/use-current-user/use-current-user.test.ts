import type { LoggedInUserDTO } from '@/api/avenir-esr'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComposable } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { mockedStaffProfileOverview } from '@/__mocks__/fixtures/staffs/user.fixtures'
import { mockedProfileOverview } from '@/__mocks__/fixtures/student'
import { meAs } from '@/__mocks__/msw/handlers/shared/generic.handlers'
import { getProfileErrorHandler, getProfilePendingHandler } from '@/__mocks__/msw/handlers/student/overviews.handlers'
import { server } from '@/__mocks__/msw/server'
import { ERole, EUserCategory } from '@/api/avenir-esr'
import { useCurrentUser } from '@/features/auth/global/composables/use-current-user/use-current-user'
import { INVALID_PROFILE } from '@/features/auth/global/composables/use-current-user/use-current-user.constants'
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

BddTest().given('the current user composable with the API served by MSW', () => {
  let authStore: ReturnType<typeof useAuthStore>
  let currentUser: ReturnType<typeof useCurrentUser>
  let unmount: () => void

  const profileLoaded = async () => {
    await flushPromises()
    await vi.waitFor(() => expect(currentUser.isProfileLoading.value).toBe(false))
  }

  const mountWith = async ({
    user,
    isLoggedIn = true,
    waitForProfile = true,
    requestFail = false
  }: {
    user?: Partial<LoggedInUserDTO>
    isLoggedIn?: boolean
    waitForProfile?: boolean
    requestFail?: boolean
  } = {}) => {
    if (requestFail) {
      server.use(getProfileErrorHandler)
    }

    if (user) {
      server.use(meAs(user))
    }

    const mounted = mountComposable(() => {
      authStore = useAuthStore()
      currentUser = useCurrentUser()
    }, {
      usePinia: true,
      useTanstack: true,
      useI18n: true
    })

    unmount = mounted.unmount

    if (isLoggedIn) {
      await authStore.ensureAuthenticated('/target')
    }

    await (waitForProfile ? profileLoaded() : flushPromises())
  }

  afterEach(() => {
    unmount()
    server.resetHandlers()
  })

  BddTest().when('nobody is logged in', () => {
    beforeEach(async () => {
      await mountWith({ isLoggedIn: false })
    })

    BddTest().then('it should expose an empty profile and not be loading', () => {
      expect(currentUser.profile.value).toEqual(INVALID_PROFILE)
      expect(currentUser.isProfileLoading.value).toBe(false)
    })
  })

  BddTest().when('a user with only the STUDENT role is logged in', () => {
    beforeEach(async () => {
      await mountWith({ user: { roles: [ERole.ROLE_STUDENT] } })
    })

    BddTest().then('it should expose the session of the user', () => {
      expect(currentUser.roles.value).toEqual([ERole.ROLE_STUDENT])
      expect(currentUser.activeProfileCategory.value).toBe(EUserCategory.STUDENT)
    })

    BddTest().then('it should expose the student profile', () => {
      expect(currentUser.profile.value).toEqual(mockedProfileOverview)
      expect(currentUser.isProfileLoading.value).toBe(false)
    })
  })

  BddTest().when('a user with only the STAFF role is logged in', () => {
    beforeEach(async () => {
      await mountWith({ user: { roles: [ERole.ROLE_STAFF] } })
    })

    BddTest().then('it should expose the staff profile', () => {
      expect(currentUser.profile.value).toEqual(mockedStaffProfileOverview)
      expect(currentUser.isProfileLoading.value).toBe(false)
    })
  })

  BddTest().when('a user with both profiles is logged in', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should expose the profile of the default category', () => {
      expect(currentUser.activeProfileCategory.value).toBe(currentUser.defaultProfileCategory.value)
      expect(currentUser.profile.value).toBeTruthy()
    })
  })

  BddTest().when('a user with both profiles switches to the student profile', () => {
    beforeEach(async () => {
      await mountWith()
      await currentUser.switchProfile(EUserCategory.STUDENT)
      await profileLoaded()
    })

    BddTest().then('it should expose the student profile', () => {
      expect(currentUser.activeProfileCategory.value).toBe(EUserCategory.STUDENT)
      expect(currentUser.profile.value).toEqual(mockedProfileOverview)
    })
  })

  BddTest().when('the session is invalidated after a profile switch', () => {
    beforeEach(async () => {
      await mountWith()
      await currentUser.switchProfile(EUserCategory.STUDENT)
      await profileLoaded()
      authStore.invalidateSession()
      await profileLoaded()
    })

    BddTest().then('it should fall back to the empty profile', () => {
      expect(currentUser.profile.value).toEqual(INVALID_PROFILE)
      expect(currentUser.isProfileLoading.value).toBe(false)
    })
  })

  BddTest().when('a user is logged in and the profile request is still pending', () => {
    beforeEach(async () => {
      server.use(getProfilePendingHandler)
      await mountWith({
        user: {
          roles: [ERole.ROLE_STUDENT]
        },
        waitForProfile: false
      })
    })

    BddTest().then('it should be loading and expose an empty profile', () => {
      expect(currentUser.isProfileLoading.value).toBe(true)
      expect(currentUser.profile.value).toEqual(INVALID_PROFILE)
    })
  })

  BddTest().when('a user is logged in and the profile request fails', () => {
    beforeEach(async () => {
      await mountWith({
        user: {
          roles: [ERole.ROLE_STUDENT]
        },
        requestFail: true
      })
    })

    BddTest().then('it should stop loading and expose an empty profile', () => {
      expect(currentUser.isProfileLoading.value).toBe(false)
      expect(currentUser.profile.value).toEqual(INVALID_PROFILE)
    })
  })
})
