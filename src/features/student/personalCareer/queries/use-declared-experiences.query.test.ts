import type { DeclaredExperienceRequest } from '@/api/avenir-esr'
import type { MutationArgs } from '@/types'
import type { Ref } from 'vue'
import {
  createDeclaredExperienceErrorHandler,
  declaredExperienceAssociationsQueryErrorHandler,
  declaredExperienceDetailedQueryErrorHandler,
  declaredExperiencesQueryEmptyHandler,
  declaredExperiencesQueryErrorHandler
} from '@/__mocks__/msw/handlers/student/declaredExperiences.handlers'
import { server } from '@/__mocks__/msw/server'
import { useInvalidateQuery } from '@/common/composables'
import {
  type DeclaredExperienceAssociationsQueryReturnType,
  type DeclaredExperienceDetailedViewQueryReturnType,
  type DeclaredExperiencesViewQueryReturnType,
  useCreateDeclaredExperienceMutation,
  useDeclaredExperienceAssociationsQuery,
  useDeclaredExperienceDetailedViewQuery,
  useDeclaredExperiencesViewQuery
} from '@/features/student/personalCareer/queries/use-declared-experiences.query'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountQueryComposable } from 'tests/utils'
import { beforeEach, expect, type MockedFunction, type MockInstance, vi } from 'vitest'

vi.mock('@/common/composables', async () => {
  return {
    useInvalidateQuery: vi.fn()
  }
})

BddTest().given('a declared experiences view query', () => {
  let queryResult: DeclaredExperiencesViewQueryReturnType
  let page: Ref<number>
  let pageSize: Ref<number>

  beforeEach(() => {
    vi.clearAllMocks()
    page = ref(0)
    pageSize = ref(10)
  })

  BddTest().when('the query is executed with initial parameters', () => {
    beforeEach(async () => {
      queryResult = mountQueryComposable(() => useDeclaredExperiencesViewQuery({ page, pageSize }))
      await vi.waitFor(() => {
        expect(queryResult.isSuccess.value).toBe(true)
      })
    })

    BddTest().then('it should return paginated data', () => {
      expect(queryResult.data.value).toBeDefined()
      expect(queryResult.data.value?.data).toBeDefined()
      expect(queryResult.data.value?.page).toBeDefined()
    })

    BddTest().then('it should have success state', () => {
      expect(queryResult.isSuccess.value).toBe(true)
      expect(queryResult.isError.value).toBe(false)
    })

    BddTest().then('it should compute declaredExperiences array', () => {
      expect(queryResult.declaredExperiences.value).toBeDefined()
      expect(Array.isArray(queryResult.declaredExperiences.value)).toBe(true)
    })

    BddTest().then('it should compute pageInfo object', () => {
      expect(queryResult.pageInfo.value).toBeDefined()
      expect(queryResult.pageInfo.value.page).toBe(0)
      expect(queryResult.pageInfo.value.pageSize).toBeDefined()
      expect(queryResult.pageInfo.value.totalElements).toBeDefined()
      expect(queryResult.pageInfo.value.totalPages).toBeDefined()
    })

    BddTest().then('it should return declared experiences with expected structure', () => {
      const firstExperience = queryResult.declaredExperiences.value[0]
      if (firstExperience) {
        expect(firstExperience).toMatchObject({
          id: expect.any(String),
          title: expect.any(String),
          organization: expect.any(String),
          startDate: expect.any(String)
        })
      }
    })

    BddTest().and('the page parameter changes', () => {
      beforeEach(async () => {
        page.value = 1
        await vi.waitFor(() => {
          expect(queryResult.pageInfo.value.page).toBe(1)
        })
      })

      BddTest().then('it should fetch new page data', () => {
        expect(queryResult.pageInfo.value.page).toBe(1)
      })

      BddTest().then('it should maintain success state', () => {
        expect(queryResult.isSuccess.value).toBe(true)
      })
    })

    BddTest().and('the pageSize parameter changes', () => {
      beforeEach(async () => {
        pageSize.value = 20
        await vi.waitFor(() => {
          expect(queryResult.pageInfo.value.pageSize).toBe(20)
        })
      })

      BddTest().then('it should fetch data with new page size', () => {
        expect(queryResult.pageInfo.value.pageSize).toBe(20)
      })
    })
  })

  BddTest().when('the query fails with server error', () => {
    beforeEach(async () => {
      server.use(declaredExperiencesQueryErrorHandler)
      queryResult = mountQueryComposable(() => useDeclaredExperiencesViewQuery({ page, pageSize }))
      await flushPromises()
    })

    BddTest().then('it should set error state', async () => {
      await vi.waitFor(() => {
        expect(queryResult.isError.value).toBe(true)
      })

      expect(queryResult.isSuccess.value).toBe(false)
      expect(queryResult.error.value).toBeDefined()
    })

    BddTest().then('it should return empty declaredExperiences array', () => {
      expect(queryResult.declaredExperiences.value).toEqual([])
    })

    BddTest().then('it should return default pageInfo', () => {
      expect(queryResult.pageInfo.value).toEqual({
        page: 0,
        pageSize: 0,
        totalElements: 0,
        totalPages: 0
      })
    })
  })

  BddTest().when('the query data is empty', () => {
    beforeEach(async () => {
      server.use(declaredExperiencesQueryEmptyHandler)
      queryResult = mountQueryComposable(() => useDeclaredExperiencesViewQuery({ page, pageSize }))
      await flushPromises()
    })

    BddTest().then('it should return empty array for declaredExperiences', () => {
      expect(queryResult.declaredExperiences.value).toEqual([])
    })

    BddTest().then('it should return default pageInfo with zeros', () => {
      expect(queryResult.pageInfo.value).toEqual({
        page: 0,
        pageSize: 0,
        totalElements: 0,
        totalPages: 0
      })
    })
  })
})

