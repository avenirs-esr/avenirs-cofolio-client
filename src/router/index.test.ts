import { ROUTES } from '@/common/constants'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeAll, beforeEach, expect, vi } from 'vitest'

const { mockAuthStore } = vi.hoisted(() => ({
  mockAuthStore: {
    hasAcceptedLatestCgu: true,
    categories: [],
    homeRoute: { name: 'student-home' },
    ensureAuthenticated: vi.fn(),
  },
}))

vi.mock('@/features/auth/global/stores/auth.store', () => ({
  useAuthStore: () => mockAuthStore,
}))

const { default: router } = await import('@/router')

BddTest().given('the application router', () => {
  beforeAll(() => {
    // vue-router `scrollBehavior` calls it on every navigation, jsdom does not implement it.
    window.scrollTo = vi.fn()
  })

  beforeEach(async () => {
    mockAuthStore.hasAcceptedLatestCgu = true
    mockAuthStore.ensureAuthenticated.mockReset().mockResolvedValue(undefined)
    await router.push({ name: ROUTES.STUDENT.CGU.name })
    await router.isReady()
  })

  BddTest().when('the user has accepted the latest cgu version', () => {
    BddTest().then('it should let the navigation through inside the student universe', async () => {
      await router.push({ name: ROUTES.STUDENT.DELIVERABLES.name })

      expect(router.currentRoute.value.name).toBe(ROUTES.STUDENT.DELIVERABLES.name)
    })
  })

  BddTest().when('the user has not accepted the latest cgu version', () => {
    beforeEach(() => {
      mockAuthStore.hasAcceptedLatestCgu = false
    })

    BddTest().then('it should redirect to the cgu page while the layout record is reused', async () => {
      await router.push({ name: ROUTES.STUDENT.DELIVERABLES.name })

      expect(router.currentRoute.value.name).toBe(ROUTES.STUDENT.CGU.name)
      expect(router.currentRoute.value.query).toEqual({ redirect: '/student/deliverables' })
    })

    BddTest().then('it should keep the cgu page reachable without looping', async () => {
      await router.push({ name: ROUTES.STUDENT.CGU.name, query: { redirect: '/student/deliverables' } })

      expect(router.currentRoute.value.name).toBe(ROUTES.STUDENT.CGU.name)
    })

    BddTest().then('it should not block the public auth cgu page', async () => {
      await router.push({ name: ROUTES.AUTH.CGU.name })

      expect(router.currentRoute.value.name).toBe(ROUTES.AUTH.CGU.name)
    })
  })
})
