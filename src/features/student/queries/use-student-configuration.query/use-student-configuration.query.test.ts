import type { TraceConfigurationInfo } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { flushPromises } from '@vue/test-utils'
import { mountQueryComposable } from 'tests/utils'
import { describe, expect, it } from 'vitest'
import { unref } from 'vue'
import { useStudentTracesConfigurationQuery } from './use-student-configuration.query'

describe('useStudentConfigurationQuery', () => {
  it('should return maxDayBeforeDeletion for traces config with correct structure', async () => {
    const { data } = mountQueryComposable<UseQueryReturnType<TraceConfigurationInfo, BaseApiException>>(
      () => useStudentTracesConfigurationQuery(),
    )
    await flushPromises()
    const result = unref(data)
    expect(result).toBeDefined()
    expect(result).toHaveProperty('maxDayRemaining')
    expect(result).toHaveProperty('maxDayRemainingWarning')
    expect(result).toHaveProperty('maxDayRemainingCritical')
  })
})