BddTest().given('a declared experience detailed view query', () => {
  let queryResult: DeclaredExperienceDetailedViewQueryReturnType
  const experienceId = ref('exp123')

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the query is executed with initial parameters', () => {
    beforeEach(async () => {
      queryResult = mountQueryComposable(() => useDeclaredExperienceDetailedViewQuery({ experienceId }))
      await vi.waitFor(() => {
        expect(queryResult.isSuccess.value).toBe(true)
      })
    })

    BddTest().then('it should return data with expected structure', () => {
      expect(queryResult.data.value).toBeDefined()
      expect(queryResult.data.value).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        organization: expect.any(String),
        startDate: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
    })

    BddTest().then('it should have success state', () => {
      expect(queryResult.isSuccess.value).toBe(true)
      expect(queryResult.isError.value).toBe(false)
    })
  })

  BddTest().when('the query fails with server error', () => {
    beforeEach(async () => {
      server.use(declaredExperienceDetailedQueryErrorHandler)
      queryResult = mountQueryComposable(() => useDeclaredExperienceDetailedViewQuery({ experienceId }))
      await flushPromises()
    })

    BddTest().then('it should set error state', async () => {
      await vi.waitFor(() => {
        expect(queryResult.isError.value).toBe(true)
      })

      expect(queryResult.isSuccess.value).toBe(false)
      expect(queryResult.error.value).toBeDefined()
    })

    BddTest().then('it should return undefined', () => {
      expect(queryResult.data.value).toBeUndefined()
    })
  })
})

