import type { ToolDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import type { UsePaginatedLocalToolsResult } from '@/features/staff/admin/views/AdminToolsView/composables/use-paginated-local-tools/use-paginated-local-tools'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { BaseApiException, PaginationStub, QuerySuspenseStub, ToolCardStub } from '@avenirs-esr/shared'
import { EToolType } from '@avenirs-esr/shared/api/avenir-esr'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { ROUTES } from '@/common/constants'
import LocalToolsPaginatedList from '@/features/staff/admin/views/AdminToolsView/components/LocalToolsPaginatedList/LocalToolsPaginatedList.vue'
import { usePaginatedLocalTools } from '@/features/staff/admin/views/AdminToolsView/composables/use-paginated-local-tools/use-paginated-local-tools'

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

const mockLocalToolsCurrentPage = ref(0)
const mockRegionalToolsCurrentPage = ref(0)

const defaultPaginatedResult = {
  localTools: computed(() => mockTools),
  pageInfo: computed(() => mockPageInfo),
  isFetching: ref(false),
  error: ref(null),
  onUpdateCurrentPage: vi.fn(),
  onUpdatePageSize: vi.fn(),
} as unknown as UsePaginatedLocalToolsResult

vi.mock('@/features/staff/admin/views/AdminToolsView/composables/use-paginated-local-tools/use-paginated-local-tools', () => ({
  usePaginatedLocalTools: vi.fn(),
}))

vi.mock('@/features/staff/admin/stores/local-tools/local-tools.store', () => ({
  useLocalToolsStore: () => ({
    localToolsCurrentPage: mockLocalToolsCurrentPage,
    regionalToolsCurrentPage: mockRegionalToolsCurrentPage,
  }),
}))

const mockUsePaginatedLocalTools = vi.mocked(usePaginatedLocalTools)

BddTest().given('a local tools paginated list', () => {
  let wrapper: VueWrapper<InstanceType<typeof LocalToolsPaginatedList>>

  const stubs = {
    QuerySuspense: QuerySuspenseStub,
    Pagination: PaginationStub,
    ToolCard: ToolCardStub,
  }

  const mountWith = async ({
    type = EToolType.LOCAL,
    paginatedResult = defaultPaginatedResult,
  }: {
    type?: EToolType
    paginatedResult?: UsePaginatedLocalToolsResult
  } = {}) => {
    vi.clearAllMocks()

    mockUsePaginatedLocalTools.mockReturnValue(paginatedResult)

    wrapper = mountComponent(LocalToolsPaginatedList, {
      props: { type },
      global: { stubs },
    })

    await flushPromises()
  }

  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getPagination = () => wrapper.findComponent(PaginationStub)
  const getToolCards = () => wrapper.findAllComponents(ToolCardStub)

  BddTest().when('the component is rendered with LOCAL type', () => {
    beforeEach(async () => {
      mockLocalToolsCurrentPage.value = 0
      mockRegionalToolsCurrentPage.value = 0

      await mountWith()
    })

    BddTest().then('it should pass the local tools pagination state to the composable', () => {
      const params = mockUsePaginatedLocalTools.mock.calls[0][0]
      expect(params.typeRef.value).toBe(EToolType.LOCAL)
    })

    BddTest().then('it should pass the local tools state to QuerySuspense', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(false)
      expect(getQuerySuspense().props('isLoading')).toBe(false)
      expect(getQuerySuspense().props('error')).toBe(null)
    })

    BddTest().then('it should render the pagination with a fixed page size', () => {
      expect(getPagination().exists()).toBe(true)
      expect(getPagination().props('pageInfo')).toBe(mockPageInfo)
      expect(getPagination().props('pageSizeSelected')).toBe(12)
      expect(getPagination().props('onUpdateCurrentPage')).toBe(defaultPaginatedResult.onUpdateCurrentPage)
      expect(getPagination().props('onUpdatePageSize')).toBe(defaultPaginatedResult.onUpdatePageSize)
      expect(getPagination().props('withoutPageSizePicker')).toBeDefined()
    })

    BddTest().then('it should render a ToolCard for each local tool', () => {
      expect(getToolCards()).toHaveLength(mockTools.length)

      expect(getToolCards().map(card => card.props('tool'))).toStrictEqual(mockTools)
    })

    BddTest().then('it should pass the admin tool route name to every ToolCard', () => {
      getToolCards().forEach((card) => {
        expect(card.props('baseRouteName')).toBe(ROUTES.STAFF.ADMIN.TOOL.name)
      })
    })
  })

  BddTest().when('the component is rendered with REGIONAL type', () => {
    beforeEach(async () => {
      await mountWith({ type: EToolType.REGIONAL })
    })

    BddTest().then('it should pass the regional tools pagination state to the composable', () => {
      const params = mockUsePaginatedLocalTools.mock.calls[0][0]
      expect(params.typeRef.value).toBe(EToolType.REGIONAL)
    })
  })

  BddTest().when('the local tools query returns no tools', () => {
    const emptyResult = {
      ...defaultPaginatedResult,
      localTools: computed(() => []),
      pageInfo: computed(() => undefined),
    } as unknown as UsePaginatedLocalToolsResult

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

  BddTest().when('the local tools query returns an error', () => {
    beforeEach(async () => {
      await mountWith({
        paginatedResult: {
          ...defaultPaginatedResult,
          error: ref(mockError),
        } as UsePaginatedLocalToolsResult,
      })
    })

    BddTest().then('it should pass the error to QuerySuspense', () => {
      expect(getQuerySuspense().props('error')).toBe(mockError)
      expect(getQuerySuspense().props('isLoading')).toBe(false)
      expect(getQuerySuspense().props('isEmpty')).toBe(false)
    })
  })

  BddTest().when('the local tools query is fetching', () => {
    beforeEach(async () => {
      await mountWith({
        paginatedResult: {
          ...defaultPaginatedResult,
          isFetching: ref(true),
        } as UsePaginatedLocalToolsResult,
      })
    })

    BddTest().then('it should pass the loading state to QuerySuspense', () => {
      expect(getQuerySuspense().props('isLoading')).toBe(true)
    })
  })
})
