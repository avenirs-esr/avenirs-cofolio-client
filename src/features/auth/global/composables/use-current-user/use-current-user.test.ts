import type { LoggedInUserDTO } from '@/api/avenir-esr'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComposable } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { mockedStaffProfileOverview } from '@/__mocks__/fixtures/staffs/user.fixtures'
import { mockedProfileOverview } from '@/__mocks__/fixtures/student'
import { mockedLoggedInUser } from '@/__mocks__/msw/handlers/shared/generic.handlers'
import { getProfileErrorHandler, getProfilePendingHandler } from '@/__mocks__/msw/handlers/student/overviews.handlers'
import { server } from '@/__mocks__/msw/server'
import { EUniverse, EUserCategory } from '@/api/avenir-esr'
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
    await vi.waitFor(() => expect(currentUser.profile.isLoading.value).toBe(false))
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

    if (!isLoggedIn) {
      vi.stubEnv('DEV', false)
    }

    const mounted = mountComposable(() => {
      authStore = useAuthStore()

      if (isLoggedIn) {
        authStore.$patch({
          session: {
            ...mockedLoggedInUser,
            ...user
          }
        })
      }

      currentUser = useCurrentUser()
    }, {
      usePinia: true,
      useTanstack: true,
      useI18n: true
    })

    unmount = mounted.unmount

    await (waitForProfile ? profileLoaded() : flushPromises())
  }

  afterEach(() => {
    unmount()
    server.resetHandlers()
    vi.unstubAllEnvs()
  })

  BddTest().when('nobody is logged in', () => {
    beforeEach(async () => {
      await mountWith({ isLoggedIn: false })
    })

    BddTest().then('it should expose an empty profile and not be loading', () => {
      expect(currentUser.profile.isLoading.value).toBe(false)
      expect(currentUser.profile.data.value).toEqual(INVALID_PROFILE)
    })
  })

  BddTest().when('a user with only the STUDENT universe is logged in', () => {
    beforeEach(async () => {
      await mountWith({ user: { universes: [EUniverse.STUDENT] } })
    })

    BddTest().then('it should expose the session of the user', () => {
      expect(currentUser.universes.value).toEqual([EUniverse.STUDENT])
      expect(currentUser.profile.activeCategory.value).toBe(EUserCategory.STUDENT)
    })

    BddTest().then('it should expose the student profile', () => {
      expect(currentUser.profile.isLoading.value).toBe(false)
      expect(currentUser.profile.data.value).toEqual(mockedProfileOverview)
    })
  })

  BddTest().when('a user with only the STAFF universe is logged in', () => {
    beforeEach(async () => {
      await mountWith({ user: { universes: [EUniverse.STAFF] } })
    })

    BddTest().then('it should expose the staff profile', () => {
      expect(currentUser.profile.isLoading.value).toBe(false)
      expect(currentUser.profile.data.value).toEqual(mockedStaffProfileOverview)
    })
  })

  BddTest().when('a user with both profiles is logged in', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should expose the profile of the default category', () => {
      expect(currentUser.profile.activeCategory.value).toBe(currentUser.profile.defaultCategory.value)
      expect(currentUser.profile.data.value).toBeTruthy()
    })
  })

  BddTest().when('a user with both profiles switches to the student profile', () => {
    beforeEach(async () => {
      await mountWith()
      await currentUser.profile.switch(EUserCategory.STUDENT)
      await profileLoaded()
    })

    BddTest().then('it should expose the student profile', () => {
      expect(currentUser.profile.activeCategory.value).toBe(EUserCategory.STUDENT)
      expect(currentUser.profile.data.value).toEqual(mockedProfileOverview)
    })
  })

  BddTest().when('the session is invalidated after a profile switch', () => {
    beforeEach(async () => {
      await mountWith()
      await currentUser.profile.switch(EUserCategory.STUDENT)
      await profileLoaded()
      authStore.invalidateSession()
      await profileLoaded()
    })

    BddTest().then('it should fall back to the empty profile', () => {
      expect(currentUser.profile.isLoading.value).toBe(false)
      expect(currentUser.profile.data.value).toEqual(INVALID_PROFILE)
    })
  })

  BddTest().when('a user is logged in and the profile request is still pending', () => {
    beforeEach(async () => {
      server.use(getProfilePendingHandler)
      await mountWith({
        user: {
          universes: [EUniverse.STUDENT]
        },
        waitForProfile: false
      })
    })

    BddTest().then('it should be loading and expose an empty profile', () => {
      expect(currentUser.profile.isLoading.value).toBe(true)
      expect(currentUser.profile.data.value).toEqual(INVALID_PROFILE)
    })
  })

  BddTest().when('a user is logged in and the profile request fails', () => {
    beforeEach(async () => {
      await mountWith({
        user: {
          universes: [EUniverse.STUDENT]
        },
        requestFail: true
      })
    })

    BddTest().then('it should stop loading and expose an empty profile', () => {
      expect(currentUser.profile.isLoading.value).toBe(false)
      expect(currentUser.profile.data.value).toEqual(INVALID_PROFILE)
    })
  })
})
