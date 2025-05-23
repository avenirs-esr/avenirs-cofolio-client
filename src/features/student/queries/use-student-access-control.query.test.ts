import type { BaseApiException } from '@/common/exceptions'
import type { StudentNavigationAccessControlDTO } from '@/types'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { useStudentNavigationAccessControlQuery } from '@/features/student/queries'
import { flushPromises } from '@vue/test-utils'
import { mountQueryComposable } from 'tests/utils'
import { describe, expect, it } from 'vitest'
import { unref } from 'vue'

describe('useStudentNavigationAccessControlQuery', () => {
  it('should return mock data with correct structure', async () => {
    const { data } = mountQueryComposable<UseQueryReturnType<StudentNavigationAccessControlDTO, BaseApiException>>(
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
