import { useStudentApcAccess } from '@/features/student/composables'
import { studentHomeRoute } from '@/features/student/routes'
import StudentApcUnavailableView from '@/features/student/views/StudentApcUnavailableView/StudentApcUnavailableView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountWithRouter } from 'tests/utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { type Router, useRouter } from 'vue-router'

vi.mock('vue-router', async () => {
  const actual = await vi.importActual<typeof import('vue-router')>('vue-router')
  return {
    ...actual,
    useRouter: vi.fn()
  }
})

vi.mock('@/features/student/composables', () => ({
  useStudentApcAccess: vi.fn()
}))

BddTest().given('a student APC unavailable page', () => {
  const replaceMock = vi.fn()
  const mockedUseStudentApcAccess = vi.mocked(useStudentApcAccess)
  const mockedUseRouter = vi.mocked(useRouter)

  beforeEach(() => {
    mockedUseRouter.mockReturnValue({ replace: replaceMock } as unknown as Router)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('arriving on the page', () => {
    BddTest().and('showApcGenericInfoPage is true', () => {
      BddTest().then('it should not redirect', async () => {
        mockedUseStudentApcAccess.mockReturnValue({
          showApcGenericInfoPage: computed(() => true),
          showApcSubmenus: computed(() => false),
          isApcVisible: computed(() => false)
        })
        await mountWithRouter(StudentApcUnavailableView)
        expect(replaceMock).not.toHaveBeenCalled()
      })
    })

    BddTest().and('showApcGenericInfoPage is false', () => {
      BddTest().then('it should redirect', async () => {
        mockedUseStudentApcAccess.mockReturnValue({
          showApcGenericInfoPage: computed(() => false),
          showApcSubmenus: computed(() => false),
          isApcVisible: computed(() => false)
        })
        await mountWithRouter(StudentApcUnavailableView)
        expect(replaceMock).toHaveBeenCalledWith(
          expect.objectContaining({ name: studentHomeRoute.name })
        )
      })
    })
  })
})
