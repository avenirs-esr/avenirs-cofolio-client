import type { BaseApiException } from '@/common/exceptions'
import type { AmsViewResponse } from '@/types'
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
    expect(result).toHaveProperty('content')
    expect(result).toHaveProperty('pagination')
    expect(result!.content).toHaveLength(4)
    expect(result!.content[0]).toHaveProperty('id')
    expect(result!.content[0]).toHaveProperty('title')
    expect(result!.content[0]).toHaveProperty('countSkills')
    expect(result!.content[0]).toHaveProperty('countTraces')
    expect(result!.content[0]).toHaveProperty('status')
    expect(result!.content[0]).toHaveProperty('progress')
    expect(result!.content).toEqual(mockedAmss)
    expect(result!.pagination).toHaveProperty('page')
    expect(result!.pagination).toHaveProperty('pageSize')
    expect(result!.pagination).toHaveProperty('count')
    expect(result!.pagination).toHaveProperty('totalPages')
  })
})
