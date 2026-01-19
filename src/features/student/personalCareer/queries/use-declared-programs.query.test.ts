import type { DeclaredProgramRequestDTO } from '@/api/avenir-esr'
import type { Ref } from 'vue'
import { declaredProgramViewDTOFixture } from '@/__mocks__/fixtures/student'
import {
  createDeclaredProgramErrorHandler,
  declaredProgramDetailedErrorHandler,
  declaredProgramDetailedHandler,
  declaredProgramsQueryErrorHandler
} from '@/__mocks__/msw/handlers/student/declaredPrograms.handlers'
import { server } from '@/__mocks__/msw/server'
import {
  type DeclaredProgramsViewQueryReturnType,
  useCreateDeclaredProgramMutation,
  useDeclaredProgramDetailedQuery,
  useDeclaredProgramsViewQuery
} from '@/features/student/personalCareer/queries/use-declared-programs.query'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComposable, mountQueryComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a declared programs view query', () => {
  let queryResult: DeclaredProgramsViewQueryReturnType
  let page: Ref<number>
  let pageSize: Ref<number>

  beforeEach(() => {
    vi.clearAllMocks()
    page = ref(0)
    pageSize = ref(10)
  })

  BddTest().when('the query is executed with initial parameters', () => {
    beforeEach(async () => {
      queryResult = mountQueryComposable(() => useDeclaredProgramsViewQuery({ page, pageSize }))
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

    BddTest().then('it should compute declaredPrograms array', () => {
      expect(queryResult.declaredPrograms.value).toBeDefined()
      expect(Array.isArray(queryResult.declaredPrograms.value)).toBe(true)
    })

    BddTest().then('it should compute pageInfo object', () => {
      expect(queryResult.pageInfo.value).toBeDefined()
      expect(queryResult.pageInfo.value.page).toBe(0)
      expect(queryResult.pageInfo.value.pageSize).toBeDefined()
      expect(queryResult.pageInfo.value.totalElements).toBeDefined()
      expect(queryResult.pageInfo.value.totalPages).toBeDefined()
    })

    BddTest().then('it should return declared programs with expected structure', () => {
      const firstProgram = queryResult.declaredPrograms.value[0]
      if (firstProgram) {
        expect(firstProgram).toMatchObject({
          id: expect.any(String),
          title: expect.any(String)
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
      server.use(declaredProgramsQueryErrorHandler)
      queryResult = mountQueryComposable(() => useDeclaredProgramsViewQuery({ page, pageSize }))
      await flushPromises()
    })

    BddTest().then('it should set error state', async () => {
      await vi.waitFor(() => {
        expect(queryResult.isError.value).toBe(true)
      })

      expect(queryResult.isSuccess.value).toBe(false)
      expect(queryResult.error.value).toBeDefined()
    })

    BddTest().then('it should return empty declaredPrograms array', () => {
      expect(queryResult.declaredPrograms.value).toEqual([])
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

  BddTest().when('the query data is undefined', () => {
    beforeEach(() => {
      queryResult = mountQueryComposable(() => useDeclaredProgramsViewQuery({ page, pageSize }))
    })

    BddTest().then('it should return empty array for declaredPrograms', () => {
      expect(queryResult.declaredPrograms.value).toEqual([])
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

BddTest().given('a create declared program mutation', () => {
  let composableResult: ReturnType<typeof useCreateDeclaredProgramMutation>
  let mockOnSuccess: ReturnType<typeof vi.fn>
  let mockOnError: ReturnType<typeof vi.fn>

  const declaredProgramRequestDTO: DeclaredProgramRequestDTO = {
    title: 'Master en Informatique',
    description: 'Formation approfondie en développement logiciel et intelligence artificielle',
    organization: 'Université Paris-Saclay',
    result: 'Mention Très Bien',
    sourceOfInformation: 'Site web de l\'université',
    link: 'https://www.universite-paris-saclay.fr/master-informatique',
    startDate: '2023-09',
    endDate: '2025-06'
  }

  BddTest().when('the mutation is initialized without callbacks', () => {
    beforeEach(() => {
      const result = mountComposable(() => useCreateDeclaredProgramMutation(), {
        useTanstack: true
      })
      composableResult = result.result
    })

    BddTest().then('it should return a mutation object', () => {
      expect(composableResult).toBeDefined()
      expect(composableResult.mutate).toBeDefined()
      expect(composableResult.mutateAsync).toBeDefined()
    })

    BddTest().then('it should start in idle state', () => {
      expect(composableResult.isPending.value).toBe(false)
      expect(composableResult.isSuccess.value).toBe(false)
      expect(composableResult.isError.value).toBe(false)
    })

    BddTest().then('it should have undefined data initially', () => {
      expect(composableResult.data.value).toBeUndefined()
    })
  })

  BddTest().when('the mutation is initialized with callbacks', () => {
    beforeEach(() => {
      mockOnSuccess = vi.fn()
      mockOnError = vi.fn()

      const result = mountComposable(
        () => useCreateDeclaredProgramMutation({
          onSuccess: mockOnSuccess,
          onError: mockOnError
        }),
        {
          useTanstack: true
        }
      )
      composableResult = result.result
    })

    BddTest().then('it should accept onSuccess and onError callbacks', () => {
      expect(composableResult).toBeDefined()
      expect(mockOnSuccess).toBeDefined()
      expect(mockOnError).toBeDefined()
    })
  })

  BddTest().when('creating a declared program with valid data', () => {
    beforeEach(() => {
      mockOnSuccess = vi.fn()

      const result = mountComposable(
        () => useCreateDeclaredProgramMutation({
          onSuccess: mockOnSuccess
        }),
        {
          useTanstack: true
        }
      )
      composableResult = result.result
    })

    BddTest().then('it should successfully create the declared program', async () => {
      composableResult.mutate(declaredProgramRequestDTO)

      await vi.waitFor(() => {
        expect(composableResult.isSuccess.value).toBe(true)
      })

      expect(composableResult.data.value).toEqual(declaredProgramViewDTOFixture)
      expect(composableResult.isError.value).toBe(false)
    })

    BddTest().then('it should call onSuccess callback with correct data', async () => {
      composableResult.mutate(declaredProgramRequestDTO)

      await vi.waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      })

      expect(mockOnSuccess).toHaveBeenCalledWith(
        declaredProgramViewDTOFixture,
        declaredProgramRequestDTO
      )
    })

    BddTest().and('resetting the mutation after success', () => {
      BddTest().then('it should clear mutation state', async () => {
        composableResult.mutate(declaredProgramRequestDTO)

        await vi.waitFor(() => {
          expect(composableResult.isSuccess.value).toBe(true)
        })

        composableResult.reset()

        expect(composableResult.data.value).toBeUndefined()
        expect(composableResult.isSuccess.value).toBe(false)
        expect(composableResult.isError.value).toBe(false)
        expect(composableResult.isPending.value).toBe(false)
      })
    })
  })

  BddTest().when('creating a declared program using mutateAsync', () => {
    beforeEach(() => {
      mockOnSuccess = vi.fn()

      const result = mountComposable(
        () => useCreateDeclaredProgramMutation({
          onSuccess: mockOnSuccess
        }),
        {
          useTanstack: true
        }
      )
      composableResult = result.result
    })

    BddTest().then('it should return the declared program view DTO', async () => {
      const program = await composableResult.mutateAsync(declaredProgramRequestDTO)

      expect(program).toEqual(declaredProgramViewDTOFixture)
      expect(composableResult.isSuccess.value).toBe(true)
    })

    BddTest().then('it should call onSuccess callback', async () => {
      await composableResult.mutateAsync(declaredProgramRequestDTO)

      await vi.waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      })

      expect(mockOnSuccess).toHaveBeenCalledWith(
        declaredProgramViewDTOFixture,
        declaredProgramRequestDTO
      )
    })
  })

  BddTest().when('the mutation fails with server error', () => {
    beforeEach(() => {
      server.use(createDeclaredProgramErrorHandler)

      mockOnError = vi.fn()

      const result = mountComposable(
        () => useCreateDeclaredProgramMutation({
          onError: mockOnError
        }),
        {
          useTanstack: true
        }
      )
      composableResult = result.result
    })

    BddTest().and('using mutate', () => {
      BddTest().then('it should set error state', async () => {
        composableResult.mutate(declaredProgramRequestDTO)

        await vi.waitFor(() => {
          expect(composableResult.isError.value).toBe(true)
        })

        expect(composableResult.isSuccess.value).toBe(false)
        expect(composableResult.error.value).toBeDefined()
      })

      BddTest().then('it should call onError callback', async () => {
        composableResult.mutate(declaredProgramRequestDTO)

        await vi.waitFor(() => {
          expect(mockOnError).toHaveBeenCalledTimes(1)
        })

        const errorCall = mockOnError.mock.calls[0]
        expect(errorCall[0]).toMatchObject({
          status: 500,
          message: 'Internal Server Error'
        })
        expect(errorCall[1]).toEqual(declaredProgramRequestDTO)
      })
    })

    BddTest().and('using mutateAsync', () => {
      BddTest().then('it should throw an error', async () => {
        await expect(
          composableResult.mutateAsync(declaredProgramRequestDTO)
        ).rejects.toThrow()

        expect(composableResult.isError.value).toBe(true)
      })

      BddTest().then('it should call onError callback', async () => {
        try {
          await composableResult.mutateAsync(declaredProgramRequestDTO)
        }
        catch {
        }

        await vi.waitFor(() => {
          expect(mockOnError).toHaveBeenCalledTimes(1)
        })
      })
    })
  })
})

BddTest().given('a declared program detailed query', () => {
  let declaredProgramId: Ref<string>
  let queryResult: ReturnType<typeof useDeclaredProgramDetailedQuery>

  beforeEach(() => {
    vi.clearAllMocks()
    declaredProgramId = ref('declared-program-123-456-789')
  })

  BddTest().when('the query is executed with a valid declaredProgramId', () => {
    beforeEach(async () => {
      server.use(declaredProgramDetailedHandler)
      queryResult = mountQueryComposable(() => useDeclaredProgramDetailedQuery(declaredProgramId))

      await vi.waitFor(() => {
        expect(queryResult.isSuccess.value).toBe(true)
      })
    })

    BddTest().then('it should return declared program detailed data', () => {
      expect(queryResult.data.value).toBeDefined()
      expect(queryResult.data.value).toEqual(declaredProgramViewDTOFixture)
    })

    BddTest().then('it should compute declaredProgramDetailed', () => {
      expect(queryResult.declaredProgramDetailed.value).toEqual(declaredProgramViewDTOFixture)
    })

    BddTest().then('it should have success state', () => {
      expect(queryResult.isSuccess.value).toBe(true)
      expect(queryResult.isError.value).toBe(false)
    })

    BddTest().and('the declaredProgramId changes', () => {
      beforeEach(async () => {
        declaredProgramId.value = 'another-declared-program-id'

        await vi.waitFor(() => {
          expect(queryResult.isFetching.value || queryResult.isPending.value || queryResult.isSuccess.value).toBe(true)
        })
      })

      BddTest().then('it should keep a stable computed declaredProgramDetailed ref', () => {
        expect(queryResult.declaredProgramDetailed).toBeDefined()
      })
    })
  })

  BddTest().when('the query is executed with an empty declaredProgramId', () => {
    beforeEach(async () => {
      declaredProgramId.value = '   '
      queryResult = mountQueryComposable(() => useDeclaredProgramDetailedQuery(declaredProgramId))
      await flushPromises()
    })

    BddTest().then('it should not fetch and should have no data', () => {
      expect(queryResult.data.value).toBeUndefined()
      expect(queryResult.declaredProgramDetailed.value).toBeUndefined()
      expect(queryResult.isSuccess.value).toBe(false)
      expect(queryResult.isError.value).toBe(false)
      expect(queryResult.isFetching.value).toBe(false)
    })
  })

  BddTest().when('the query fails with server error', () => {
    beforeEach(async () => {
      server.use(declaredProgramDetailedErrorHandler)
      queryResult = mountQueryComposable(() => useDeclaredProgramDetailedQuery(declaredProgramId))
      await flushPromises()
    })

    BddTest().then('it should set error state', async () => {
      await vi.waitFor(() => {
        expect(queryResult.isError.value).toBe(true)
      })

      expect(queryResult.isSuccess.value).toBe(false)
      expect(queryResult.error.value).toBeDefined()
    })

    BddTest().then('it should have undefined declaredProgramDetailed', () => {
      expect(queryResult.declaredProgramDetailed.value).toBeUndefined()
    })
  })
})
