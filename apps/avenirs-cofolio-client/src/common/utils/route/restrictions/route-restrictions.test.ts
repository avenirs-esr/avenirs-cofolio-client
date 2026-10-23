import type { RouteRecordRaw } from 'vue-router'
import type { RouteName, RouteRestrictions } from '@/common/types/route-restrictions.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { ERole, EUniverse } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { applyRouteRestrictions, getRouteRestrictions } from '@/common/utils/route/restrictions/route-restrictions'

const component = { render: () => null }

function buildRouter (...records: RouteRecordRaw[]) {
  return createRouter({ history: createMemoryHistory(), routes: applyRouteRestrictions(...records) })
}

function routeNames (routes: object): string[] {
  return 'name' in routes && typeof routes.name === 'string'
    ? [routes.name]
    : Object.values(routes).flatMap(child => routeNames(child as object))
}

const FAKE_ROUTES = {
  AUTH: {
    LOGIN: { name: 'fake-auth-login', path: 'login' },
  },
  STAFF: {
    HOME: { name: 'fake-staff-home', path: '' },
    ADMIN: {
      GROUPS: { name: 'fake-staff-admin-groups', path: 'admin/groups' },
      USERS: { name: 'fake-staff-admin-users', path: 'admin/users' },
      USER: { name: 'fake-staff-admin-user', path: 'admin/group/:groupId/user/:userId' },
    },
  },
}

const CASCADE = {
  STAFF: {
    default: { universes: [EUniverse.STAFF] },
    ADMIN: {
      default: { roles: [ERole.ROLE_ADMIN] },
      USERS: { roles: [ERole.ROLE_EXTERNAL_USER_MANAGER] },
    },
  },
}

async function resolveWith ({ routes = FAKE_ROUTES, restrictions = {} }: { routes?: object, restrictions?: object }) {
  vi.resetModules()
  vi.doMock('@/common/constants', () => ({
    ROUTES: routes,
  }))
  vi.doMock('@/common/constants/route-restrictions', () => ({
    ROUTE_RESTRICTIONS: restrictions
  }))
  const restrictionsModule = await import('@/common/utils/route/restrictions/route-restrictions')

  return (name: string): RouteRestrictions | undefined => restrictionsModule.getRouteRestrictions(name as RouteName<typeof ROUTES>)
}

