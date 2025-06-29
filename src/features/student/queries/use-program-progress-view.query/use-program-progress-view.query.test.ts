import type { ProgramProgressOverviewDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { mockedPrograms } from '@/features/student/queries/fixtures'
import { useProgramProgressViewQuery } from '@/features/student/queries/use-program-progress-view.query/use-program-progress-view.query'
import { flushPromises } from '@vue/test-utils'
import { mountQueryComposable } from 'tests/utils'
import { describe, expect, it } from 'vitest'
import { unref } from 'vue'

describe('useStudentCoursesSummaryQuery', () => {
  it('should return mock data with correct structure', async () => {
    const { data } = mountQueryComposable<UseQueryReturnType<ProgramProgressOverviewDTO[], BaseApiException>>(
      () => useProgramProgressViewQuery(),
    )
    await flushPromises()
    const result = unref(data)
    expect(result).toBeDefined()
    expect(result).toHaveLength(2)
    expect(result![0]).toHaveProperty('id')
    expect(result![0]).toHaveProperty('name')
    expect(result![0]).toHaveProperty('skills')
    expect(result).toEqual(mockedPrograms)
  })
})
