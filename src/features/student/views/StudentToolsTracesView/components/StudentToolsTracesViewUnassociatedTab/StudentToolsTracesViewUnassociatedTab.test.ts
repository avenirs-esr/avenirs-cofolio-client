import { ETraceStatus, type PagedResponseTraceViewDTO } from '@/api/avenir-esr'
import { PaginationStub } from '@/common/components/Pagination/Pagination.stub'
import { useTracesViewQuery } from '@/features/student/queries'
import StudentToolsTracesViewUnassociatedTab from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesViewUnassociatedTab/StudentToolsTracesViewUnassociatedTab.vue'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createUsePaginationMock } from 'tests/mocks/mockUsePagination'
import { BddTest } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

let paginationMock: ReturnType<typeof createUsePaginationMock>

vi.mock('@/common/composables/use-pagination/use-pagination', () => {
  return {
    usePagination: vi.fn(() => paginationMock)
  }
})

vi.mock('@/features/student/queries', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/student/queries')>()
  return {
    ...actual,
    useTracesViewQuery: vi.fn(),
  }
})

const mockedUseUnassignedTracesViewQuery = vi.mocked(useTracesViewQuery)

function mockUseUnassignedTracesViewQuery (payload: PagedResponseTraceViewDTO | undefined) {
  const mockData = ref(payload)
  const mockReturn = {
    data: mockData,
    traces: computed(() => mockData.value?.data ?? []),
    pageInfo: computed(() => mockData.value?.page ?? { page: 0, totalPages: 0, totalElements: 0 }),
    error: ref(null),
    isLoading: ref(false),
    isSuccess: ref(true)
  } as unknown as ReturnType<typeof useTracesViewQuery>
  mockedUseUnassignedTracesViewQuery.mockReturnValue(mockReturn)
}

const stubs = {
  StudentToolsTracesViewNotice: {
    name: 'StudentToolsTracesViewNotice',
    template: '<div class="student-tools-traces-view-notice-stub" />'
  },
  StudentDetailedTraceCard: {
    name: 'StudentDetailedTraceCard',
    props: ['trace'],
    template: '<div class="student-detailed-trace-card-stub" />'
  },
  Pagination: PaginationStub,
}

BddTest().given('a student tools traces view container', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentToolsTracesViewUnassociatedTab>>

  const mockedTracesData: PagedResponseTraceViewDTO = {
    data: [
      { id: '1', title: 'Trace 1', status: ETraceStatus.UNASSOCIATED, createdAt: '2024-01-01', updatedAt: '2024-01-01', willBeDeletedAt: '2024-02-01' },
      { id: '2', title: 'Trace 2', status: ETraceStatus.UNASSOCIATED, createdAt: '2024-01-02', updatedAt: '2024-01-02', willBeDeletedAt: '2024-02-02' },
      { id: '3', title: 'Trace 3', status: ETraceStatus.UNASSOCIATED, createdAt: '2024-01-03', updatedAt: '2024-01-03', willBeDeletedAt: '2024-02-03' },
      { id: '4', title: 'Trace 4', status: ETraceStatus.UNASSOCIATED, createdAt: '2024-01-04', updatedAt: '2024-01-04', willBeDeletedAt: '2024-02-04' }
    ],
    page: {
      page: 0,
      pageSize: 20,
      totalElements: 20,
      totalPages: 1
    }
  }

  BddTest().and('trace data is available', () => {
    beforeEach(() => {
      vi.clearAllMocks()

      paginationMock = createUsePaginationMock()

      setActivePinia(createPinia())
      mockUseUnassignedTracesViewQuery(mockedTracesData)

      wrapper = mount(StudentToolsTracesViewUnassociatedTab, {
        global: {
          plugins: [createPinia()],
          stubs
        }
      })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should render the notice', () => {
        expect(wrapper.findComponent({ name: 'StudentToolsTracesViewNotice' }).exists()).toBe(true)
      })

      BddTest().then('it should render the Pagination component', () => {
        expect(wrapper.findComponent({ name: 'Pagination' }).exists()).toBe(true)
      })

      BddTest().then('it should render the correct number of trace cards', () => {
        const traceCards = wrapper.findAllComponents({ name: 'StudentDetailedTraceCard' })
        expect(traceCards).toHaveLength(4)
      })
    })

    BddTest().when('clicking on the page update buttons', () => {
      BddTest().then('it should update current page and page size in the mock', async () => {
        await wrapper.find('.emit-current-page').trigger('click')
        expect(paginationMock.onUpdateCurrentPage).toHaveBeenCalledWith(5)
        expect(paginationMock.currentPage.value).toBe(5)

        await wrapper.find('.emit-page-size').trigger('click')
        expect(paginationMock.onUpdatePageSize).toHaveBeenCalledWith(PageSizes.TWELVE)
        expect(paginationMock.pageSizeSelected.value).toBe(PageSizes.TWELVE)
        expect(paginationMock.currentPage.value).toBe(0)
      })
    })
  })

  BddTest().and('no trace data is available', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      setActivePinia(createPinia())
      mockUseUnassignedTracesViewQuery(undefined)

      wrapper = mount(StudentToolsTracesViewUnassociatedTab, {
        global: {
          plugins: [createPinia()],
          stubs
        }
      })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should not render any trace cards', () => {
        const cards = wrapper.findAllComponents({ name: 'StudentDetailedTraceCard' })
        expect(cards).toHaveLength(0)
      })

      BddTest().then('it should still render all UI components', () => {
        expect(wrapper.findComponent({ name: 'StudentToolsTracesViewNotice' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'Pagination' }).exists()).toBe(true)
      })
    })
  })
})
