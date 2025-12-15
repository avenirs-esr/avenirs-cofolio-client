import type { AddDeclaredProgramDTO } from '@/api/avenir-esr'
import { declaredProgramViewDTOFixture } from '@/__mocks__/fixtures/student/declaredPrograms.fixtures'
import { createDeclaredProgramErrorHandler } from '@/__mocks__/msw/handlers/student/declaredPrograms.handlers'
import { server } from '@/__mocks__/msw/server'
import { useCreateDeclaredProgramMutation } from '@/features/student/declaredPrograms/queries/use-declared-programs.query'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a create declared program mutation', () => {
  let composableResult: ReturnType<typeof useCreateDeclaredProgramMutation>
  let mockOnSuccess: ReturnType<typeof vi.fn>
  let mockOnError: ReturnType<typeof vi.fn>

  const addDeclaredProgramDTO: AddDeclaredProgramDTO = {
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
      composableResult.mutate(addDeclaredProgramDTO)

      await vi.waitFor(() => {
        expect(composableResult.isSuccess.value).toBe(true)
      })

      expect(composableResult.data.value).toEqual(declaredProgramViewDTOFixture)
      expect(composableResult.isError.value).toBe(false)
    })

    BddTest().then('it should call onSuccess callback with correct data', async () => {
      composableResult.mutate(addDeclaredProgramDTO)

      await vi.waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      })

      expect(mockOnSuccess).toHaveBeenCalledWith(
        declaredProgramViewDTOFixture,
        addDeclaredProgramDTO
      )
    })

    BddTest().and('resetting the mutation after success', () => {
      BddTest().then('it should clear mutation state', async () => {
        composableResult.mutate(addDeclaredProgramDTO)

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
      const program = await composableResult.mutateAsync(addDeclaredProgramDTO)

      expect(program).toEqual(declaredProgramViewDTOFixture)
      expect(composableResult.isSuccess.value).toBe(true)
    })

    BddTest().then('it should call onSuccess callback', async () => {
      await composableResult.mutateAsync(addDeclaredProgramDTO)

      await vi.waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      })

      expect(mockOnSuccess).toHaveBeenCalledWith(
        declaredProgramViewDTOFixture,
        addDeclaredProgramDTO
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
        composableResult.mutate(addDeclaredProgramDTO)

        await vi.waitFor(() => {
          expect(composableResult.isError.value).toBe(true)
        })

        expect(composableResult.isSuccess.value).toBe(false)
        expect(composableResult.error.value).toBeDefined()
      })

      BddTest().then('it should call onError callback', async () => {
        composableResult.mutate(addDeclaredProgramDTO)

        await vi.waitFor(() => {
          expect(mockOnError).toHaveBeenCalledTimes(1)
        })

        const errorCall = mockOnError.mock.calls[0]
        expect(errorCall[0]).toMatchObject({
          status: 500,
          message: 'Internal Server Error'
        })
        expect(errorCall[1]).toEqual(addDeclaredProgramDTO)
      })
    })

    BddTest().and('using mutateAsync', () => {
      BddTest().then('it should throw an error', async () => {
        await expect(
          composableResult.mutateAsync(addDeclaredProgramDTO)
        ).rejects.toThrow()

        expect(composableResult.isError.value).toBe(true)
      })

      BddTest().then('it should call onError callback', async () => {
        try {
          await composableResult.mutateAsync(addDeclaredProgramDTO)
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
