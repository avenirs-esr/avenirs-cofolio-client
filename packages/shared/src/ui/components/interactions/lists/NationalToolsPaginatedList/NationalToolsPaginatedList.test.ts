import type { UsePaginatedNationalToolsResult } from '#shared/composables/use-paginated-national-tools/use-paginated-national-tools'
import type { ToolDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { usePaginatedNationalTools } from '#shared/composables/use-paginated-national-tools/use-paginated-national-tools'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { BaseApiException, NationalToolsPaginatedList, PaginationStub, QuerySuspenseStub, ToolCardStub } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { computed, ref } from 'vue'

const mockTools = [
  {
    id: 'tool-1',
    name: 'Tool 1',
    description: 'First tool',
    url: 'https://example.com/tool-1',
  },
  {
    id: 'tool-2',
    name: 'Tool 2',
    description: 'Second tool',
    url: 'https://example.com/tool-2',
  },
] as ToolDTO[]

const mockPageInfo = {
  page: 0,
  pageSize: 12,
  totalElements: mockTools.length,
  totalPages: 1,
}

const mockError = new BaseApiException('error')

const mockNationalToolsCurrentPage = ref(0)

const defaultPaginatedResult = {
  nationalTools: computed(() => mockTools),
  pageInfo: computed(() => mockPageInfo),
  isFetching: ref(false),
  error: ref(null),
  onUpdateCurrentPage: vi.fn(),
  onUpdatePageSize: vi.fn(),
} as unknown as UsePaginatedNationalToolsResult

vi.mock('#shared/composables/use-paginated-national-tools/use-paginated-national-tools', () => ({
  usePaginatedNationalTools: vi.fn(),
}))

vi.mock('#shared/stores/index', () => ({
  useNationalToolsStore: () => ({
    nationalToolsCurrentPage: mockNationalToolsCurrentPage,
  }),
}))

const mockUsePaginatedNationalTools = vi.mocked(usePaginatedNationalTools)

BddTest().given('a national tools paginated list', () => {
  let wrapper: VueWrapper<InstanceType<typeof NationalToolsPaginatedList>>

  const stubs = {
    QuerySuspense: QuerySuspenseStub,
    Pagination: PaginationStub,
    ToolCard: ToolCardStub,
  }

  const mountWith = async ({
    baseRouteName,
    paginatedResult = defaultPaginatedResult,
  }: {
    baseRouteName?: string
    paginatedResult?: UsePaginatedNationalToolsResult
  } = {}) => {
    vi.clearAllMocks()

    mockUsePaginatedNationalTools.mockReturnValue(paginatedResult)

    wrapper = mountComponent(NationalToolsPaginatedList, {
      props: { baseRouteName },
      global: { stubs },
    })

    await flushPromises()
  }

  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getPagination = () => wrapper.findComponent(PaginationStub)
  const getToolCards = () => wrapper.findAllComponents(ToolCardStub)

  beforeEach(async () => {
    mockNationalToolsCurrentPage.value = 0

    await mountWith()
  })

  BddTest().when('the component is rendered', () => {
    BddTest().then('it should pass the national tools state to QuerySuspense', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(false)
      expect(getQuerySuspense().props('isLoading')).toBe(false)
      expect(getQuerySuspense().props('error')).toBe(null)
    })

    BddTest().then('it should pass the current page to the paginated composable', () => {
      const params = mockUsePaginatedNationalTools.mock.calls[0][0]

      expect(params.currentPageRef.value).toBe(0)
    })

    BddTest().then('it should render the pagination with a fixed page size', () => {
      expect(getPagination().exists()).toBe(true)
      expect(getPagination().props('pageInfo')).toBe(mockPageInfo)
      expect(getPagination().props('pageSizeSelected')).toBe(12)
      expect(getPagination().props('onUpdateCurrentPage')).toBe(defaultPaginatedResult.onUpdateCurrentPage)
      expect(getPagination().props('onUpdatePageSize')).toBe(defaultPaginatedResult.onUpdatePageSize)
      expect(getPagination().props('withoutPageSizePicker')).toBe(true)
    })

    BddTest().then('it should render a ToolCard for each national tool', () => {
      expect(getToolCards()).toHaveLength(mockTools.length)

      expect(getToolCards().map(card => card.props('tool'))).toStrictEqual(mockTools)
    })

    BddTest().then('it should not pass a base route name to ToolCard', () => {
      getToolCards().forEach((card) => {
        expect(card.props('baseRouteName')).toBeUndefined()
      })
    })
  })

  BddTest().when('the component receives a base route name', () => {
    beforeEach(async () => {
      await mountWith({ baseRouteName: 'national-tool-details' })
    })

    BddTest().then('it should pass the base route name to every ToolCard', () => {
      getToolCards().forEach((card) => {
        expect(card.props('baseRouteName')).toBe('national-tool-details')
      })
    })
  })

  BddTest().when('the national tools query returns no tools', () => {
    const emptyResult = {
      ...defaultPaginatedResult,
      nationalTools: computed(() => []),
      pageInfo: computed(() => undefined),
    } as unknown as UsePaginatedNationalToolsResult

    beforeEach(async () => {
      await mountWith({ paginatedResult: emptyResult })
    })

    BddTest().then('it should pass the empty state to QuerySuspense', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(true)
    })

    BddTest().then('it should not render the pagination or any ToolCard', () => {
      expect(getPagination().exists()).toBe(false)
      expect(getToolCards()).toHaveLength(0)
    })
  })

  BddTest().when('the national tools query returns an error', () => {
    beforeEach(async () => {
      await mountWith({
        paginatedResult: {
          ...defaultPaginatedResult,
          error: ref(mockError),
        } as UsePaginatedNationalToolsResult,
      })
    })

    BddTest().then('it should pass the error to QuerySuspense', () => {
      expect(getQuerySuspense().props('error')).toBe(mockError)
      expect(getQuerySuspense().props('isLoading')).toBe(false)
      expect(getQuerySuspense().props('isEmpty')).toBe(false)
    })
  })

  BddTest().when('the national tools query is fetching', () => {
    beforeEach(async () => {
      await mountWith({
        paginatedResult: {
          ...defaultPaginatedResult,
          isFetching: ref(true),
        } as UsePaginatedNationalToolsResult,
      })
    })

    BddTest().then('it should pass the loading state to QuerySuspense', () => {
      expect(getQuerySuspense().props('isLoading')).toBe(true)
    })
  })
})
