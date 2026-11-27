import type { UsePaginatedToolsResult } from '#shared/composables/use-paginated-tools/use-paginated-tools'
import type { VueWrapper } from '@vue/test-utils'
import { generateToolDTOs } from '#shared/__mocks__/fixtures/tools.fixtures'
import { EToolType } from '#shared/api/avenir-esr/index'
import { usePaginatedTools } from '#shared/composables/use-paginated-tools/use-paginated-tools'
import { BaseApiException } from '#shared/exceptions'
import { mountComponent } from '#shared/test-utils/unit/mount-component'
import { ToolCardStub } from '#shared/ui/components/cards/ToolCard/ToolCard.stub'
import { QuerySuspenseStub } from '#shared/ui/components/containers/QuerySuspense/QuerySuspense.stub'
import ToolsPaginatedList from '#shared/ui/components/interactions/lists/ToolsPaginatedList/ToolsPaginatedList.vue'
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

const mockNationalToolsCurrentPage = ref(1)
const mockRegionalToolsCurrentPage = ref(2)
const mockLocalToolsCurrentPage = ref(3)

const defaultPaginatedResult: UsePaginatedToolsResult = {
  tools: computed(() => mockTools),
  pageInfo: computed(() => mockPageInfo),
  isFetching: ref(false),
  error: ref(null),
  onUpdateCurrentPage: vi.fn(),
  onUpdatePageSize: vi.fn(),
}

vi.mock('#shared/composables/use-paginated-tools/use-paginated-tools', () => ({
  usePaginatedTools: vi.fn(),
}))

vi.mock('#shared/stores/index', () => ({
  useToolsStore: vi.fn(() => ({
    nationalToolsCurrentPage: mockNationalToolsCurrentPage,
    regionalToolsCurrentPage: mockRegionalToolsCurrentPage,
    localToolsCurrentPage: mockLocalToolsCurrentPage,
  })),
}))

const mockUsePaginatedTools = vi.mocked(usePaginatedTools)

BddTest().given('a tools paginated list', () => {
  let wrapper: VueWrapper<InstanceType<typeof ToolsPaginatedList>>

  const stubs = {
    QuerySuspense: QuerySuspenseStub,
    Pagination: PaginationStub,
    ToolCard: ToolCardStub,
  }

  const mountWith = async ({
    baseRouteName,
    type,
    paginatedResult = defaultPaginatedResult,
  }: {
    baseRouteName?: string
    type?: EToolType | undefined
    paginatedResult?: ReturnType<typeof usePaginatedTools>
  } = {}) => {
    vi.clearAllMocks()

    mockUsePaginatedTools.mockReturnValue(paginatedResult)

    wrapper = mountComponent(ToolsPaginatedList, {
      props: {
        baseRouteName,
        type: type ?? EToolType.LOCAL,
      },
      global: { stubs },
    })

    await flushPromises()
  }

  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getPagination = () => wrapper.findComponent(PaginationStub)
  const getToolCards = () => wrapper.findAllComponents(ToolCardStub)

  beforeEach(async () => {
    mockNationalToolsCurrentPage.value = 1
    mockRegionalToolsCurrentPage.value = 2
    mockLocalToolsCurrentPage.value = 3

    await mountWith()
  })

  BddTest().when('the component is rendered', () => {
    BddTest().then('it should pass the tools state to QuerySuspense', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(false)
      expect(getQuerySuspense().props('isLoading')).toBe(false)
      expect(getQuerySuspense().props('error')).toBe(null)
      expect(getQuerySuspense().props('emptyStateMessage')).toContain('Aucun outil trouvé')
    })

    BddTest().then('it should enable preview mode when no base route name is provided', () => {
      const params = mockUsePaginatedTools.mock.calls[0][0]

      expect(params.previewModeRef?.value).toBe(true)
    })

    BddTest().then('it should pass the current page and type to the paginated composable', () => {
      const params = mockUsePaginatedTools.mock.calls[0][0]

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
      await mountWith({ baseRouteName: 'tool-details' })
    })

    BddTest().then('it should disable preview mode', () => {
      const params = mockUsePaginatedTools.mock.calls[0][0]

      expect(params.previewModeRef?.value).toBe(false)
    })

    BddTest().then('it should pass the base route name to every ToolCard', () => {
      getToolCards().forEach((card) => {
        expect(card.props('baseRouteName')).toBe('tool-details')
      })
    })
  })

  BddTest().when('the component receives a different tool type', () => {
    BddTest().then('it should use the regional tools current page', async () => {
      await mountWith({ type: EToolType.REGIONAL })

      const params = mockUsePaginatedTools.mock.calls[0][0]

      expect(params.currentPageRef.value).toBe(2)
      expect(params.typeRef.value).toBe(EToolType.REGIONAL)
    })

    BddTest().then('it should use the national tools current page', async () => {
      await mountWith({ type: EToolType.NATIONAL })

      const params = mockUsePaginatedTools.mock.calls[0][0]

      expect(params.currentPageRef.value).toBe(1)
      expect(params.typeRef.value).toBe(EToolType.NATIONAL)
    })
  })

  BddTest().when('the tools query returns no tools', () => {
    const emptyResult = {
      ...defaultPaginatedResult,
      tools: computed(() => []),
      pageInfo: computed(() => undefined),
    } as unknown as ReturnType<typeof usePaginatedTools>

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
        } as ReturnType<typeof usePaginatedTools>,
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
        } as ReturnType<typeof usePaginatedTools>,
      })
    })

    BddTest().then('it should pass the loading state to QuerySuspense', () => {
      expect(getQuerySuspense().props('isLoading')).toBe(true)
    })
  })
})
