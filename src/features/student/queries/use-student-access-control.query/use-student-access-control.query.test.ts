import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { getStudentNavigationAccess, type NavigationAccessDTO } from '@/api/avenir-esr'
import { useStudentNavigationAccessControlQuery } from '@/features/student/queries'
import { mountQueryComposable } from '@/ui/tests/utils'
import { flushPromises } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { expect } from 'vitest'
import { unref } from 'vue'

vi.mock('@/api/avenir-esr')

BddTest().given('a useStudentNavigationAccessControlQuery composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  const mockedGetStudentNavigationAccess = vi.mocked(getStudentNavigationAccess)

  BddTest().when('the composable is called', () => {
    BddTest().then('it should return mock data with correct structure', async () => {
      mockedGetStudentNavigationAccess.mockResolvedValue({
        APC: {
          enabledByInstitution: true,
          hasProgram: true
        },
        LIFE_PROJECT: {
          enabledByInstitution: true
        }
      })
      const { data } = mountQueryComposable<UseQueryReturnType<NavigationAccessDTO, BaseApiException>>(
        () => useStudentNavigationAccessControlQuery(),
      )
      await flushPromises()
      const result = unref(data)
      expect(result).toBeDefined()
      expect(result).toHaveProperty('APC')
      expect(result).toHaveProperty('LIFE_PROJECT')
      expect(result).toBeDefined()
      expect(result?.APC).toEqual({
        enabledByInstitution: true,
        hasProgram: true
      })
      expect(result?.LIFE_PROJECT).toEqual({
        enabledByInstitution: true
      })
    })
  })
})
