import { mockedSelfKnowledgeCategories } from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import { selfKnowledgeCategoriesErrorHandler, selfKnowledgeCategoryElementsErrorHandler } from '@/__mocks__/msw/handlers/student/self-knowledge.handlers'
import { server } from '@/__mocks__/msw/server'
import { ESelfKnowledgeCategoryType } from '@/api/avenir-esr'
import {
  useSelfKnowledgeCategoriesQuery,
  useSelfKnowledgeCategoryElementsViewQuery
} from '@/features/student/selfKnowledge/queries/self-knowledge.query/self-knowledge.query'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { expect, vi } from 'vitest'

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
        useTanstack: true
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
        useTanstack: true
      })
      const composableResult = result.result

      await vi.waitFor(() => {
        expect(composableResult.isError.value).toBe(true)
      })

      expect(composableResult.error.value).toBeDefined()
    })
  })
})

BddTest().given('a self knowledge category elements view query', () => {
  let composableResult: ReturnType<typeof useSelfKnowledgeCategoryElementsViewQuery>
  const selfKnowledgeCategoryId = ref('4aec2faa-d986-4553-a14b-2ecabba415c8')
  const page = ref(0)
  const pageSize = ref(10)

  beforeEach(() => {
    const result = mountComposable(() => useSelfKnowledgeCategoryElementsViewQuery({
      selfKnowledgeCategoryId,
      page,
      pageSize
    }), {
      useTanstack: true
    })
    composableResult = result.result
  })

  BddTest().when('the query is initialized', () => {
    BddTest().then('it should return an empty elements array initially', () => {
      expect(composableResult.elements.value).toEqual([])
    })

    BddTest().then('it should be in loading state', () => {
      expect(composableResult.isLoading.value).toBe(true)
    })

    BddTest().then('it should return default page info initially', () => {
      expect(composableResult.pageInfo.value).toEqual({
        page: 0,
        pageSize: 0,
        totalElements: 0,
        totalPages: 0
      })
    })
  })

  BddTest().when('the query fetches data successfully', () => {
    BddTest().then('it should populate the elements array', async () => {
      await vi.waitFor(() => {
        expect(composableResult.isSuccess.value).toBe(true)
      })

      expect(composableResult.elements.value).toBeDefined()
      expect(Array.isArray(composableResult.elements.value)).toBe(true)
      expect(composableResult.elements.value.length).toBeGreaterThan(0)
    })

    BddTest().then('it should return elements with correct structure', async () => {
      await vi.waitFor(() => {
        expect(composableResult.isSuccess.value).toBe(true)
      })

      const elements = composableResult.elements.value
      const firstElement = elements[0]
      expect(firstElement).toHaveProperty('id')
      expect(firstElement).toHaveProperty('title')
      expect(firstElement).toHaveProperty('description')
      expect(typeof firstElement.id).toBe('string')
      expect(typeof firstElement.title).toBe('string')
      expect(typeof firstElement.description).toBe('string')
    })

    BddTest().then('it should return correct page info', async () => {
      await vi.waitFor(() => {
        expect(composableResult.isSuccess.value).toBe(true)
      })

      const pageInfo = composableResult.pageInfo.value
      expect(pageInfo).toHaveProperty('page', 0)
      expect(pageInfo).toHaveProperty('pageSize', 10)
      expect(pageInfo).toHaveProperty('totalElements')
      expect(pageInfo).toHaveProperty('totalPages')
      expect(pageInfo.totalElements).toBeGreaterThan(0)
    })
  })

  BddTest().when('the query data is accessed', () => {
    BddTest().then('it should return the same data as elements computed property', async () => {
      await vi.waitFor(() => {
        expect(composableResult.isSuccess.value).toBe(true)
      })

      expect(composableResult.elements.value).toEqual(composableResult.data.value?.data ?? [])
    })

    BddTest().then('it should return the same page info from data', async () => {
      await vi.waitFor(() => {
        expect(composableResult.isSuccess.value).toBe(true)
      })

      expect(composableResult.pageInfo.value).toEqual(composableResult.data.value?.page ?? { page: 0, pageSize: 0, totalElements: 0, totalPages: 0 })
    })
  })

  BddTest().when('the pagination parameters change', () => {
    BddTest().then('it should fetch new data', async () => {
      await vi.waitFor(() => {
        expect(composableResult.isSuccess.value).toBe(true)
      })

      const firstPageElements = [...composableResult.elements.value]

      page.value = 1

      await vi.waitFor(() => {
        expect(composableResult.pageInfo.value.page).toBe(1)
      })

      expect(composableResult.elements.value).not.toEqual(firstPageElements)
    })
  })

  BddTest().when('the selfKnowledgeCategoryId is empty', () => {
    BddTest().then('it should not fetch data', async () => {
      const emptyId = ref('')
      const result = mountComposable(() => useSelfKnowledgeCategoryElementsViewQuery({
        selfKnowledgeCategoryId: emptyId,
        page,
        pageSize
      }), {
        useTanstack: true
      })
      const composableResult = result.result

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(composableResult.isFetching.value).toBe(false)
      expect(composableResult.elements.value).toEqual([])
    })
  })

  BddTest().when('the query fails with server error', () => {
    BddTest().then('it should set error state', async () => {
      server.use(selfKnowledgeCategoryElementsErrorHandler)

      const result = mountComposable(() => useSelfKnowledgeCategoryElementsViewQuery({
        selfKnowledgeCategoryId,
        page,
        pageSize
      }), {
        useTanstack: true
      })
      const composableResult = result.result

      await vi.waitFor(() => {
        expect(composableResult.isError.value).toBe(true)
      })

      expect(composableResult.isSuccess.value).toBe(false)
      expect(composableResult.elements.value).toEqual([])
    })

    BddTest().then('it should have error information', async () => {
      server.use(selfKnowledgeCategoryElementsErrorHandler)

      const result = mountComposable(() => useSelfKnowledgeCategoryElementsViewQuery({
        selfKnowledgeCategoryId,
        page,
        pageSize
      }), {
        useTanstack: true
      })
      const composableResult = result.result

      await vi.waitFor(() => {
        expect(composableResult.isError.value).toBe(true)
      })

      expect(composableResult.error.value).toBeDefined()
    })
  })

  BddTest().when('the pageSize is not provided', () => {
    BddTest().then('it should use default page size of 3', async () => {
      const result = mountComposable(() => useSelfKnowledgeCategoryElementsViewQuery({
        selfKnowledgeCategoryId,
        page
      }), {
        useTanstack: true
      })
      const composableResult = result.result

      await vi.waitFor(() => {
        expect(composableResult.isSuccess.value).toBe(true)
      })

      expect(composableResult.pageInfo.value.pageSize).toBe(3)
      expect(composableResult.elements.value.length).toBeLessThanOrEqual(3)
    })
  })

  BddTest().when('querying different categories', () => {
    BddTest().then('it should return category-specific elements for strengths', async () => {
      const strengthsCategoryId = ref('4aec2faa-d986-4553-a14b-2ecabba415c8')
      const testPage = ref(0)
      const testPageSize = ref(10)
      const result = mountComposable(() => useSelfKnowledgeCategoryElementsViewQuery({
        selfKnowledgeCategoryId: strengthsCategoryId,
        page: testPage,
        pageSize: testPageSize
      }), {
        useTanstack: true
      })
      const composableResult = result.result

      await vi.waitFor(() => {
        expect(composableResult.isSuccess.value).toBe(true)
      })

      const elements = composableResult.elements.value
      expect(elements.length).toBeGreaterThan(0)
      expect(elements[0].title).toBeDefined()
      expect(['Créativité', 'Esprit d\'équipe', 'Leadership', 'Persévérance', 'Communication', 'Adaptabilité', 'Organisation', 'Empathie', 'Curiosité', 'Autonomie']).toContain(elements[0].title)
    })

    BddTest().then('it should return category-specific elements for values', async () => {
      const valuesCategoryId = ref('a0c79a9a-b5c0-411b-ba54-68d73de72225')
      const testPage = ref(0)
      const testPageSize = ref(10)
      const result = mountComposable(() => useSelfKnowledgeCategoryElementsViewQuery({
        selfKnowledgeCategoryId: valuesCategoryId,
        page: testPage,
        pageSize: testPageSize
      }), {
        useTanstack: true
      })
      const composableResult = result.result

      await vi.waitFor(() => {
        expect(composableResult.isSuccess.value).toBe(true)
      })

      const elements = composableResult.elements.value
      expect(elements.length).toBeGreaterThan(0)
      expect(elements[0].title).toBeDefined()
      expect(['Respect', 'Honnêteté', 'Solidarité', 'Justice', 'Liberté', 'Engagement', 'Bienveillance', 'Excellence', 'Innovation', 'Authenticité']).toContain(elements[0].title)
    })

    BddTest().then('it should return category-specific elements for aspirations', async () => {
      const aspirationsCategoryId = ref('609965be-ebb1-44b3-bf8b-458a7ece6fb7')
      const testPage = ref(0)
      const testPageSize = ref(10)
      const result = mountComposable(() => useSelfKnowledgeCategoryElementsViewQuery({
        selfKnowledgeCategoryId: aspirationsCategoryId,
        page: testPage,
        pageSize: testPageSize
      }), {
        useTanstack: true
      })
      const composableResult = result.result

      await vi.waitFor(() => {
        expect(composableResult.isSuccess.value).toBe(true)
      })

      const elements = composableResult.elements.value
      expect(elements.length).toBeGreaterThan(0)
      expect(elements[0].title).toBeDefined()
      expect(elements[0].title).toMatch(/^(Développer mes compétences techniques|Manager une équipe|Voyager à l'étranger|Créer mon entreprise|Continuer mes études|Contribuer à des projets sociaux|Équilibrer vie pro et perso|Développer mon réseau|Maîtriser de nouvelles langues|Partager mes connaissances)$/)
    })
  })
})
