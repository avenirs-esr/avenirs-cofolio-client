import type { SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import type { Ref } from 'vue'
import { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import {
  useSelfKnowledgePaginatedElements
} from '@/features/selfKnowledge/composables/use-self-knowledge-paginated-elements/use-self-knowledge-paginated-elements'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('the useSelfKnowledgePaginatedElements composable', () => {
  let categoryType: Ref<ESelfKnowledgeCategory>
  let composableResult: ReturnType<typeof useSelfKnowledgePaginatedElements>

  const mountWithCurrentCategory = () => {
    const { result } = mountComposable(
      () =>
        useSelfKnowledgePaginatedElements({
          selfKnowledgeCategory: categoryType,
          pageSize: 3
        }),
      {
        useTanstack: true
      }
    )

    composableResult = result
  }

  beforeEach(() => {
    vi.clearAllMocks()
    categoryType = ref('' as ESelfKnowledgeCategory)
  })

  BddTest().when('the category type is initially empty', () => {
    beforeEach(() => {
      mountWithCurrentCategory()
    })

    BddTest().then('it should initialize with empty elements and page 0', () => {
      expect(composableResult.elements.value).toEqual([])
      expect(composableResult.page.value).toBe(0)
    })
  })

  BddTest().when('the category type has a value and the first page is loaded', () => {
    beforeEach(async () => {
      categoryType.value = ESelfKnowledgeCategory.STRENGTHS
      mountWithCurrentCategory()

      await vi.waitFor(() => {
        expect(composableResult.elements.value.length).toBeGreaterThan(0)
      })
    })

    BddTest().then('it should load the first page into elements', () => {
      const elements = composableResult.elements.value

      expect(elements.length).toBe(3)
      expect(elements[0]).toHaveProperty('id')
      expect(elements[0]).toHaveProperty('title')
      expect(composableResult.page.value).toBe(0)
    })

    BddTest().then('pageInfo should be consistent with the paginated response', () => {
      const pageInfo = composableResult.pageInfo.value

      expect(pageInfo.page).toBe(0)
      expect(pageInfo.pageSize).toBe(3)
      expect(pageInfo.totalElements).toBeGreaterThan(0)
      expect(pageInfo.totalPages).toBeGreaterThan(0)
    })
  })

  BddTest().when('loadMoreElements is called and more pages are available', () => {
    let firstPageElements: SelfKnowledgeElementViewDTO[]

    beforeEach(async () => {
      categoryType.value = ESelfKnowledgeCategory.STRENGTHS
      mountWithCurrentCategory()

      await vi.waitFor(() => {
        expect(composableResult.elements.value.length).toBe(3)
      })

      firstPageElements = [...composableResult.elements.value]

      composableResult.loadMoreElements()

      await vi.waitFor(() => {
        expect(composableResult.elements.value.length).toBeGreaterThan(
          firstPageElements.length
        )
      })
    })

    BddTest().then('it should increment the page index', () => {
      expect(composableResult.page.value).toBe(1)
    })

    BddTest().then('it should accumulate elements from multiple pages', () => {
      const elements = composableResult.elements.value

      expect(elements.length).toBe(6)

      const uniqueIds = new Set(elements.map(el => el.id))
      expect(uniqueIds.size).toBe(elements.length)
    })
  })

  BddTest().when('loadMoreElements is called multiple times', () => {
    beforeEach(async () => {
      categoryType.value = ESelfKnowledgeCategory.STRENGTHS
      mountWithCurrentCategory()

      await vi.waitFor(() => {
        expect(composableResult.elements.value.length).toBe(3)
      })

      composableResult.loadMoreElements()
      await vi.waitFor(() => {
        expect(composableResult.page.value).toBe(1)
        expect(composableResult.elements.value.length).toBe(6)
      })

      composableResult.loadMoreElements()
      await vi.waitFor(() => {
        expect(composableResult.page.value).toBe(2)
        expect(composableResult.elements.value.length).toBe(9)
      })
    })

    BddTest().then('it should continue accumulating elements across pages', () => {
      const elements = composableResult.elements.value

      expect(elements.length).toBe(9)

      const uniqueIds = new Set(elements.map(el => el.id))
      expect(uniqueIds.size).toBe(elements.length)
    })
  })

  BddTest().when('the category type becomes empty after having a value', () => {
    beforeEach(async () => {
      categoryType.value = ESelfKnowledgeCategory.STRENGTHS
      mountWithCurrentCategory()

      await vi.waitFor(() => {
        expect(composableResult.elements.value.length).toBe(3)
      })

      categoryType.value = '' as ESelfKnowledgeCategory

      await vi.waitFor(() => {
        expect(composableResult.elements.value).toEqual([])
        expect(composableResult.page.value).toBe(0)
      })
    })

    BddTest().then('it should reset elements and page to initial state', () => {
      expect(composableResult.elements.value).toEqual([])
      expect(composableResult.page.value).toBe(0)
    })
  })

  BddTest().when('resetPagination is called', () => {
    beforeEach(async () => {
      categoryType.value = ESelfKnowledgeCategory.STRENGTHS
      mountWithCurrentCategory()

      await vi.waitFor(() => {
        expect(composableResult.elements.value.length).toBe(3)
      })

      composableResult.loadMoreElements()
      await vi.waitFor(() => {
        expect(composableResult.page.value).toBe(1)
      })

      composableResult.resetPagination()

      await vi.waitFor(() => {
        expect(composableResult.page.value).toBe(0)
      })
    })

    BddTest().then('it should reset page to 0 and clear elements', () => {
      expect(composableResult.page.value).toBe(0)
      expect(composableResult.elements.value.length).toBe(0)
    })
  })
})