BddTest().given('applyRouteRestrictions', () => {
  BddTest().when('a record is named after a restricted route of ROUTES', () => {
    BddTest().then('it should get the restrictions of this route in meta.restrictions', () => {
      const [record] = applyRouteRestrictions({
        path: '/staff',
        name: ROUTES.STAFF.HOME.name,
        component
      })
      expect(record?.meta?.restrictions).toBe(getRouteRestrictions(ROUTES.STAFF.HOME.name))
    })
  })

  BddTest().when('a record is named after a route of ROUTES without restrictions', () => {
    BddTest().then('it should not get any restriction', () => {
      const [record] = applyRouteRestrictions({
        path: '/login',
        name: ROUTES.AUTH.LOGIN.name,
        component
      })
      expect(record?.meta?.restrictions).toBeUndefined()
    })
  })

  BddTest().when('the record already has a meta', () => {
    BddTest().then('it should keep its other fields', () => {
      const [record] = applyRouteRestrictions({
        path: '/staff',
        name: ROUTES.STAFF.HOME.name,
        component,
        meta: {
          title: 'Home'
        }
      })
      expect(record?.meta).toEqual({
        title: 'Home',
        restrictions: getRouteRestrictions(ROUTES.STAFF.HOME.name)
      })
    })
  })

  BddTest().when('a record is not named after a route of ROUTES', () => {
    BddTest().then('it should not get any restriction', () => {
      const [record] = applyRouteRestrictions({
        path: '/',
        name: 'home',
        component
      })
      expect(record?.meta?.restrictions).toBeUndefined()
    })
  })

  BddTest().when('a record has no name', () => {
    BddTest().then('it should not get any restriction, so as to inherit those of its parent', () => {
      const [record] = applyRouteRestrictions({
        path: '/staff',
        component
      })
      expect(record?.meta?.restrictions).toBeUndefined()
    })
  })

  BddTest().when('the name of a record is not a string (Symbol)', () => {
    BddTest().then('it should not get any restriction', () => {
      const [record] = applyRouteRestrictions({
        path: '/staff',
        name: Symbol(ROUTES.STAFF.HOME.name),
        component
      })
      expect(record?.meta?.restrictions).toBeUndefined()
    })
  })

  BddTest().when('a record has children', () => {
    BddTest().then('its children should get their restrictions too', () => {
      const [record] = applyRouteRestrictions({
        path: '/staff',
        component,
        children: [{
          path: ROUTES.STAFF.ADMIN.USERS.path,
          name: ROUTES.STAFF.ADMIN.USERS.name,
          component
        }]
      })
      expect(record?.children?.[0]?.meta?.restrictions).toBe(getRouteRestrictions(ROUTES.STAFF.ADMIN.USERS.name))
    })
  })

  BddTest().when('records are named after every route of ROUTES', () => {
    BddTest().then('each of them should get the restrictions of its route, if any', () => {
      const namedRecords = routeNames(ROUTES).map(name => ({
        path: `/${name}`,
        name,
        component
      }))
      const records = applyRouteRestrictions(...namedRecords)
      const mismatches = records.filter(record => record.meta?.restrictions !== getRouteRestrictions(record.name as RouteName<typeof ROUTES>))
      expect(mismatches.map(record => record.name)).toEqual([])
    })
  })

  BddTest().when('records are given', () => {
    BddTest().then('it should leave them untouched', () => {
      const records: RouteRecordRaw[] = [{
        path: '/staff',
        component,
        meta: {
          title: 'Staff'
        },
        children: [{
          path: ROUTES.STAFF.ADMIN.USERS.path,
          name: ROUTES.STAFF.ADMIN.USERS.name,
          component
        }]
      }]
      applyRouteRestrictions(...records)
      expect(records[0]?.meta).toEqual({
        title: 'Staff'
      })
      expect(records[0]?.children?.[0]?.meta).toBeUndefined()
    })
  })

  BddTest().when('an unnamed record is nested in a restricted route of ROUTES', () => {
    BddTest().then('it should inherit the restrictions of its parent through the router', () => {
      const router = buildRouter({
        path: '/staff/admin/users',
        name: ROUTES.STAFF.ADMIN.USERS.name,
        component,
        children: [{
          path: 'details',
          component
        }]
      })
      const resolvedRestrictions = router.resolve('/staff/admin/users/details').meta.restrictions
      expect(resolvedRestrictions).toBe(getRouteRestrictions(ROUTES.STAFF.ADMIN.USERS.name))
    })
  })

  BddTest().when('a route of ROUTES without restrictions is nested in a restricted one', () => {
    BddTest().then('it should inherit the restrictions of its parent through the router', () => {
      const router = buildRouter({
        path: '/staff/admin/users',
        name: ROUTES.STAFF.ADMIN.USERS.name,
        component,
        children: [{
          path: ROUTES.AUTH.LOGIN.path,
          name: ROUTES.AUTH.LOGIN.name,
          component
        }]
      })
      const resolvedRestrictions = router.resolve({ name: ROUTES.AUTH.LOGIN.name }).meta.restrictions
      expect(resolvedRestrictions).toBe(getRouteRestrictions(ROUTES.STAFF.ADMIN.USERS.name))
    })
  })
})

BddTest().given('getRouteRestrictions', () => {
  BddTest().when('a route is restricted at several levels of ROUTE_RESTRICTIONS', () => {
    BddTest().then('it should return the condition of each level', () => {
      expect(getRouteRestrictions(ROUTES.STAFF.ADMIN.USERS.name)).toEqual({
        universes: [[EUniverse.STAFF]],
        roles: [[ERole.ROLE_ADMIN]],
        authorizations: []
      })
    })
  })

  BddTest().when('a route has no restriction', () => {
    BddTest().then('it should return undefined', () => {
      expect(getRouteRestrictions(ROUTES.AUTH.LOGIN.name)).toBeUndefined()
    })
  })

  BddTest().when('it is called several times for the same route', () => {
    BddTest().then('it should return the same object, resolved once', () => {
      expect(getRouteRestrictions(ROUTES.STAFF.HOME.name)).toBe(getRouteRestrictions(ROUTES.STAFF.HOME.name))
    })
  })
})

