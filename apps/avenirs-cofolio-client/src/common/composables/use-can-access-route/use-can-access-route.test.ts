import type { Ref } from 'vue'
import type { Authorization, RouteRestrictions } from '@/common/types/route-restrictions.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useQueryClient } from '@tanstack/vue-query'
import { flushPromises } from '@vue/test-utils'
import { mountComponent, mountComposable } from 'tests/utils'
import { effectScope, h, nextTick } from 'vue'
import { ERole, EUniverse } from '@/api/avenir-esr'
import { useCanAccessRoute } from '@/common/composables/use-can-access-route/use-can-access-route'
import { ROUTES } from '@/common/constants'
import { invalidateRouteAccess } from '@/common/utils/route/access-state/route-access-state'

const { mockGetRouteRestrictions } = vi.hoisted(() => ({
  mockGetRouteRestrictions: vi.fn(),
}))

vi.mock('@/common/utils/route/restrictions/route-restrictions', () => ({
  getRouteRestrictions: mockGetRouteRestrictions,
}))

const mockRoles = ref<ERole[]>([])
const mockUniverses = ref<EUniverse[]>([])

vi.mock('@/features/auth/global/composables/use-current-user-session/use-current-user-session', () => ({
  useCurrentUserSession: () => ({
    roles: mockRoles,
    universes: {
      available: mockUniverses,
    },
  }),
}))

