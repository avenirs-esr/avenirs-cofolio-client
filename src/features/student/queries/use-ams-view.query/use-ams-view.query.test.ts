import type { AmsViewResponse } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { mockedAmss } from '@/features/student/queries/fixtures'
import { flushPromises } from '@vue/test-utils'
import { mountQueryComposable } from 'tests/utils'
import { describe, expect, it } from 'vitest'
import { unref } from 'vue'
import { useAmsViewQuery } from './use-ams-view.query'

describe('useStudentAmssQuery', () => {
  it('should return mock data with correct structure', async () => {
    const { data } = mountQueryComposable<UseQueryReturnType<AmsViewResponse, BaseApiException>>(
      () => useAmsViewQuery(1, 4),
    )
    await flushPromises()
    const result = unref(data)
    expect(result).toBeDefined()
    expect(result).toHaveProperty('data')
    expect(result).toHaveProperty('page')
    expect(result!.data).toHaveLength(4)
    expect(result!.data?.[0]).toHaveProperty('id')
    expect(result!.data?.[0]).toHaveProperty('title')
    expect(result!.data?.[0]).toHaveProperty('countSkills')
    expect(result!.data?.[0]).toHaveProperty('countTraces')
    expect(result!.data?.[0]).toHaveProperty('status')
    expect(result!.data?.[0]).toHaveProperty('progress')
    expect(result!.data).toEqual(mockedAmss)
    expect(result!.page).toHaveProperty('number')
    expect(result!.page).toHaveProperty('size')
    expect(result!.page).toHaveProperty('totalElements')
    expect(result!.page).toHaveProperty('totalPages')
  })
})
