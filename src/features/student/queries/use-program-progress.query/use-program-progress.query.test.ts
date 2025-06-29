import type { ProgramProgressDTO, ProgramProgressOverviewDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { mockedPrograms } from '@/features/student/queries/fixtures'
import { useAllMyProgramProgressQuery, useProgramProgressViewQuery } from '@/features/student/queries/use-program-progress.query/use-program-progress.query'
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

describe('useAllMyProgramProgressQuery', () => {
  describe('given the useAllMyProgramProgressQuery composable is called', () => {
    describe('when the query is executed', () => {
      it('then it should return mock data with correct structure', async () => {
        const { data } = mountQueryComposable<UseQueryReturnType<ProgramProgressDTO[], BaseApiException>>(
          () => useAllMyProgramProgressQuery(),
        )

        await flushPromises()
        const result = unref(data)

        expect(result).toBeDefined()
        expect(result).toHaveLength(2)
        expect(result![0]).toHaveProperty('id')
        expect(result![0]).toHaveProperty('name')

        const expectedResult = mockedPrograms.slice(0, 2).map(program => ({
          id: program.id,
          name: program.name,
        }))
        expect(result).toEqual(expectedResult)
      })
    })

    describe('when the query key is computed', () => {
      it('then it should include the correct query key structure', async () => {
        const queryComposable = mountQueryComposable<UseQueryReturnType<ProgramProgressDTO[], BaseApiException>>(
          () => useAllMyProgramProgressQuery(),
        )
        await flushPromises()
        expect(queryComposable.data.value).toBeDefined()
      })
    })

    describe('when checking the returned data properties', () => {
      it('then each program progress item should have required properties', async () => {
        const { data } = mountQueryComposable<UseQueryReturnType<ProgramProgressDTO[], BaseApiException>>(
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
        const { data } = mountQueryComposable<UseQueryReturnType<ProgramProgressDTO[], BaseApiException>>(
          () => useAllMyProgramProgressQuery(),
        )

        await flushPromises()
        const result = unref(data)

        expect(result).toBeDefined()
        expect(result).toHaveLength(2)

        result!.forEach((programProgress, index) => {
          const originalProgram = mockedPrograms[index]
          expect(programProgress.id).toBe(originalProgram.id)
          expect(programProgress.name).toBe(originalProgram.name)
          expect(programProgress).not.toHaveProperty('skills')
        })
      })
    })
  })
})
