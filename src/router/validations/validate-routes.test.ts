import type { RouteRecordRaw } from 'vue-router'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { expect } from 'vitest'
import { EUserCategory } from '@/api/avenir-esr'
import { validateRoutes } from '@/router/validations/validate-routes'

const component = { render: () => null }

BddTest().given('a route table', () => {
  BddTest().when('every route is public or restricted to roles', () => {
    const routes: RouteRecordRaw[] = [
      { path: '/login', name: 'login', component, meta: { public: true } },
      { path: '/student', name: 'student', component, meta: { roles: [EUserCategory.STUDENT] } },
    ]

    BddTest().then('it should not throw', () => {
      expect(() => validateRoutes(routes)).not.toThrow()
    })
  })

  BddTest().when('routes without roles are listed by name as open to every authenticated user', () => {
    const routes: RouteRecordRaw[] = [
      { path: '/', name: 'home', component },
      { path: '/:pathMatch(.*)*', name: 'NotFound', component },
      { path: '/student', name: 'student', component, meta: { roles: [EUserCategory.STUDENT] } },
    ]

    BddTest().then('it should not throw', () => {
      expect(() => validateRoutes(routes, 'home', 'NotFound')).not.toThrow()
    })
  })

  BddTest().when('a route without roles is not listed while another one is', () => {
    const routes: RouteRecordRaw[] = [
      { path: '/', name: 'home', component },
      { path: '/forgotten', name: 'forgotten', component },
    ]

    BddTest().then('it should only exempt the listed one', () => {
      expect(() => validateRoutes(routes, 'home')).toThrow(/forgotten/)
      expect(() => validateRoutes(routes, 'home')).not.toThrow(/home/)
    })
  })

  BddTest().when('the roles are declared on a layout record and not on its children', () => {
    const routes: RouteRecordRaw[] = [{
      path: '/student',
      component,
      meta: { roles: [EUserCategory.STUDENT] },
      children: [
        { path: 'deliverables', name: 'deliverables', component },
        { path: 'events', name: 'events', component, meta: { title: 'Events' } },
      ],
    }]

    BddTest().then('it should consider the children as covered, like vue-router merges their meta', () => {
      expect(() => validateRoutes(routes)).not.toThrow()
    })
  })

  BddTest().when('a layout record is public', () => {
    const routes: RouteRecordRaw[] = [{
      path: '/auth',
      component,
      meta: { public: true },
      children: [{ path: 'login', name: 'login', component }],
    }]

    BddTest().then('it should consider the children as public', () => {
      expect(() => validateRoutes(routes)).not.toThrow()
    })
  })

  BddTest().when('a layout record has no meta but each child declares its roles', () => {
    const routes: RouteRecordRaw[] = [{
      path: '/',
      component,
      children: [
        { path: 'student', name: 'student', component, meta: { roles: [EUserCategory.STUDENT] } },
        { path: 'staff', name: 'staff', component, meta: { roles: [EUserCategory.STAFF] } },
      ],
    }]

    BddTest().then('it should not check the layout itself', () => {
      expect(() => validateRoutes(routes)).not.toThrow()
    })
  })

  BddTest().when('a route is a redirection', () => {
    const routes: RouteRecordRaw[] = [{ path: '/old', redirect: '/new' }]

    BddTest().then('it should ignore it, since the guards only see its target', () => {
      expect(() => validateRoutes(routes)).not.toThrow()
    })
  })

  BddTest().when('a route is neither public, restricted to roles nor listed', () => {
    const routes: RouteRecordRaw[] = [
      { path: '/student', name: 'student', component, meta: { roles: [EUserCategory.STUDENT] } },
      { path: '/forgotten', name: 'forgotten', component },
    ]

    BddTest().then('it should throw an error naming the route', () => {
      expect(() => validateRoutes(routes)).toThrow(/forgotten/)
    })

    BddTest().then('it should tell how to fix it', () => {
      expect(() => validateRoutes(routes)).toThrow(/meta\.public or meta\.roles/)
      expect(() => validateRoutes(routes)).toThrow(/validateRoutes\(\)/)
    })
  })

  BddTest().when('a route without a name is in that case', () => {
    const routes: RouteRecordRaw[] = [{ path: '/anonymous', component }]

    BddTest().then('it should be reported by its path', () => {
      expect(() => validateRoutes(routes)).toThrow(/\/anonymous/)
    })
  })

  BddTest().when('a route declares an empty list of roles', () => {
    const routes: RouteRecordRaw[] = [{ path: '/empty', name: 'empty', component, meta: { roles: [] } }]

    BddTest().then('it should throw, as an empty list restricts nothing', () => {
      expect(() => validateRoutes(routes)).toThrow(/empty/)
    })
  })

  BddTest().when('a child of a layout record has no roles to inherit', () => {
    const routes: RouteRecordRaw[] = [{
      path: '/layout',
      name: 'layout',
      component,
      children: [{ path: 'page', name: 'page', component }],
    }]

    BddTest().then('it should name the child and not the layout', () => {
      expect(() => validateRoutes(routes)).toThrow(/page/)
      expect(() => validateRoutes(routes)).not.toThrow(/layout/)
    })

    BddTest().then('it should not exempt the child when the layout is listed', () => {
      expect(() => validateRoutes(routes, 'layout')).toThrow(/page/)
    })
  })

  BddTest().when('several routes are in that case', () => {
    const routes: RouteRecordRaw[] = [
      { path: '/first', name: 'first', component },
      { path: '/second', name: 'second', component },
    ]

    BddTest().then('it should list all of them in a single error', () => {
      expect(() => validateRoutes(routes)).toThrow(/2 route\(s\).*first, second/)
    })
  })
})
