import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeAll, beforeEach, expect, vi } from 'vitest'
import { ROUTES } from '@/common/constants'

const DELIVERABLES_PATH = '/student/deliverables'
const STUDENT_HOME_ROUTE = { name: 'student-home' }

const { mockEnsureAuthenticated } = vi.hoisted(() => ({
  mockEnsureAuthenticated: vi.fn(),
}))

const mockHasAcceptedLatestCgu = ref(true)

vi.mock('@/features/auth/global/stores/auth.store', () => ({
  useAuthStore: () => ({
    ensureAuthenticated: mockEnsureAuthenticated,
  }),
}))

vi.mock('@/features/auth/global/composables/use-current-user/use-current-user', () => ({
  useCurrentUser: () => ({
    categories: ref([]),
    homeRoute: ref(STUDENT_HOME_ROUTE),
    hasAcceptedLatestCgu: mockHasAcceptedLatestCgu,
  }),
}))

const { default: router } = await import('@/router')

BddTest().given('the application router', () => {
  const getCurrentRoute = () => router.currentRoute.value

  // Always starts on the cgu page, which shares its layout record with the pages under test,
  // then applies the state of the user
  const setupWith = async ({ hasAcceptedLatestCgu = true }: { hasAcceptedLatestCgu?: boolean } = {}) => {
    mockEnsureAuthenticated.mockReset().mockResolvedValue(undefined)
    mockHasAcceptedLatestCgu.value = true
    await router.push({ name: ROUTES.STUDENT.CGU.name })
    await router.isReady()
    mockHasAcceptedLatestCgu.value = hasAcceptedLatestCgu
  }

  beforeAll(() => {
    // vue-router `scrollBehavior` calls it on every navigation, jsdom does not implement it.
    window.scrollTo = vi.fn()
  })

  BddTest().when('the user has accepted the latest cgu version', () => {
    beforeEach(async () => {
      await setupWith()
    })

    BddTest().then('it should let the navigation through inside the student universe', async () => {
      await router.push({ name: ROUTES.STUDENT.DELIVERABLES.name })

      expect(getCurrentRoute().name).toBe(ROUTES.STUDENT.DELIVERABLES.name)
    })
  })

  BddTest().when('the user has not accepted the latest cgu version', () => {
    beforeEach(async () => {
      await setupWith({ hasAcceptedLatestCgu: false })
    })

    BddTest().then('it should redirect to the cgu page while the layout record is reused', async () => {
      await router.push({ name: ROUTES.STUDENT.DELIVERABLES.name })

      expect(getCurrentRoute().name).toBe(ROUTES.STUDENT.CGU.name)
      expect(getCurrentRoute().query).toEqual({ redirect: DELIVERABLES_PATH })
    })

    BddTest().then('it should keep the cgu page reachable without looping', async () => {
      await router.push({ name: ROUTES.STUDENT.CGU.name, query: { redirect: DELIVERABLES_PATH } })

      expect(getCurrentRoute().name).toBe(ROUTES.STUDENT.CGU.name)
    })

    BddTest().then('it should not block the public auth cgu page', async () => {
      await router.push({ name: ROUTES.AUTH.CGU.name })

      expect(getCurrentRoute().name).toBe(ROUTES.AUTH.CGU.name)
    })
  })
})
