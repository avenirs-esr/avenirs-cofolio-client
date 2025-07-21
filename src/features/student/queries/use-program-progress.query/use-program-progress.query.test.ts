import type { StudentProgressOverviewDTO, TrainingPathDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { mockedAllMyProgramsProgress, mockedProgramsProgressView } from '@/__mocks__/fixtures/student'
import { useAllMyProgramProgressQuery, useProgramProgressViewQuery } from '@/features/student/queries/use-program-progress.query/use-program-progress.query'
import { mountQueryComposable } from '@/ui/tests/utils'
import { flushPromises } from '@vue/test-utils'
import { waitFor } from 'storybook/test'
import { describe, expect, it } from 'vitest'
import { unref } from 'vue'

describe('useStudentCoursesSummaryQuery', () => {
  it('should return mock data with correct structure', async () => {
    const { data } = mountQueryComposable<UseQueryReturnType<StudentProgressOverviewDTO[], BaseApiException>>(
      () => useProgramProgressViewQuery(),
    )
    await flushPromises()
    const result = unref(data)
    await waitFor(() => {
      expect(result).toBeDefined()
    })
    expect(result).toHaveLength(2)
    expect(result![0]).toHaveProperty('id')
    expect(result![0]).toHaveProperty('name')
    expect(result![0]).toHaveProperty('skills')
    expect(result).toEqual(mockedProgramsProgressView)
  })
})

describe('useAllMyProgramProgressQuery', () => {
  describe('given the useAllMyProgramProgressQuery composable is called', () => {
    describe('when the query is executed', () => {
      it('then it should return mock data with correct structure', async () => {
        const { data } = mountQueryComposable<UseQueryReturnType<TrainingPathDTO[], BaseApiException>>(
          () => useAllMyProgramProgressQuery(),
        )

        await flushPromises()
        const result = unref(data)

        expect(result).toBeDefined()
        expect(result).toHaveLength(2)
        expect(result![0]).toHaveProperty('id')
        expect(result![0]).toHaveProperty('name')

        const expectedResult = mockedAllMyProgramsProgress
        expect(result).toEqual(expectedResult)
      })
    })

    describe('when the query key is computed', () => {
      it('then it should include the correct query key structure', async () => {
        const queryComposable = mountQueryComposable<UseQueryReturnType<TrainingPathDTO[], BaseApiException>>(
          () => useAllMyProgramProgressQuery(),
        )
        await flushPromises()
        expect(queryComposable.data.value).toBeDefined()
      })
    })

    describe('when checking the returned data properties', () => {
      it('then each program progress item should have required properties', async () => {
        const { data } = mountQueryComposable<UseQueryReturnType<TrainingPathDTO[], BaseApiException>>(
          () => useAllMyProgramProgressQuery(),
        )
        await flushPromises()
        const result = unref(data)
        expect(result).toBeDefined()
        result!.forEach((programProgress) => {
          expect(programProgress).toHaveProperty('id')
          expect(programProgress).toHaveProperty('name')
          expect(typeof programProgress.id).toBe('string')
          expect(typeof programProgress.name).toBe('string')
        })
      })
    })

    describe('when verifying the mock data mapping', () => {
      it('then it should only return id and name properties from the original mocked programs', async () => {
        const { data } = mountQueryComposable<UseQueryReturnType<TrainingPathDTO[], BaseApiException>>(
          () => useAllMyProgramProgressQuery(),
        )

        await flushPromises()
        const result = unref(data)

        expect(result).toBeDefined()
        expect(result).toHaveLength(2)

        result!.forEach((programProgress, index) => {
          const originalProgram = mockedProgramsProgressView[index]
          expect(programProgress.id).toBe(originalProgram.id)
          expect(programProgress.name).toBe(originalProgram.name)
          expect(programProgress).not.toHaveProperty('skills')
        })
      })
    })
  })
})