BddTest().given('a useCreateDeclaredExperienceMutation composable', async () => {
  let createDeclaredExperienceSpy: MockInstance<(declaredExperienceRequest: DeclaredExperienceRequest, options?: RequestInit | undefined) => Promise<any>>
  let mutationResult: ReturnType<typeof useCreateDeclaredExperienceMutation>

  const mockUseInvalidateQuery = useInvalidateQuery as MockedFunction<typeof useInvalidateQuery>
  const mockInvalidateFunction = vi.fn()
  const mockOnSuccess = vi.fn()
  const mockOnError = vi.fn()
  const mutationArgs: MutationArgs = {
    onSuccess: mockOnSuccess,
    onError: mockOnError
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.restoreAllMocks()

    createDeclaredExperienceSpy = vi.spyOn<typeof import('@/api/avenir-esr'), 'createDeclaredExperience'>(
      await import('@/api/avenir-esr'),
    'createDeclaredExperience'
    )

    mockUseInvalidateQuery.mockReturnValue(mockInvalidateFunction)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  BddTest().and('a valid experience request and success callback', () => {
    const experienceRequest: DeclaredExperienceRequest = {
      title: 'New Experience',
      organization: 'Test Organization',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      description: 'Test description'
    }

    BddTest().when('the mutation is called with mutateAsync', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useCreateDeclaredExperienceMutation(mutationArgs))
        await mutationResult.mutateAsync(experienceRequest)
        await flushPromises()
      })

      BddTest().then('it should call the createDeclaredExperience API with correct parameters', () => {
        expect(createDeclaredExperienceSpy).toHaveBeenCalledWith(experienceRequest)
        expect(createDeclaredExperienceSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should return the expected success response', () => {
        expect(mutationResult.data.value).toBeDefined()
        expect(mutationResult.data.value).toMatchObject({
          id: expect.any(String),
          title: expect.any(String),
          organization: expect.any(String)
        })
      })

      BddTest().then('it should mark the mutation as successful', () => {
        expect(mutationResult.isSuccess.value).toBe(true)
        expect(mutationResult.isError.value).toBe(false)
        expect(mutationResult.isPending.value).toBe(false)
      })

      BddTest().then('it should call the invalidation function', () => {
        expect(mockUseInvalidateQuery).toHaveBeenCalledTimes(1)
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the custom onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
        expect(mockOnSuccess).toHaveBeenCalledWith(
          expect.objectContaining({
            id: expect.any(String),
            title: expect.any(String)
          }),
          experienceRequest
        )
      })

      BddTest().then('it should not call the onError callback', () => {
        expect(mockOnError).not.toHaveBeenCalled()
      })
    })

    BddTest().when('the mutation is called with mutate', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useCreateDeclaredExperienceMutation(mutationArgs))
        mutationResult.mutate(experienceRequest)
        await flushPromises()
      })

      BddTest().then('it should call the createDeclaredExperience API with correct parameters', () => {
        expect(createDeclaredExperienceSpy).toHaveBeenCalledWith(experienceRequest)
        expect(createDeclaredExperienceSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the custom onSuccess callback', () => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should call the invalidation function', () => {
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(1)
      })
    })
  })

  BddTest().and('no success or error callbacks', () => {
    const experienceRequest: DeclaredExperienceRequest = {
      title: 'New Experience',
      organization: 'Test Organization',
      startDate: '2024-01-01'
    }
    const mutationArgs: MutationArgs = {}

    BddTest().when('the mutation is called without callbacks', () => {
      beforeEach(async () => {
        mutationResult = mountQueryComposable(() => useCreateDeclaredExperienceMutation(mutationArgs))
        await mutationResult.mutateAsync(experienceRequest)
        await flushPromises()
      })

      BddTest().then('it should call the createDeclaredExperience API with correct parameters', () => {
        expect(createDeclaredExperienceSpy).toHaveBeenCalledWith(experienceRequest)
        expect(createDeclaredExperienceSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should still call the invalidation function', () => {
        expect(mockInvalidateFunction).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should mark the mutation as successful', () => {
        expect(mutationResult.isSuccess.value).toBe(true)
        expect(mutationResult.isError.value).toBe(false)
      })

      BddTest().then('it should return the expected response', () => {
        expect(mutationResult.data.value).toBeDefined()
      })
    })
  })

  BddTest().and('an invalid request with error callback', () => {
    const experienceRequest: DeclaredExperienceRequest = {
      title: '',
      organization: '',
      startDate: 'invalid-date'
    }

    BddTest().when('the mutation encounters an error', () => {
      beforeEach(async () => {
        server.use(createDeclaredExperienceErrorHandler)
        mutationResult = mountQueryComposable(() => useCreateDeclaredExperienceMutation(mutationArgs))
        await mutationResult.mutateAsync(experienceRequest).catch(() => {})
        await flushPromises()
      })

      BddTest().then('it should call the createDeclaredExperience API with the invalid request', () => {
        expect(createDeclaredExperienceSpy).toHaveBeenCalledWith(experienceRequest)
        expect(createDeclaredExperienceSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should mark the mutation as error', () => {
        expect(mutationResult.isError.value).toBe(true)
        expect(mutationResult.isSuccess.value).toBe(false)
        expect(mutationResult.isPending.value).toBe(false)
      })

      BddTest().then('it should contain the error information', () => {
        expect(mutationResult.error.value).toBeDefined()
      })

      BddTest().then('it should call the custom onError callback', () => {
        expect(mockOnError).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should not call the onSuccess callback', () => {
        expect(mockOnSuccess).not.toHaveBeenCalled()
      })

      BddTest().then('it should not call the invalidation function on error', () => {
        expect(mockInvalidateFunction).not.toHaveBeenCalled()
      })
    })

    BddTest().when('the mutation is called using mutate with error', () => {
      beforeEach(async () => {
        server.use(createDeclaredExperienceErrorHandler)
        mutationResult = mountQueryComposable(() => useCreateDeclaredExperienceMutation(mutationArgs))
        mutationResult.mutate(experienceRequest)
        await flushPromises()
      })

      BddTest().then('it should call the createDeclaredExperience API with the invalid request', () => {
        expect(createDeclaredExperienceSpy).toHaveBeenCalledWith(experienceRequest)
        expect(createDeclaredExperienceSpy).toHaveBeenCalledTimes(1)
      })

      BddTest().then('it should contain the error information', () => {
        expect(mutationResult.error.value).toBeDefined()
        expect(mutationResult.isError.value).toBe(true)
      })

      BddTest().then('it should call the custom onError callback', () => {
        expect(mockOnError).toHaveBeenCalledTimes(1)
      })
    })
  })
})

