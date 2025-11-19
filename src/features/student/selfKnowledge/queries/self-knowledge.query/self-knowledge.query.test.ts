import { mockedSelfKnowledgeCategories } from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import { selfKnowledgeCategoriesErrorHandler } from '@/__mocks__/msw/handlers/student/self-knowledge.handlers'
import { server } from '@/__mocks__/msw/server'
import { ESelfKnowledgeCategoryType } from '@/api/avenir-esr'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { expect, vi } from 'vitest'
import { useSelfKnowledgeCategoriesQuery } from './self-knowledge.query'

BddTest().given('a self knowledge categories query', () => {
  let composableResult: ReturnType<typeof useSelfKnowledgeCategoriesQuery>

  beforeEach(() => {
    const result = mountComposable(() => useSelfKnowledgeCategoriesQuery(), {
      useTanstack: true
    })
    composableResult = result.result
  })

  BddTest().when('the query is initialized', () => {
    BddTest().then('it should return an empty categories array initially', () => {
      expect(composableResult.categories.value).toEqual([])
    })

    BddTest().then('it should be in loading state', () => {
      expect(composableResult.isLoading.value).toBe(true)
    })
  })

  BddTest().when('the query fetches data successfully', () => {
    BddTest().then('it should populate the categories array', async () => {
      await vi.waitFor(() => {
        expect(composableResult.isSuccess.value).toBe(true)
      })

      expect(composableResult.categories.value).toBeDefined()
      expect(Array.isArray(composableResult.categories.value)).toBe(true)
      expect(composableResult.categories.value).toHaveLength(3)
    })

    BddTest().then('it should return categories with correct structure', async () => {
      await vi.waitFor(() => {
        expect(composableResult.isSuccess.value).toBe(true)
      })

      const categories = composableResult.categories.value
      expect(categories).toEqual(mockedSelfKnowledgeCategories)

      const firstCategory = categories[0]
      expect(firstCategory).toHaveProperty('id', '4aec2faa-d986-4553-a14b-2ecabba415c8')
      expect(firstCategory).toHaveProperty('title', 'Mes points forts')
      expect(firstCategory).toHaveProperty('description', 'Identifier et valoriser mes qualités, talents et réussites marquantes.')
      expect(firstCategory).toHaveProperty('type', ESelfKnowledgeCategoryType.STRENGTHS)
    })
  })

  BddTest().when('the query data is accessed', () => {
    BddTest().then('it should return the same data as categories computed property', async () => {
      await vi.waitFor(() => {
        expect(composableResult.isSuccess.value).toBe(true)
      })

      expect(composableResult.categories.value).toEqual(composableResult.data.value ?? [])
    })
  })

  BddTest().when('the query fails with server error', () => {
    BddTest().then('it should set error state', async () => {
      server.use(selfKnowledgeCategoriesErrorHandler)

      const result = mountComposable(() => useSelfKnowledgeCategoriesQuery(), {
        useTanstack: true,
        queryClientConfig: {
          defaultOptions: {
            queries: { retry: false }
          }
        }
      })
      const composableResult = result.result

      await vi.waitFor(() => {
        expect(composableResult.isError.value).toBe(true)
      })

      expect(composableResult.isSuccess.value).toBe(false)
      expect(composableResult.categories.value).toEqual([])
    })

    BddTest().then('it should have error information', async () => {
      server.use(selfKnowledgeCategoriesErrorHandler)

      const result = mountComposable(() => useSelfKnowledgeCategoriesQuery(), {
        useTanstack: true,
        queryClientConfig: {
          defaultOptions: {
            queries: { retry: false, staleTime: 0 }
          }
        }
      })
      const composableResult = result.result

      await vi.waitFor(() => {
        expect(composableResult.isError.value).toBe(true)
      })

      expect(composableResult.error.value).toBeDefined()
    })
  })
})