BddTest().given('a use-can-access-route composable', () => {
  const userId = ref('')
  const useUserAccess = () => useCanAccessRoute(ROUTES.STAFF.ADMIN.GROUP.USER, 'group-id', userId)

  let canOpen: Readonly<Ref<boolean>>
  let unmount: (() => void) | undefined

  const mountWith = (options: Parameters<typeof mountComposable>[1] = {}) => {
    const mounted = mountComposable(useUserAccess, options)
    canOpen = mounted.result
    unmount = mounted.unmount
  }

  const mockRestrictions = (
    {
      isAuthorized,
      ...criteria
    }: Partial<Omit<RouteRestrictions, 'authorizations'>> & { isAuthorized?: Authorization }
  ) => {
    mockGetRouteRestrictions.mockReturnValue({
      universes: [],
      roles: [],
      ...criteria,
      authorizations: isAuthorized ? [{ isAuthorized, paramNames: ['groupId', 'userId'] }] : [],
    } satisfies RouteRestrictions)
  }

  const deferred = () => {
    let resolve!: (value: boolean) => void
    const promise = new Promise<boolean>((resolvePromise) => {
      resolve = resolvePromise
    })
    return {
      promise,
      resolve
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockRoles.value = [ERole.ROLE_ADMIN]
    mockUniverses.value = [EUniverse.STAFF]
    userId.value = 'user-id'
  })

  afterEach(() => {
    unmount?.()
    unmount = undefined
  })

  BddTest().when('the user can access the route', () => {
    const check = deferred()
    const isAuthorized = vi.fn(() => check.promise)

    beforeEach(() => {
      mockRestrictions({
        isAuthorized
      })
      mountWith()
    })

    BddTest().then('it should be false until the check gives access, then true', async () => {
      expect(canOpen.value).toBe(false)

      check.resolve(true)
      await flushPromises()
      expect(canOpen.value).toBe(true)
      expect(isAuthorized).toHaveBeenCalledWith('group-id', 'user-id')
      expect(mockGetRouteRestrictions).toHaveBeenCalledWith(ROUTES.STAFF.ADMIN.GROUP.USER.name)
    })
  })

  BddTest().when('the user cannot access the route', () => {
    beforeEach(() => {
      mockRestrictions({ isAuthorized: async () => false })
      mountWith()
    })

    BddTest().then('it should stay false', async () => {
      await flushPromises()
      expect(canOpen.value).toBe(false)
    })
  })

  BddTest().when('the params change', () => {
    const check = deferred()
    const isAuthorized = vi.fn().mockResolvedValueOnce(true).mockReturnValueOnce(check.promise)

    beforeEach(() => {
      mockRestrictions({
        isAuthorized
      })
      mountWith()
    })

    BddTest().then('it should check again with the new params, false meanwhile', async () => {
      await flushPromises()
      expect(canOpen.value).toBe(true)

      userId.value = 'other-user-id'
      await nextTick()
      expect(isAuthorized).toHaveBeenLastCalledWith('group-id', 'other-user-id')
      expect(canOpen.value).toBe(false)

      check.resolve(true)
      await flushPromises()
      expect(canOpen.value).toBe(true)
    })
  })

  BddTest().when('a check ends after a newer one', () => {
    const older = deferred()
    const newer = deferred()
    const isAuthorized = vi.fn().mockReturnValueOnce(older.promise).mockReturnValueOnce(newer.promise)

    beforeEach(() => {
      mockRestrictions({
        isAuthorized
      })
      mountWith()
    })

    BddTest().then('it should keep the result of the newer one', async () => {
      userId.value = 'other-user-id'
      await nextTick()

      newer.resolve(true)
      await flushPromises()
      older.resolve(false)
      await flushPromises()
      expect(canOpen.value).toBe(true)
    })
  })

  BddTest().when('the session rights change', () => {
    beforeEach(() => {
      mockRoles.value = []
      mockRestrictions({
        roles: [[ERole.ROLE_ADMIN]]
      })
      mountWith()
    })

    BddTest().then('it should check again', async () => {
      await flushPromises()
      expect(canOpen.value).toBe(false)

      mockRoles.value = [ERole.ROLE_ADMIN]
      await flushPromises()
      expect(canOpen.value).toBe(true)
    })
  })

  BddTest().when('the session changes, the params staying the same', () => {
    const check = deferred()
    const isAuthorized = vi.fn().mockResolvedValueOnce(true).mockReturnValueOnce(check.promise)

    beforeEach(() => {
      mockRestrictions({
        isAuthorized
      })
      mountWith()
    })

    BddTest().then('it should check again, keeping its value meanwhile', async () => {
      await flushPromises()
      expect(canOpen.value).toBe(true)

      mockRoles.value = [ERole.ROLE_ADMIN, ERole.ROLE_GROUP_MANAGER]
      await nextTick()
      expect(isAuthorized).toHaveBeenCalledTimes(2)
      expect(canOpen.value).toBe(true)

      check.resolve(false)
      await flushPromises()
      expect(canOpen.value).toBe(false)
    })
  })

  BddTest().when('the callbacks data may have changed', () => {
    const check = deferred()
    const isAuthorized = vi.fn().mockResolvedValueOnce(true).mockReturnValueOnce(check.promise)

    beforeEach(() => {
      mockRestrictions({
        isAuthorized
      })
      mountWith()
    })

    BddTest().then('it should check again with the same params, keeping its value meanwhile', async () => {
      await flushPromises()
      expect(canOpen.value).toBe(true)

      invalidateRouteAccess()
      await nextTick()
      expect(isAuthorized).toHaveBeenLastCalledWith('group-id', 'user-id')
      expect(canOpen.value).toBe(true)

      check.resolve(false)
      await flushPromises()
      expect(canOpen.value).toBe(false)
    })
  })

  BddTest().when('the callbacks data may have changed, while the route has none', () => {
    beforeEach(() => {
      mockRestrictions({
        roles: [[ERole.ROLE_ADMIN]]
      })
      mountWith()
    })

    BddTest().then('it should not check it again', async () => {
      await flushPromises()
      invalidateRouteAccess()
      await flushPromises()

      expect(mockGetRouteRestrictions).toHaveBeenCalledTimes(1)
      expect(canOpen.value).toBe(true)
    })
  })

  BddTest().when('a callback uses a composable relying on inject(), such as useQueryClient()', () => {
    const isAuthorized = vi.fn(() => useQueryClient() !== undefined)

    beforeEach(() => {
      mockRestrictions({
        isAuthorized
      })
      mountWith({
        useTanstack: true
      })
    })

    BddTest().then('it should work, also when checked again', async () => {
      await flushPromises()
      userId.value = 'other-user-id'
      await flushPromises()

      expect(isAuthorized.mock.results).toStrictEqual([
        { type: 'return', value: true },
        { type: 'return', value: true }
      ])
      expect(canOpen.value).toBe(true)
    })
  })

  BddTest().when('it is used outside of a component, in an effect scope', () => {
    beforeEach(() => {
      mockRestrictions({
        isAuthorized: async () => true
      })
    })

    BddTest().then('it should check all the same', async () => {
      const scope = effectScope()
      const canAccess = scope.run(useUserAccess)
      await flushPromises()
      expect(canAccess?.value).toBe(true)
      scope.stop()
    })
  })

  BddTest().when('it is called in a template rather than in setup()', () => {
    BddTest().then('it should throw, rather than start a new check at every render', () => {
      const Misused = defineComponent({
        setup: () => () => useUserAccess().value ? h('a', 'user') : null,
      })

      expect(() => mountComponent(Misused)).toThrow('[useCanAccessRoute]')
    })
  })
})