BddTest().given('a declared experience associations query', () => {
  let queryResult: DeclaredExperienceAssociationsQueryReturnType
  let experienceId: Ref<string>

  beforeEach(() => {
    vi.clearAllMocks()
    experienceId = ref('exp123')
  })

  BddTest().when('the query is executed with initial parameters', () => {
    beforeEach(async () => {
      queryResult = mountQueryComposable(() => useDeclaredExperienceAssociationsQuery({ experienceId }))
      await vi.waitFor(() => {
        expect(queryResult.isSuccess.value).toBe(true)
      })
    })

    BddTest().then('it should return data with expected structure', () => {
      expect(queryResult.data.value).toBeDefined()
      expect(queryResult.data.value).toMatchObject({
        traceAssociations: expect.any(Array)
      })
    })

    BddTest().then('it should have success state', () => {
      expect(queryResult.isSuccess.value).toBe(true)
      expect(queryResult.isError.value).toBe(false)
    })

    BddTest().then('it should compute traceAssociations', () => {
      expect(queryResult.traceAssociations.value).toBeDefined()
      expect(Array.isArray(queryResult.traceAssociations.value)).toBe(true)
      expect(queryResult.traceAssociations.value.length).toBeGreaterThan(0)
    })

    BddTest().then('it should return trace associations with expected structure', () => {
      const firstAssociation = queryResult.traceAssociations.value[0]

      expect(firstAssociation).toMatchObject({
        associationId: expect.any(String),
        trace: {
          traceId: expect.any(String),
          title: expect.any(String),
          skillCount: expect.any(Number),
          AMSCount: expect.any(Number),
          programName: expect.any(String),
          isGroup: expect.any(Boolean),
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        }
      })
    })
  })

  BddTest().when('the query fails with server error', () => {
    beforeEach(async () => {
      server.use(declaredExperienceAssociationsQueryErrorHandler)
      queryResult = mountQueryComposable(() => useDeclaredExperienceAssociationsQuery({ experienceId }))
      await flushPromises()
    })

    BddTest().then('it should set error state', async () => {
      await vi.waitFor(() => {
        expect(queryResult.isError.value).toBe(true)
      })

      expect(queryResult.isSuccess.value).toBe(false)
      expect(queryResult.error.value).toBeDefined()
    })

    BddTest().then('it should return undefined data', () => {
      expect(queryResult.data.value).toBeUndefined()
    })

    BddTest().then('it should return empty traceAssociations', () => {
      expect(queryResult.traceAssociations.value).toEqual([])
    })
  })

  BddTest().when('the query returns empty associations', () => {
    beforeEach(async () => {
      experienceId.value = 'EXP_WITHOUT_ASSOCIATIONS'
      queryResult = mountQueryComposable(() => useDeclaredExperienceAssociationsQuery({ experienceId }))
      await vi.waitFor(() => {
        expect(queryResult.isSuccess.value).toBe(true)
      })
    })

    BddTest().then('it should return an empty traceAssociations array', () => {
      expect(queryResult.traceAssociations.value).toEqual([])
    })

    BddTest().then('it should return the expected empty data structure', () => {
      expect(queryResult.data.value).toEqual({
        traceAssociations: []
      })
    })

    BddTest().then('it should keep success state', () => {
      expect(queryResult.isSuccess.value).toBe(true)
      expect(queryResult.isError.value).toBe(false)
    })
  })

  BddTest().when('the query is executed with an invalid experience id', () => {
    beforeEach(async () => {
      experienceId.value = 'INVALID_SKILL_ID'
      queryResult = mountQueryComposable(() => useDeclaredExperienceAssociationsQuery({ experienceId }))
      await flushPromises()
    })

    BddTest().then('it should set error state', async () => {
      await vi.waitFor(() => {
        expect(queryResult.isError.value).toBe(true)
      })

      expect(queryResult.isSuccess.value).toBe(false)
      expect(queryResult.error.value).toBeDefined()
    })

    BddTest().then('it should return undefined data', () => {
      expect(queryResult.data.value).toBeUndefined()
    })

    BddTest().then('it should return empty traceAssociations', () => {
      expect(queryResult.traceAssociations.value).toEqual([])
    })
  })
})
