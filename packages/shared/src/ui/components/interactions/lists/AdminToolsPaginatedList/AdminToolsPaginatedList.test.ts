import type { UsePaginatedAdminToolsResult } from '#shared/composables/use-paginated-admin-tools/use-paginated-admin-tools'
import type { VueWrapper } from '@vue/test-utils'
import { generateToolDTOs } from '#shared/__mocks__/fixtures/admin-tools.fixtures'
import { EToolType } from '#shared/api/avenir-esr/index'
import { usePaginatedAdminTools } from '#shared/composables/use-paginated-admin-tools/use-paginated-admin-tools'
import { BaseApiException } from '#shared/exceptions'
import { mountComponent } from '#shared/test-utils/unit/mount-component'
import { ToolCardStub } from '#shared/ui/components/cards/ToolCard/ToolCard.stub'
import { QuerySuspenseStub } from '#shared/ui/components/containers/QuerySuspense/QuerySuspense.stub'
import AdminToolsPaginatedList from '#shared/ui/components/interactions/lists/AdminToolsPaginatedList/AdminToolsPaginatedList.vue'
import { PaginationStub } from '#shared/ui/components/navigation/Pagination/Pagination.stub'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { computed, ref } from 'vue'

const mockTools = generateToolDTOs(2, EToolType.LOCAL)

const mockPageInfo = {
  page: 0,
  pageSize: PageSizes.TWELVE,
  totalElements: mockTools.length,
  totalPages: 1,
}

const mockError = new BaseApiException('error')

const mockLocalToolsCurrentPage = ref(0)

const defaultPaginatedResult = {
  tools: computed(() => mockTools),
  pageInfo: computed(() => mockPageInfo),
  isFetching: ref(false),
  error: ref(null),
  onUpdateCurrentPage: vi.fn(),
  onUpdatePageSize: vi.fn(),
} as unknown as UsePaginatedAdminToolsResult

vi.mock('#shared/composables/use-paginated-admin-tools/use-paginated-admin-tools', () => ({
  usePaginatedAdminTools: vi.fn(),
}))

vi.mock('#shared/stores/index', () => ({
  useAdminToolsStore: () => ({
    localToolsCurrentPage: mockLocalToolsCurrentPage,
  }),
}))

const mockUsePaginatedAdminTools = vi.mocked(usePaginatedAdminTools)

BddTest().given('an admin tools paginated list', () => {
  let wrapper: VueWrapper<InstanceType<typeof AdminToolsPaginatedList>>

  const stubs = {
    QuerySuspense: QuerySuspenseStub,
    Pagination: PaginationStub,
    ToolCard: ToolCardStub,
  }

  const mountWith = async ({
    baseRouteName,
    type = EToolType.LOCAL,
    paginatedResult = defaultPaginatedResult,
  }: {
    baseRouteName?: string
    type?: EToolType
    paginatedResult?: UsePaginatedAdminToolsResult
  } = {}) => {
    vi.clearAllMocks()

    mockUsePaginatedAdminTools.mockReturnValue(paginatedResult)

    wrapper = mountComponent(AdminToolsPaginatedList, {
      props: { baseRouteName, type },
      global: { stubs },
    })

    await flushPromises()
  }

  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getPagination = () => wrapper.findComponent(PaginationStub)
  const getToolCards = () => wrapper.findAllComponents(ToolCardStub)

  beforeEach(async () => {
    mockLocalToolsCurrentPage.value = 0

    await mountWith()
  })

  BddTest().when('the component is rendered', () => {
    BddTest().then('it should pass the tools state to QuerySuspense', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(false)
      expect(getQuerySuspense().props('isLoading')).toBe(false)
      expect(getQuerySuspense().props('error')).toBe(null)
    })

    BddTest().then('it should pass the current page and type to the paginated composable', () => {
      const params = mockUsePaginatedAdminTools.mock.calls[0][0]

      expect(params.currentPageRef.value).toBe(0)
      expect(params.typeRef.value).toBe(EToolType.LOCAL)
    })

    BddTest().then('it should render the pagination with a fixed page size', () => {
      expect(getPagination().exists()).toBe(true)
      expect(getPagination().props('pageInfo')).toBe(mockPageInfo)
      expect(getPagination().props('pageSizeSelected')).toBe(PageSizes.TWELVE)
      expect(getPagination().props('onUpdateCurrentPage')).toBe(defaultPaginatedResult.onUpdateCurrentPage)
      expect(getPagination().props('onUpdatePageSize')).toBe(defaultPaginatedResult.onUpdatePageSize)
      expect(getPagination().props('withoutPageSizePicker')).toBeDefined()
    })

    BddTest().then('it should render a ToolCard for each tool', () => {
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
      await mountWith({ baseRouteName: 'admin-tool-details' })
    })

    BddTest().then('it should pass the base route name to every ToolCard', () => {
      getToolCards().forEach((card) => {
        expect(card.props('baseRouteName')).toBe('admin-tool-details')
      })
    })
  })

  BddTest().when('the component receives a different tool type', () => {
    BddTest().then('it should pass the REGIONAL type to the paginated composable', async () => {
      await mountWith({ type: EToolType.REGIONAL })

      const params = mockUsePaginatedAdminTools.mock.calls[0][0]

      expect(params.typeRef.value).toBe(EToolType.REGIONAL)
    })

    BddTest().then('it should pass the NATIONAL type to the paginated composable', async () => {
      await mountWith({ type: EToolType.NATIONAL })

      const params = mockUsePaginatedAdminTools.mock.calls[0][0]

      expect(params.typeRef.value).toBe(EToolType.NATIONAL)
    })
  })

  BddTest().when('the tools query returns no tools', () => {
    const emptyResult = {
      ...defaultPaginatedResult,
      tools: computed(() => []),
      pageInfo: computed(() => undefined),
    } as unknown as UsePaginatedAdminToolsResult

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

  BddTest().when('the tools query returns an error', () => {
    beforeEach(async () => {
      await mountWith({
        paginatedResult: {
          ...defaultPaginatedResult,
          error: ref(mockError),
        } as UsePaginatedAdminToolsResult,
      })
    })

    BddTest().then('it should pass the error to QuerySuspense', () => {
      expect(getQuerySuspense().props('error')).toBe(mockError)
      expect(getQuerySuspense().props('isLoading')).toBe(false)
      expect(getQuerySuspense().props('isEmpty')).toBe(false)
    })
  })

  BddTest().when('the tools query is fetching', () => {
    beforeEach(async () => {
      await mountWith({
        paginatedResult: {
          ...defaultPaginatedResult,
          isFetching: ref(true),
        } as UsePaginatedAdminToolsResult,
      })
    })

    BddTest().then('it should pass the loading state to QuerySuspense', () => {
      expect(getQuerySuspense().props('isLoading')).toBe(true)
    })
  })
})
