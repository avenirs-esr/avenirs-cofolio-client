import { useStudentApcAccess } from '@/features/student/composables'
import { studentHomeRoute } from '@/features/student/routes'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { type Router, useRouter } from 'vue-router'
import StudentApcUnavailableView from './StudentApcUnavailableView.vue'

vi.mock('vue-router', () => ({
  useRouter: vi.fn()
}))

vi.mock('@/features/student/composables', () => ({
  useStudentApcAccess: vi.fn()
}))

describe('studentApcUnavailablePage', () => {
  const replaceMock = vi.fn()
  const mockedUseStudentApcAccess = vi.mocked(useStudentApcAccess)
  const mockedUseRouter = vi.mocked(useRouter)

  beforeEach(() => {
    mockedUseRouter.mockReturnValue({ replace: replaceMock } as unknown as Router)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should not redirect if showApcGenericInfoPage is true', async () => {
    mockedUseStudentApcAccess.mockReturnValue({
      showApcGenericInfoPage: computed(() => true),
      showApcSubmenus: computed(() => false),
      isApcVisible: computed(() => false)
    })
    mount(StudentApcUnavailableView)
    expect(replaceMock).not.toHaveBeenCalled()
  })

  it('should redirect if showApcGenericInfoPage is false', async () => {
    mockedUseStudentApcAccess.mockReturnValue({
      showApcGenericInfoPage: computed(() => false),
      showApcSubmenus: computed(() => false),
      isApcVisible: computed(() => false)
    })
    mount(StudentApcUnavailableView)
    expect(replaceMock).toHaveBeenCalledWith(
      expect.objectContaining({ name: studentHomeRoute.name })
    )
  })
})
