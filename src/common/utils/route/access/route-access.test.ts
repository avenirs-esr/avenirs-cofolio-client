import type { AccessRights, RouteRestrictions } from '@/common/types/route-restrictions'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ERole, EUniverse } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { canAccessRoute, getRouteAccessRights } from '@/common/utils/route/access/route-access'

const { mockGetRouteRestrictions } = vi.hoisted(() => ({
  mockGetRouteRestrictions: vi.fn(),
}))

const mockUniverses = ref<EUniverse[]>([])
const mockRoles = ref<ERole[]>([])

vi.mock('@/common/utils/route/restrictions/route-restrictions', () => ({
  getRouteRestrictions: mockGetRouteRestrictions,
}))

vi.mock('@/features/auth/global/composables/use-current-user-session/use-current-user-session', () => ({
  useCurrentUserSession: () => ({
    roles: mockRoles,
    universes: { available: mockUniverses },
  }),
}))

function buildRestrictions (overrides: Partial<RouteRestrictions>): RouteRestrictions {
  return { universes: [], roles: [], ...overrides }
}

const USER: AccessRights = {
  universes: [EUniverse.STUDENT, EUniverse.STAFF],
  roles: [ERole.ROLE_STUDENT_PORTFOLIO, ERole.ROLE_ADMIN],
}

beforeEach(() => {
  mockGetRouteRestrictions.mockReset()
  mockUniverses.value = [...USER.universes]
  mockRoles.value = [...USER.roles]
})