BddTest().given('the resolution of ROUTE_RESTRICTIONS', () => {
  afterEach(() => {
    vi.doUnmock('@/common/constants')
    vi.doUnmock('@/common/constants/route-restrictions')
  })

  BddTest().when('restrictions are declared on a group and on one of its routes', () => {
    BddTest().then('the route should get the conditions of the group, then its own', async () => {
      const restrictionOf = await resolveWith({
        restrictions: CASCADE
      })
      expect(restrictionOf('fake-staff-admin-users')).toEqual({
        universes: [[EUniverse.STAFF]],
        roles: [[ERole.ROLE_ADMIN], [ERole.ROLE_EXTERNAL_USER_MANAGER]],
        authorizations: [],
      })
    })

    BddTest().then('the other routes of the group should only get those of the group', async () => {
      const restrictionOf = await resolveWith({
        restrictions: CASCADE
      })
      expect(restrictionOf('fake-staff-admin-groups')).toEqual({
        universes: [[EUniverse.STAFF]],
        roles: [[ERole.ROLE_ADMIN]],
        authorizations: []
      })
      expect(restrictionOf('fake-staff-home')).toEqual({
        universes: [[EUniverse.STAFF]],
        roles: [],
        authorizations: []
      })
    })
  })

  BddTest().when('nothing is declared for a route', () => {
    BddTest().then('it should have no restrictions', async () => {
      const restrictionOf = await resolveWith({
        restrictions: CASCADE
      })
      expect(restrictionOf('fake-auth-login')).toBeUndefined()
    })
  })

  BddTest().when('only empty lists are declared for a route', () => {
    BddTest().then('it should have no restrictions', async () => {
      const restrictionOf = await resolveWith({
        restrictions: {
          AUTH: {
            default: {
              universes: []
            },
            LOGIN: {
              roles: []
            }
          }
        }
      })
      expect(restrictionOf('fake-auth-login')).toBeUndefined()
    })
  })

  BddTest().when('a value is declared twice in the same list', () => {
    BddTest().then('it should appear only once in the condition', async () => {
      const restrictionOf = await resolveWith({
        restrictions: {
          STAFF: {
            HOME: {
              roles: [ERole.ROLE_ADMIN, ERole.ROLE_ADMIN]
            }
          }
        }
      })
      expect(restrictionOf('fake-staff-home')?.roles).toEqual([[ERole.ROLE_ADMIN]])
    })
  })

  BddTest().when('a value is declared at several levels', () => {
    BddTest().then('each level should keep its own condition', async () => {
      const restrictionOf = await resolveWith({
        restrictions: {
          STAFF: {
            default: {
              roles: [ERole.ROLE_ADMIN]
            },
            ADMIN: {
              USERS: {
                roles: [ERole.ROLE_EXTERNAL_USER_MANAGER, ERole.ROLE_ADMIN]
              }
            }
          }
        }
      })
      expect(restrictionOf('fake-staff-admin-users')?.roles).toEqual([
        [ERole.ROLE_ADMIN],
        [ERole.ROLE_EXTERNAL_USER_MANAGER, ERole.ROLE_ADMIN],
      ])
    })
  })

  BddTest().when('a group takes a restriction directly', () => {
    BddTest().then('it should apply to every route of the group', async () => {
      const restrictionOf = await resolveWith({
        restrictions: {
          STAFF: {
            ADMIN: {
              roles: [ERole.ROLE_ADMIN]
            }
          }
        }
      })
      expect(restrictionOf('fake-staff-admin-groups')?.roles).toEqual([[ERole.ROLE_ADMIN]])
      expect(restrictionOf('fake-staff-admin-users')?.roles).toEqual([[ERole.ROLE_ADMIN]])
    })
  })

  BddTest().when('a callback is declared on a route', () => {
    BddTest().then('the route should get it, with the params names of its path', async () => {
      const isAuthorized = () => true
      const restrictionOf = await resolveWith({
        restrictions: {
          STAFF: {
            ADMIN: {
              USER: {
                isAuthorized
              }
            }
          }
        }
      })
      expect(restrictionOf('fake-staff-admin-user')?.authorizations).toEqual([{
        isAuthorized,
        paramNames: ['groupId', 'userId']
      }])
    })
  })

  BddTest().when('a callback is declared on a group', () => {
    BddTest().then('every route of the group should get it, without params', async () => {
      const isAuthorized = () => true
      const restrictionOf = await resolveWith({
        restrictions: {
          STAFF: {
            ADMIN: {
              isAuthorized
            }
          }
        }
      })
      expect(restrictionOf('fake-staff-admin-user')?.authorizations).toEqual([{
        isAuthorized,
        paramNames: []
      }])
      expect(restrictionOf('fake-staff-admin-users')?.authorizations).toEqual([{
        isAuthorized,
        paramNames: []
      }])
    })
  })

  BddTest().when('callbacks are declared at several levels', () => {
    BddTest().then('the route should get those of every level, from the root down to the route', async () => {
      const isStaffAuthorized = () => true
      const isUserAuthorized = () => true
      const restrictionOf = await resolveWith({
        restrictions: {
          STAFF: {
            default: {
              isAuthorized: isStaffAuthorized
            },
            ADMIN: {
              USER: {
                isAuthorized: isUserAuthorized
              }
            }
          }
        }
      })
      expect(restrictionOf('fake-staff-admin-user')?.authorizations).toEqual([
        {
          isAuthorized: isStaffAuthorized,
          paramNames: []
        },
        {
          isAuthorized: isUserAuthorized,
          paramNames: ['groupId', 'userId']
        }
      ])
    })
  })

  BddTest().when('only a callback is declared for a route', () => {
    BddTest().then('the route should be restricted', async () => {
      const isAuthorized = () => true
      const restrictionOf = await resolveWith({
        restrictions: {
          AUTH: {
            LOGIN: {
              isAuthorized
            }
          }
        }
      })
      expect(restrictionOf('fake-auth-login')).toEqual({
        universes: [],
        roles: [],
        authorizations: [{
          isAuthorized,
          paramNames: []
        }]
      })
    })
  })

  BddTest().when('a key matches no route', () => {
    BddTest().then('it should throw, naming the key and where it is', async () => {
      const restrictionOf = await resolveWith({
        restrictions: {
          STAFF: {
            ADMN: {}
          }
        }
      })
      expect(() => restrictionOf('fake-staff-home')).toThrow('Unknown key "ADMN" at ROUTES.STAFF')
    })
  })

  BddTest().when('a criterion is misspelled', () => {
    BddTest().then('it should throw', async () => {
      const restrictionOf = await resolveWith({
        restrictions: {
          STAFF: {
            HOME: {
              role: [ERole.ROLE_ADMIN]
            }
          }
        }
      })
      expect(() => restrictionOf('fake-staff-home')).toThrow('Unknown key "role" at ROUTES.STAFF.HOME')
    })
  })

  BddTest().when('the callback is misspelled', () => {
    BddTest().then('it should throw', async () => {
      const restrictionOf = await resolveWith({
        restrictions: {
          STAFF: {
            HOME: {
              isAuthorised: () => true
            }
          }
        }
      })
      expect(() => restrictionOf('fake-staff-home')).toThrow('Unknown key "isAuthorised" at ROUTES.STAFF.HOME')
    })
  })

  BddTest().when('a group mixes a restriction and children', () => {
    BddTest().then('it should throw', async () => {
      const restrictionOf = await resolveWith({
        restrictions: {
          STAFF: {
            ADMIN: {
              roles: [ERole.ROLE_ADMIN],
              USERS: {}
            }
          }
        }
      })
      expect(() => restrictionOf('fake-staff-home')).toThrow('Unknown key "USERS" at ROUTES.STAFF.ADMIN')
    })
  })

  BddTest().when('`default` is set on a route', () => {
    BddTest().then('it should throw', async () => {
      const restrictionOf = await resolveWith({
        restrictions: {
          STAFF: {
            HOME: {
              default: {}
            }
          }
        }
      })
      expect(() => restrictionOf('fake-staff-home')).toThrow('Unknown key "default" at ROUTES.STAFF.HOME')
    })
  })

  BddTest().when('two routes share a name', () => {
    BddTest().then('it should throw', async () => {
      const restrictionOf = await resolveWith({
        routes: {
          A: {
            name: 'same',
            path: 'a'
          },
          B: {
            name: 'same',
            path: 'b'
          }
        }
      })
      expect(() => restrictionOf('same')).toThrow('Duplicate route name "same" at ROUTES.B')
    })
  })
})
