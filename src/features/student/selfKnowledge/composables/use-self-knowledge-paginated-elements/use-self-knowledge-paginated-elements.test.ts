import type { PageInfoDTO, SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import {
  useSelfKnowledgePaginatedElements
} from '@/features/student/selfKnowledge/composables/use-self-knowledge-paginated-elements/use-self-knowledge-paginated-elements'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick, type Ref } from 'vue'

const mockGetCachedElements = vi.fn()

const mockPageInfo = ref<PageInfoDTO>({
  page: 0,
  pageSize: 3,
  totalElements: 0,
  totalPages: 0
})

const mockFetchedElements = ref<SelfKnowledgeElementViewDTO[]>([])
const mockIsFetching = ref(false)

vi.mock('@/features/student/selfKnowledge/queries/self-knowledge.query/self-knowledge.query', () => ({
  useGetCachedSelfKnowledgeElements: () => ({
    getCachedElements: mockGetCachedElements
  }),
  useSelfKnowledgeCategoryElementsViewQuery: vi.fn(() => ({
    pageInfo: mockPageInfo,
    elements: mockFetchedElements,
    isFetching: mockIsFetching
  }))
}))

BddTest().given('the useSelfKnowledgePaginatedElements composable', () => {
  let categoryId: Ref<string>
  let composableResult: ReturnType<typeof useSelfKnowledgePaginatedElements>

  const createElement = (id: string, title: string): SelfKnowledgeElementViewDTO =>
    ({
      id,
      title
    } as SelfKnowledgeElementViewDTO)

  const mountWithCurrentCategory = () => {
    const { result } = mountComposable(
      () =>
        useSelfKnowledgePaginatedElements({
          selfKnowledgeCategoryId: categoryId,
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

    categoryId = ref('')
    mockGetCachedElements.mockReset()

    mockPageInfo.value = {
      page: 0,
      pageSize: 3,
      totalElements: 0,
      totalPages: 0
    }

    mockFetchedElements.value = []
    mockIsFetching.value = false
  })

  BddTest().when('the category id is initially empty', () => {
    beforeEach(() => {
      mountWithCurrentCategory()
    })

    BddTest().then('it should initialize with empty elements and page 0', () => {
      expect(composableResult.elements.value).toEqual([])
      expect(composableResult.page.value).toBe(0)
      expect(mockGetCachedElements).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the category id has cached elements', () => {
    const cachedElements = [
      createElement('1', 'Cached 1'),
      createElement('2', 'Cached 2')
    ]

    beforeEach(() => {
      categoryId.value = 'category-1'
      mockGetCachedElements.mockReturnValue({
        elements: cachedElements,
        currentPage: 2
      })

      mountWithCurrentCategory()
    })

    BddTest().then('it should load elements and page from cache', () => {
      expect(mockGetCachedElements).toHaveBeenCalledWith('category-1')
      expect(composableResult.elements.value).toEqual(cachedElements)
      expect(composableResult.page.value).toBe(2)
    })
  })

  BddTest().when('fetched elements are updated for the first page', () => {
    const firstPage = [createElement('1', 'First'), createElement('2', 'Second')]

    beforeEach(async () => {
      categoryId.value = 'category-1'
      mockGetCachedElements.mockReturnValue({
        elements: [],
        currentPage: -1
      })

      mountWithCurrentCategory()

      mockFetchedElements.value = firstPage
      await nextTick()
    })

    BddTest().then('it should replace the elements list', () => {
      expect(composableResult.page.value).toBe(0)
      expect(composableResult.elements.value).toEqual(firstPage)
    })
  })

  BddTest().when('fetched elements are updated for a subsequent page', () => {
    const firstPage = [createElement('1', 'First'), createElement('2', 'Second')]
    const secondPage = [
      createElement('2', 'Second (duplicate)'),
      createElement('3', 'Third')
    ]

    beforeEach(async () => {
      categoryId.value = 'category-1'
      mockGetCachedElements.mockReturnValue({
        elements: [],
        currentPage: -1
      })

      mountWithCurrentCategory()

      mockFetchedElements.value = firstPage
      await nextTick()

      composableResult.page.value = 1

      mockFetchedElements.value = secondPage
      await nextTick()
    })

    BddTest().then('it should merge new elements and avoid duplicates', () => {
      const ids = composableResult.elements.value.map(el => el.id)
      expect(ids).toEqual(['1', '2', '3'])
    })
  })

  BddTest().when('the category id becomes empty after having a value', () => {
    beforeEach(async () => {
      categoryId.value = 'category-1'
      mockGetCachedElements.mockReturnValue({
        elements: [createElement('1', 'First')],
        currentPage: 0
      })

      mountWithCurrentCategory()

      expect(composableResult.elements.value).toHaveLength(1)

      categoryId.value = ''
      await nextTick()
    })

    BddTest().then('it should reset elements and page to initial state', () => {
      expect(composableResult.elements.value).toEqual([])
      expect(composableResult.page.value).toBe(0)
    })
  })

  BddTest().when('loadMoreElements is called while fetching', () => {
    beforeEach(() => {
      categoryId.value = 'category-1'
      mockGetCachedElements.mockReturnValue({
        elements: [],
        currentPage: 0
      })

      mockPageInfo.value = {
        page: 0,
        pageSize: 3,
        totalElements: 10,
        totalPages: 4
      }

      mountWithCurrentCategory()

      composableResult.page.value = 1
      mockIsFetching.value = true

      composableResult.loadMoreElements()
    })

    BddTest().then('it should not increment the page', () => {
      expect(composableResult.page.value).toBe(1)
    })
  })

  BddTest().when('loadMoreElements is called and more pages are available', () => {
    beforeEach(() => {
      categoryId.value = 'category-1'
      mockGetCachedElements.mockReturnValue({
        elements: [],
        currentPage: 0
      })

      mockPageInfo.value = {
        page: 0,
        pageSize: 3,
        totalElements: 10,
        totalPages: 4
      }

      mountWithCurrentCategory()

      composableResult.page.value = 1
      mockIsFetching.value = false

      composableResult.loadMoreElements()
    })

    BddTest().then('it should increment the page index', () => {
      expect(composableResult.page.value).toBe(2)
    })
  })

  BddTest().when('loadMoreElements is called on the last available page', () => {
    beforeEach(() => {
      categoryId.value = 'category-1'
      mockGetCachedElements.mockReturnValue({
        elements: [],
        currentPage: 0
      })

      mockPageInfo.value = {
        page: 0,
        pageSize: 3,
        totalElements: 9,
        totalPages: 3
      }

      mountWithCurrentCategory()

      composableResult.page.value = 2
      mockIsFetching.value = false

      composableResult.loadMoreElements()
    })

    BddTest().then('it should not increment the page index', () => {
      expect(composableResult.page.value).toBe(2)
    })
  })

  BddTest().when('resetPagination is called', () => {
    beforeEach(() => {
      categoryId.value = 'category-1'
      mockGetCachedElements.mockReturnValue({
        elements: [],
        currentPage: 3
      })

      mountWithCurrentCategory()

      expect(composableResult.page.value).toBe(3)

      composableResult.resetPagination()
    })

    BddTest().then('it should reset page to 0', () => {
      expect(composableResult.page.value).toBe(0)
    })
  })
})
