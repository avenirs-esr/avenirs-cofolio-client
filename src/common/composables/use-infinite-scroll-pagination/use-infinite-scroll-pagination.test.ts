import type { PageInfoDTO } from '@/api/avenir-esr'
import type { Ref } from 'vue'
import { useInfiniteScrollPagination } from '@/common/composables/use-infinite-scroll-pagination/use-infinite-scroll-pagination'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach } from 'vitest'

interface TestItem {
  id: string
  name: string
}

function createPageInfo (overrides: Partial<PageInfoDTO> = {}): PageInfoDTO {
  return {
    page: 0,
    pageSize: 3,
    totalElements: 0,
    totalPages: 1,
    ...overrides
  }
}

function createTestItems (count: number, startId = 1): TestItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${startId + i}`,
    name: `Item ${startId + i}`
  }))
}

const getItemId = (item: TestItem) => item.id

BddTest().given('useInfiniteScrollPagination composable', () => {
  BddTest().when('initialized with empty items', () => {
    const fetchedItems = ref<TestItem[]>([])
    const pageInfo = ref<PageInfoDTO>(createPageInfo())
    const isFetching = ref(false)
    const page = ref(0)

    const { items } = useInfiniteScrollPagination({
      fetchedItems,
      pageInfo,
      isFetching,
      page,
      getItemId
    })

    BddTest().then('items should be empty', () => {
      expect(items.value).toEqual([])
    })

    BddTest().then('page should be 0', () => {
      expect(page.value).toBe(0)
    })
  })

  BddTest().when('fetchedItems changes on first page', () => {
    let fetchedItems: Ref<TestItem[]>
    let pageInfo: Ref<PageInfoDTO>
    let isFetching: Ref<boolean>
    let page: Ref<number>
    let items: Ref<TestItem[]>

    beforeEach(() => {
      fetchedItems = ref<TestItem[]>([])
      pageInfo = ref<PageInfoDTO>(createPageInfo({ page: 0 }))
      isFetching = ref(false)
      page = ref(0)

      const result = useInfiniteScrollPagination({
        fetchedItems,
        pageInfo,
        isFetching,
        page,
        getItemId
      })
      items = result.items

      fetchedItems.value = createTestItems(3)
    })

    BddTest().then('items should be replaced with new items', () => {
      expect(items.value).toHaveLength(3)
      expect(items.value[0].id).toBe('item-1')
    })
  })

  BddTest().when('loading more pages', () => {
    let fetchedItems: Ref<TestItem[]>
    let pageInfo: Ref<PageInfoDTO>
    let isFetching: Ref<boolean>
    let page: Ref<number>
    let items: Ref<TestItem[]>
    let loadMore: () => void

    beforeEach(() => {
      fetchedItems = ref<TestItem[]>(createTestItems(3))
      pageInfo = ref<PageInfoDTO>(createPageInfo({ page: 0, totalPages: 2 }))
      isFetching = ref(false)
      page = ref(0)

      const result = useInfiniteScrollPagination({
        fetchedItems,
        pageInfo,
        isFetching,
        page,
        getItemId
      })
      items = result.items
      loadMore = result.loadMore

      loadMore()
      pageInfo.value = createPageInfo({ page: 1, totalPages: 2 })
      fetchedItems.value = createTestItems(2, 4)
    })

    BddTest().then('page should increment', () => {
      expect(page.value).toBe(1)
    })

    BddTest().then('items should be merged', () => {
      expect(items.value).toHaveLength(5)
      expect(items.value.map(i => i.id)).toEqual([
        'item-1',
        'item-2',
        'item-3',
        'item-4',
        'item-5'
      ])
    })
  })

  BddTest().when('loadMore returns duplicate items', () => {
    let fetchedItems: Ref<TestItem[]>
    let pageInfo: Ref<PageInfoDTO>
    let isFetching: Ref<boolean>
    let page: Ref<number>
    let items: Ref<TestItem[]>
    let loadMore: () => void

    beforeEach(() => {
      fetchedItems = ref<TestItem[]>(createTestItems(3))
      pageInfo = ref<PageInfoDTO>(createPageInfo({ page: 0, totalPages: 2 }))
      isFetching = ref(false)
      page = ref(0)

      const result = useInfiniteScrollPagination({
        fetchedItems,
        pageInfo,
        isFetching,
        page,
        getItemId
      })
      items = result.items
      loadMore = result.loadMore

      loadMore()
      pageInfo.value = createPageInfo({ page: 1, totalPages: 2 })
      fetchedItems.value = [
        { id: 'item-2', name: 'Item 2 duplicate' },
        { id: 'item-4', name: 'Item 4' }
      ]
    })

    BddTest().then('duplicates should be filtered out', () => {
      expect(items.value).toHaveLength(4)
      expect(items.value.map(i => i.id)).toEqual([
        'item-1',
        'item-2',
        'item-3',
        'item-4'
      ])
    })
  })

  BddTest().when('loadMore is called while fetching', () => {
    let page: Ref<number>
    let loadMore: () => void

    beforeEach(() => {
      const fetchedItems = ref<TestItem[]>(createTestItems(3))
      const pageInfo = ref<PageInfoDTO>(createPageInfo({ page: 0, totalPages: 3 }))
      const isFetching = ref(true)
      page = ref(0)

      const result = useInfiniteScrollPagination({
        fetchedItems,
        pageInfo,
        isFetching,
        page,
        getItemId
      })
      loadMore = result.loadMore

      loadMore()
    })

    BddTest().then('page should not change', () => {
      expect(page.value).toBe(0)
    })
  })

  BddTest().when('loadMore is called on last page', () => {
    let page: Ref<number>
    let loadMore: () => void

    beforeEach(() => {
      const fetchedItems = ref<TestItem[]>(createTestItems(3))
      const pageInfo = ref<PageInfoDTO>(createPageInfo({ page: 1, totalPages: 2 }))
      const isFetching = ref(false)
      page = ref(1)

      const result = useInfiniteScrollPagination({
        fetchedItems,
        pageInfo,
        isFetching,
        page,
        getItemId
      })
      loadMore = result.loadMore

      loadMore()
    })

    BddTest().then('page should not change', () => {
      expect(page.value).toBe(1)
    })
  })

  BddTest().when('resetPagination is called', () => {
    let items: Ref<TestItem[]>
    let page: Ref<number>
    let resetPagination: () => void

    beforeEach(() => {
      const fetchedItems = ref<TestItem[]>(createTestItems(3))
      const pageInfo = ref<PageInfoDTO>(createPageInfo({ page: 1, totalPages: 2 }))
      const isFetching = ref(false)
      page = ref(1)

      const result = useInfiniteScrollPagination({
        fetchedItems,
        pageInfo,
        isFetching,
        page,
        getItemId
      })
      items = result.items
      resetPagination = result.resetPagination

      items.value = createTestItems(6)
      resetPagination()
    })

    BddTest().then('page should be 0', () => {
      expect(page.value).toBe(0)
    })

    BddTest().then('items should be empty', () => {
      expect(items.value).toEqual([])
    })
  })

  BddTest().when('using custom getItemId function', () => {
    interface CustomItem {
      uuid: string
      title: string
    }

    let items: Ref<CustomItem[]>
    let loadMore: () => void

    beforeEach(() => {
      const initialItems: CustomItem[] = [
        { uuid: 'uuid-1', title: 'First' },
        { uuid: 'uuid-2', title: 'Second' }
      ]
      const fetchedItems = ref<CustomItem[]>(initialItems)
      const pageInfo = ref<PageInfoDTO>(createPageInfo({ page: 0, totalPages: 2 }))
      const isFetching = ref(false)
      const page = ref(0)

      const result = useInfiniteScrollPagination({
        fetchedItems,
        pageInfo,
        isFetching,
        page,
        getItemId: (item: CustomItem) => item.uuid
      })
      items = result.items
      loadMore = result.loadMore

      loadMore()
      pageInfo.value = createPageInfo({ page: 1, totalPages: 2 })
      fetchedItems.value = [
        { uuid: 'uuid-2', title: 'Second duplicate' },
        { uuid: 'uuid-3', title: 'Third' }
      ]
    })

    BddTest().then('should deduplicate using custom id extractor', () => {
      expect(items.value).toHaveLength(3)
      expect(items.value.map(i => i.uuid)).toEqual(['uuid-1', 'uuid-2', 'uuid-3'])
    })
  })
})
