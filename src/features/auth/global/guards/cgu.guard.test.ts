import type { RouteLocationNormalized } from 'vue-router'
import { ROUTES } from '@/common/constants'
import { resolveCguRedirect } from '@/features/auth/global/guards/cgu.guard'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { expect } from 'vitest'

function studentRoute (name: string, fullPath: string) {
  return {
    name,
    fullPath,
    meta: { cguRouteName: ROUTES.STUDENT.CGU.name },
  } as unknown as RouteLocationNormalized
}

BddTest().given('the cgu redirect resolver', () => {
  BddTest().when('the target route belongs to a universe requiring the cgu acceptance', () => {
    BddTest().then('it should let the navigation through for a user who accepted the latest version', () => {
      const to = studentRoute(ROUTES.STUDENT.DELIVERABLES.name, '/student/deliverables')

      expect(resolveCguRedirect(to, true)).toBeUndefined()
    })

    BddTest().then('it should redirect to the cgu page keeping the intended destination', () => {
      const to = studentRoute(ROUTES.STUDENT.DELIVERABLES.name, '/student/deliverables')

      expect(resolveCguRedirect(to, false)).toEqual({
        name: ROUTES.STUDENT.CGU.name,
        query: { redirect: '/student/deliverables' },
      })
    })

    BddTest().then('it should let the cgu page itself through to avoid an infinite redirect loop', () => {
      const to = studentRoute(ROUTES.STUDENT.CGU.name, '/student/cgu')

      expect(resolveCguRedirect(to, false)).toBeUndefined()
    })
  })

  BddTest().when('the target route belongs to a universe of its own', () => {
    BddTest().then('it should redirect to the cgu page of that universe', () => {
      const to = {
        name: ROUTES.STAFF.HOME.name,
        fullPath: '/staff',
        meta: { cguRouteName: ROUTES.STAFF.CGU.name },
      } as unknown as RouteLocationNormalized

      expect(resolveCguRedirect(to, false)).toEqual({
        name: ROUTES.STAFF.CGU.name,
        query: { redirect: '/staff' },
      })
    })
  })

  BddTest().when('the target route declares no cgu route', () => {
    BddTest().then('it should let the navigation through even without acceptance', () => {
      const to = {
        name: ROUTES.AUTH.CGU.name,
        fullPath: '/auth/cgu',
        meta: {},
      } as unknown as RouteLocationNormalized

      expect(resolveCguRedirect(to, false)).toBeUndefined()
    })
  })
})
