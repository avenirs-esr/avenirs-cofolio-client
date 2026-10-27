import type { AccessRights, LocationParams, RouteRestrictions } from '@/common/types/route-restrictions.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { ERole, EUniverse } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { invalidateRouteAccess } from '@/common/utils/route/access-state/route-access-state'
import { canAccessRoute, checkRouteAccess } from '@/common/utils/route/access/route-access'

const USER: AccessRights = {
  universes: [EUniverse.STUDENT, EUniverse.STAFF],
  roles: [ERole.ROLE_STUDENT_PORTFOLIO, ERole.ROLE_ADMIN],
}

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
      available: mockUniverses
    }
  })
}))

function buildRestrictions (overrides: Partial<RouteRestrictions>): RouteRestrictions {
  return {
    universes: [],
    roles: [],
    authorizations: [],
    ...overrides
  }
}

function buildLocation (restrictions: RouteRestrictions | undefined, params: LocationParams = {}) {
  return {
    meta: {
      restrictions
    },
    params
  }
}

beforeEach(() => {
  mockGetRouteRestrictions.mockReset()
  mockUniverses.value = [...USER.universes]
  mockRoles.value = [...USER.roles]
})

BddTest().given('checkRouteAccess', () => {
  BddTest().when('the route has no restrictions', () => {
    BddTest().then('it should resolve to all the session rights', async () => {
      await expect(checkRouteAccess(buildLocation(undefined))).resolves.toEqual(USER)
    })
  })

  BddTest().when('the route does not constrain a criterion', () => {
    BddTest().then('it should give all the universes of the user when only the roles are constrained', async () => {
      const restrictions = buildRestrictions({
        roles: [[ERole.ROLE_ADMIN]]
      })
      await expect(checkRouteAccess(buildLocation(restrictions))).resolves.toMatchObject({
        universes: USER.universes
      })
    })

    BddTest().then('it should give all the roles of the user when only the universes are constrained', async () => {
      const restrictions = buildRestrictions({
        universes: [[EUniverse.STAFF]]
      })
      await expect(checkRouteAccess(buildLocation(restrictions))).resolves.toMatchObject({
        roles: USER.roles
      })
    })

    BddTest().then('it should not deny the access because the user has no universe when only the roles are constrained', async () => {
      mockUniverses.value = []

      const restrictions = buildRestrictions({
        roles: [[ERole.ROLE_ADMIN]]
      })
      await expect(checkRouteAccess(buildLocation(restrictions))).resolves.toEqual({
        universes: [],
        roles: [ERole.ROLE_ADMIN]
      })
    })
  })

  BddTest().when('the user holds one of the condition roles', () => {
    BddTest().then('it should give the roles accepted by the route', async () => {
      const restrictions = buildRestrictions({
        roles: [[ERole.ROLE_GROUP_MANAGER, ERole.ROLE_ADMIN]]
      })
      await expect(checkRouteAccess(buildLocation(restrictions))).resolves.toMatchObject({
        roles: [ERole.ROLE_ADMIN]
      })
    })
  })

  BddTest().when('the user holds a role of each condition', () => {
    BddTest().then('it should give the roles accepted by the route', async () => {
      const restrictions = buildRestrictions({
        roles: [[ERole.ROLE_ADMIN], [ERole.ROLE_STUDENT_PORTFOLIO]]
      })
      await expect(checkRouteAccess(buildLocation(restrictions))).resolves.toMatchObject({
        roles: [ERole.ROLE_STUDENT_PORTFOLIO, ERole.ROLE_ADMIN]
      })
    })
  })

  BddTest().when('the user holds no role of one of the conditions', () => {
    BddTest().then('it should resolve to undefined', async () => {
      const restrictions = buildRestrictions({
        roles: [[ERole.ROLE_ADMIN], [ERole.ROLE_EXTERNAL_USER_MANAGER]]
      })
      await expect(checkRouteAccess(buildLocation(restrictions))).resolves.toBeUndefined()
    })
  })

  BddTest().when('user universes are accepted by every condition', () => {
    BddTest().then('it should give them, in the order of the user', async () => {
      const restrictions = buildRestrictions({
        universes: [[EUniverse.STAFF, EUniverse.STUDENT]]
      })
      await expect(checkRouteAccess(buildLocation(restrictions))).resolves.toMatchObject({
        universes: [EUniverse.STUDENT, EUniverse.STAFF]
      })
    })

    BddTest().then('it should leave out those accepted by some conditions only', async () => {
      const restrictions = buildRestrictions({
        universes: [[EUniverse.STAFF, EUniverse.STUDENT], [EUniverse.STAFF]]
      })
      await expect(checkRouteAccess(buildLocation(restrictions))).resolves.toMatchObject({
        universes: [EUniverse.STAFF]
      })
    })
  })

  BddTest().when('each condition on the universes is only met by a different universe', () => {
    BddTest().then('it should resolve to undefined, as a single universe is active at a time', async () => {
      const restrictions = buildRestrictions({
        universes: [[EUniverse.STUDENT], [EUniverse.STAFF]]
      })
      await expect(checkRouteAccess(buildLocation(restrictions))).resolves.toBeUndefined()
    })
  })

  BddTest().when('the user has no universe accepted by the route', () => {
    BddTest().then('it should resolve to undefined', async () => {
      mockUniverses.value = [EUniverse.STUDENT]

      const restrictions = buildRestrictions({
        universes: [[EUniverse.STAFF]]
      })
      await expect(checkRouteAccess(buildLocation(restrictions))).resolves.toBeUndefined()
    })
  })

  BddTest().when('the user meets one route criterion but not the other', () => {
    BddTest().then('it should resolve to undefined', async () => {
      const restrictions = buildRestrictions({
        universes: [[EUniverse.STAFF]],
        roles: [[ERole.ROLE_GROUP_MANAGER]]
      })
      await expect(checkRouteAccess(buildLocation(restrictions))).resolves.toBeUndefined()
    })
  })

  BddTest().when('the user does not meet the route criteria', () => {
    BddTest().then('it should resolve to undefined without calling the callbacks', async () => {
      const isAuthorized = vi.fn(() => true)
      const restrictions = buildRestrictions({
        roles: [[ERole.ROLE_EXTERNAL_USER_MANAGER]],
        authorizations: [{
          isAuthorized,
          paramNames: []
        }]
      })

      await expect(checkRouteAccess(buildLocation(restrictions))).resolves.toBeUndefined()
      expect(isAuthorized).not.toHaveBeenCalled()
    })
  })

  BddTest().when('every callback gives access, synchronously or not', () => {
    BddTest().then('it should resolve to the session rights that the route accepts', async () => {
      const restrictions = buildRestrictions({
        roles: [[ERole.ROLE_ADMIN]],
        authorizations: [
          {
            isAuthorized: () => true,
            paramNames: []
          },
          {
            isAuthorized: async () => true,
            paramNames: []
          }
        ]
      })
      await expect(checkRouteAccess(buildLocation(restrictions))).resolves.toEqual({
        universes: USER.universes,
        roles: [ERole.ROLE_ADMIN]
      })
    })
  })

  BddTest().when('a callback denies access', () => {
    BddTest().then('it should resolve to undefined, the other callbacks running all the same', async () => {
      const isGranting = vi.fn(() => true)
      const restrictions = buildRestrictions({
        authorizations: [
          {
            isAuthorized: async () => false,
            paramNames: []
          },
          {
            isAuthorized: isGranting,
            paramNames: []
          }
        ]
      })

      await expect(checkRouteAccess(buildLocation(restrictions))).resolves.toBeUndefined()
      expect(isGranting).toHaveBeenCalledOnce()
    })
  })

  BddTest().when('a callback takes params', () => {
    BddTest().then('it should get those of the location, in the order of its param names', async () => {
      const isAuthorized = vi.fn(() => true)
      const restrictions = buildRestrictions({
        authorizations: [{
          isAuthorized,
          paramNames: ['groupId', 'userId']
        }]
      })

      await checkRouteAccess(buildLocation(restrictions, { userId: '2', groupId: '1' }))
      expect(isAuthorized.mock.calls).toStrictEqual([['1', '2']])
    })

    BddTest().then('it should get an absent optional param as undefined, even given as an empty string', async () => {
      const isAuthorized = vi.fn(() => true)
      const restrictions = buildRestrictions({
        authorizations: [{
          isAuthorized,
          paramNames: ['thematic', 'id']
        }]
      })

      await checkRouteAccess(buildLocation(restrictions, { thematic: '' }))
      expect(isAuthorized.mock.calls).toStrictEqual([[undefined, undefined]])
    })
  })

  BddTest().when('a callback takes no params, as that of a group', () => {
    BddTest().then('it should be called without arguments, whatever the location params', async () => {
      const isAuthorized = vi.fn(() => true)
      const restrictions = buildRestrictions({
        authorizations: [{
          isAuthorized,
          paramNames: []
        }]
      })

      await checkRouteAccess(buildLocation(restrictions, { id: '42' }))
      expect(isAuthorized.mock.calls).toStrictEqual([[]])
    })
  })

  BddTest().when('it is called', () => {
    BddTest().then('the callbacks should all start before it returns, so that they can use inject()', async () => {
      const isAuthorized = vi.fn(async () => true)
      const restrictions = buildRestrictions({
        authorizations: [
          {
            isAuthorized,
            paramNames: []
          },
          {
            isAuthorized,
            paramNames: []
          }
        ]
      })

      const access = checkRouteAccess(buildLocation(restrictions))
      expect(isAuthorized).toHaveBeenCalledTimes(2)
      await expect(access).resolves.toEqual(USER)
    })
  })

  BddTest().when('a callback throws', () => {
    BddTest().then('it should reject with its error', async () => {
      const error = new Error('Network Error')
      const restrictions = buildRestrictions({
        authorizations: [{
          isAuthorized: () => {
            throw error
          },
          paramNames: []
        }]
      })

      await expect(checkRouteAccess(buildLocation(restrictions))).rejects.toBe(error)
    })
  })

  BddTest().when('it is called in an effect, and the callbacks data may have changed', () => {
    BddTest().then('the effect should run again, calling the callbacks again', async () => {
      const isAuthorized = vi.fn(() => true)
      const restrictions = buildRestrictions({
        authorizations: [{
          isAuthorized,
          paramNames: []
        }]
      })
      const stop = watchEffect(() => {
        void checkRouteAccess(buildLocation(restrictions))
      })

      invalidateRouteAccess()
      await flushPromises()
      stop()

      expect(isAuthorized).toHaveBeenCalledTimes(2)
    })

    BddTest().then('the effect should not run again for a route without callbacks', async () => {
      const restrictions = buildRestrictions({
        roles: [[ERole.ROLE_ADMIN]]
      })
      const effect = vi.fn(() => {
        void checkRouteAccess(buildLocation(restrictions))
      })
      const stop = watchEffect(effect)

      invalidateRouteAccess()
      await flushPromises()
      stop()

      expect(effect).toHaveBeenCalledTimes(1)
    })
  })
})