BddTest().given('getRouteAccessRights', () => {
  BddTest().when('the route has no restrictions', () => {
    BddTest().then('it should return all the rights of the user', () => {
      expect(getRouteAccessRights(undefined)).toEqual(USER)
    })
  })

  BddTest().when('the route does not constrain a criterion', () => {
    BddTest().then('it should return all the universes of the user when only the roles are constrained', () => {
      const restrictions = buildRestrictions({ roles: [[ERole.ROLE_ADMIN]] })
      expect(getRouteAccessRights(restrictions)?.universes).toEqual(USER.universes)
    })

    BddTest().then('it should return all the roles of the user when only the universes are constrained', () => {
      const restrictions = buildRestrictions({ universes: [[EUniverse.STAFF]] })
      expect(getRouteAccessRights(restrictions)?.roles).toEqual(USER.roles)
    })

    BddTest().then('it should not deny the access because the user has no universe when only the roles are constrained', () => {
      mockUniverses.value = []

      const restrictions = buildRestrictions({ roles: [[ERole.ROLE_ADMIN]] })
      expect(getRouteAccessRights(restrictions)).toEqual({ universes: [], roles: [ERole.ROLE_ADMIN] })
    })
  })

  BddTest().when('the user holds one of the roles of the condition', () => {
    BddTest().then('it should return the roles of the user accepted by the route', () => {
      const restrictions = buildRestrictions({ roles: [[ERole.ROLE_GROUP_MANAGER, ERole.ROLE_ADMIN]] })
      expect(getRouteAccessRights(restrictions)?.roles).toEqual([ERole.ROLE_ADMIN])
    })
  })

  BddTest().when('the user holds a role of each condition', () => {
    BddTest().then('it should return the roles of the user accepted by the route', () => {
      const restrictions = buildRestrictions({ roles: [[ERole.ROLE_ADMIN], [ERole.ROLE_STUDENT_PORTFOLIO]] })
      expect(getRouteAccessRights(restrictions)?.roles).toEqual([ERole.ROLE_STUDENT_PORTFOLIO, ERole.ROLE_ADMIN])
    })
  })

  BddTest().when('the user holds no role of one of the conditions', () => {
    BddTest().then('it should return undefined', () => {
      const restrictions = buildRestrictions({ roles: [[ERole.ROLE_ADMIN], [ERole.ROLE_EXTERNAL_USER_MANAGER]] })
      expect(getRouteAccessRights(restrictions)).toBeUndefined()
    })
  })

  BddTest().when('universes of the user are accepted by every condition', () => {
    BddTest().then('it should return them, in the order of the user', () => {
      const restrictions = buildRestrictions({ universes: [[EUniverse.STAFF, EUniverse.STUDENT]] })
      expect(getRouteAccessRights(restrictions)?.universes).toEqual([EUniverse.STUDENT, EUniverse.STAFF])
    })

    BddTest().then('it should leave out those accepted by some conditions only', () => {
      const restrictions = buildRestrictions({ universes: [[EUniverse.STAFF, EUniverse.STUDENT], [EUniverse.STAFF]] })
      expect(getRouteAccessRights(restrictions)?.universes).toEqual([EUniverse.STAFF])
    })
  })

  BddTest().when('each condition on the universes is only met by a different universe of the user', () => {
    BddTest().then('it should return undefined, as a single universe is active at a time', () => {
      const restrictions = buildRestrictions({ universes: [[EUniverse.STUDENT], [EUniverse.STAFF]] })
      expect(getRouteAccessRights(restrictions)).toBeUndefined()
    })
  })

  BddTest().when('the user has no universe accepted by the route', () => {
    BddTest().then('it should return undefined', () => {
      mockUniverses.value = [EUniverse.STUDENT]

      const restrictions = buildRestrictions({ universes: [[EUniverse.STAFF]] })
      expect(getRouteAccessRights(restrictions)).toBeUndefined()
    })
  })

  BddTest().when('the user meets one criterion of the route but not the other', () => {
    BddTest().then('it should return undefined', () => {
      const restrictions = buildRestrictions({ universes: [[EUniverse.STAFF]], roles: [[ERole.ROLE_GROUP_MANAGER]] })
      expect(getRouteAccessRights(restrictions)).toBeUndefined()
    })
  })

  BddTest().when('a route is given instead of its restrictions', () => {
    BddTest().then('it should compare the rights of the user with the restrictions of this route', () => {
      mockGetRouteRestrictions.mockReturnValue(buildRestrictions({ universes: [[EUniverse.STAFF]] }))

      expect(getRouteAccessRights(ROUTES.STAFF.HOME)).toEqual({ universes: [EUniverse.STAFF], roles: USER.roles })
      expect(mockGetRouteRestrictions).toHaveBeenCalledWith(ROUTES.STAFF.HOME.name)
    })

    BddTest().then('it should return all the rights of the user when the route has no restrictions', () => {
      mockGetRouteRestrictions.mockReturnValue(undefined)

      expect(getRouteAccessRights(ROUTES.AUTH.LOGIN)).toEqual(USER)
    })
  })
})

BddTest().given('canAccessRoute', () => {
  BddTest().when('the user meets the restrictions of the route', () => {
    BddTest().then('it should return true', () => {
      mockGetRouteRestrictions.mockReturnValue(buildRestrictions({ roles: [[ERole.ROLE_ADMIN]] }))

      expect(canAccessRoute(ROUTES.STAFF.ADMIN.USERS)).toBe(true)
    })
  })

  BddTest().when('the user does not meet the restrictions of the route', () => {
    BddTest().then('it should return false', () => {
      mockGetRouteRestrictions.mockReturnValue(buildRestrictions({ roles: [[ERole.ROLE_EXTERNAL_USER_MANAGER]] }))

      expect(canAccessRoute(ROUTES.STAFF.ADMIN.USERS)).toBe(false)
    })
  })

  BddTest().when('the rights of the user change', () => {
    BddTest().then('a computed using it should follow them', () => {
      mockGetRouteRestrictions.mockReturnValue(buildRestrictions({ roles: [[ERole.ROLE_EXTERNAL_USER_MANAGER]] }))

      const canAccessUsers = computed(() => canAccessRoute(ROUTES.STAFF.ADMIN.USERS))
      expect(canAccessUsers.value).toBe(false)

      mockRoles.value = [...USER.roles, ERole.ROLE_EXTERNAL_USER_MANAGER]

      expect(canAccessUsers.value).toBe(true)
    })
  })
})