BddTest().given('canAccessRoute', () => {
  BddTest().when('the user meets the criteria and every callback gives access', () => {
    BddTest().then('it should resolve to true', async () => {
      const restrictions = buildRestrictions({
        roles: [[ERole.ROLE_ADMIN]],
        authorizations: [{
          isAuthorized: async () => true,
          paramNames: []
        }]
      })
      mockGetRouteRestrictions.mockReturnValue(restrictions)

      await expect(canAccessRoute(ROUTES.STAFF.ADMIN.USERS)).resolves.toBe(true)
      expect(mockGetRouteRestrictions).toHaveBeenCalledWith(ROUTES.STAFF.ADMIN.USERS.name)
    })
  })

  BddTest().when('the route has no restrictions', () => {
    BddTest().then('it should resolve to true', async () => {
      mockGetRouteRestrictions.mockReturnValue(undefined)

      await expect(canAccessRoute(ROUTES.AUTH.LOGIN)).resolves.toBe(true)
    })
  })

  BddTest().when('the user does not meet the criteria', () => {
    BddTest().then('it should resolve to false without calling the callbacks', async () => {
      const isAuthorized = vi.fn(() => true)
      const restrictions = buildRestrictions({
        roles: [[ERole.ROLE_EXTERNAL_USER_MANAGER]],
        authorizations: [{
          isAuthorized,
          paramNames: []
        }]
      })
      mockGetRouteRestrictions.mockReturnValue(restrictions)

      await expect(canAccessRoute(ROUTES.STAFF.ADMIN.USERS)).resolves.toBe(false)
      expect(isAuthorized).not.toHaveBeenCalled()
    })
  })

  BddTest().when('a callback denies access', () => {
    BddTest().then('it should resolve to false', async () => {
      const restrictions = buildRestrictions({
        authorizations: [{
          isAuthorized: () => false,
          paramNames: []
        }]
      })
      mockGetRouteRestrictions.mockReturnValue(restrictions)

      await expect(canAccessRoute(ROUTES.STAFF.ADMIN.USERS)).resolves.toBe(false)
    })
  })

  BddTest().when('a callback throws or rejects', () => {
    BddTest().then('it should resolve to false instead of rejecting', async () => {
      const restrictionsThrow = buildRestrictions({
        authorizations: [{
          isAuthorized: () => {
            throw new Error('Network Error')
          },
          paramNames: []
        }]
      })
      mockGetRouteRestrictions.mockReturnValueOnce(restrictionsThrow)
      await expect(canAccessRoute(ROUTES.STAFF.ADMIN.USERS)).resolves.toBe(false)

      const restrictionsReject = buildRestrictions({
        authorizations: [{
          isAuthorized: () => Promise.reject(new Error('Network Error')),
          paramNames: []
        }]
      })
      mockGetRouteRestrictions.mockReturnValueOnce(restrictionsReject)
      await expect(canAccessRoute(ROUTES.STAFF.ADMIN.USERS)).resolves.toBe(false)
    })
  })

  BddTest().when('params are given', () => {
    BddTest().then('the route callback should get them, in order, and those of the groups nothing', async () => {
      const isGroupAuthorized = vi.fn(() => true)
      const isRouteAuthorized = vi.fn(() => true)
      const rejections = buildRestrictions({
        authorizations: [
          {
            isAuthorized: isGroupAuthorized,
            paramNames: []
          },
          {
            isAuthorized: isRouteAuthorized,
            paramNames: ['groupId', 'userId']
          }
        ]
      })
      mockGetRouteRestrictions.mockReturnValue(rejections)

      await expect(canAccessRoute(ROUTES.STAFF.ADMIN.GROUP.USER, '1', '2')).resolves.toBe(true)
      expect(isGroupAuthorized.mock.calls).toStrictEqual([[]])
      expect(isRouteAuthorized.mock.calls).toStrictEqual([['1', '2']])
    })

    BddTest().then('the callback should get undefined for the optional params left out', async () => {
      const isAuthorized = vi.fn(() => true)
      const rejections = buildRestrictions({
        authorizations: [{
          isAuthorized,
          paramNames: ['thematic', 'id']
        }]
      })
      mockGetRouteRestrictions.mockReturnValue(rejections)

      await canAccessRoute(ROUTES.STUDENT.ACTIVITIES_CATALOG, 'math')
      await canAccessRoute(ROUTES.STUDENT.ACTIVITIES_CATALOG)
      expect(isAuthorized.mock.calls).toStrictEqual([
        ['math', undefined],
        [undefined, undefined]
      ])
    })
  })

  BddTest().when('it is called', () => {
    BddTest().then('the callbacks should start before it returns, so that they can use inject()', async () => {
      const isAuthorized = vi.fn(async () => true)
      const restrictions = buildRestrictions({
        authorizations: [{
          isAuthorized,
          paramNames: []
        }]
      })
      mockGetRouteRestrictions.mockReturnValue(restrictions)

      const access = canAccessRoute(ROUTES.STAFF.ADMIN.USERS)
      expect(isAuthorized).toHaveBeenCalledOnce()
      await expect(access).resolves.toBe(true)
    })
  })
})
