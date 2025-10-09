import type { PagedResponseTraceViewDTO } from '@/api/avenir-esr'
import { createTracesViewHandler } from '@/__mocks__/msw/handlers/student/traces.handlers'
import { server } from '@/__mocks__/msw/server'
import { PaginationStub } from '@/common/components/Pagination/Pagination.stub'
import StudentToolsTracesViewAssociatedTab from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesViewAssociatedTab/StudentToolsTracesViewAssociatedTab.vue'
import { TraceFilterContainerStub } from '@/features/student/views/StudentToolsTracesView/components/TraceFilterContainer/TraceFilterContainer.stub'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createUseTraceFiltersMock } from 'tests/mocks'
import { createUsePaginationMock } from 'tests/mocks/mockUsePagination'
import { BddTest, mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

let paginationMock: ReturnType<typeof createUsePaginationMock>
let traceFiltersMock: ReturnType<typeof createUseTraceFiltersMock>

vi.mock('@/common/composables/use-pagination/use-pagination', () => {
  return {
    usePagination: vi.fn(() => paginationMock)
  }
})

vi.mock('@/features/student/composables/use-trace-filters/use-trace-filters', () => {
  return {
    useTraceFilters: vi.fn(() => traceFiltersMock)
  }
})

BddTest().given('a student tools traces view container', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentToolsTracesViewAssociatedTab>>

  const stubs = {
    StudentDetailedTraceCard: {
      name: 'StudentDetailedTraceCard',
      props: ['trace'],
      template: '<div class="student-detailed-trace-card-stub" />'
    },
    TraceFilterContainer: TraceFilterContainerStub,
    Pagination: PaginationStub,
  }

  const mockedTracesData: PagedResponseTraceViewDTO = {
    data: [
      { id: '1', title: 'Trace 1', isAssociated: true, createdAt: '2024-01-01', updatedAt: '2024-01-01', willBeDeletedAt: '2024-02-01' },
      { id: '2', title: 'Trace 2', isAssociated: true, createdAt: '2024-01-02', updatedAt: '2024-01-02', willBeDeletedAt: '2024-02-02' },
      { id: '3', title: 'Trace 3', isAssociated: true, createdAt: '2024-01-03', updatedAt: '2024-01-03', willBeDeletedAt: '2024-02-03' },
      { id: '4', title: 'Trace 4', isAssociated: true, createdAt: '2024-01-04', updatedAt: '2024-01-04', willBeDeletedAt: '2024-02-04' }
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
      traceFiltersMock = createUseTraceFiltersMock()

      setActivePinia(createPinia())
      const handler = createTracesViewHandler(mockedTracesData)
      server.use(handler)

      wrapper = mountComponent(StudentToolsTracesViewAssociatedTab, {
        global: {
          stubs
        },
        useTanstack: true,
        usePinia: true
      })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should render the TraceFilterContainer component', () => {
        const filters = wrapper.findComponent({ name: 'TraceFilterContainer' })
        expect(filters.exists()).toBe(true)
        expect(filters.props('isAssociated')).toBe(true)
      })

      BddTest().then('it should render the Pagination component', () => {
        expect(wrapper.findComponent({ name: 'Pagination' }).exists()).toBe(true)
      })

      BddTest().then('it should render the correct number of trace cards', async () => {
        await flushPromises()
        const traceCards = wrapper.findAllComponents({ name: 'StudentDetailedTraceCard' })
        expect(traceCards).toHaveLength(4)
      })
    })

    BddTest().when('clicking on the filters buttons', () => {
      beforeEach(async () => {
        await flushPromises()
        await wrapper.find('.emit-update-filters').trigger('click')
      })

      BddTest().then('it should update current keyword, fromDate and skillIds in the mock', async () => {
        expect(traceFiltersMock.onUpdateFilters).toHaveBeenCalledWith({
          keyword: 'example',
          fromDate: '2025-10-10',
          skillIds: ['skill-1', 'skill-2']
        })
      })

      BddTest().then('it should reset current page', async () => {
        expect(paginationMock.resetCurrentPage).toHaveBeenCalled()
      })
    })

    BddTest().when('clicking on the page update buttons', () => {
      BddTest().then('it should update current page and page size in the mock', async () => {
        await flushPromises()
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

      wrapper = mountComponent(StudentToolsTracesViewAssociatedTab, {
        global: {
          stubs
        },
        useTanstack: true,
        usePinia: true
      })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('it should render the TraceFilterContainer component', () => {
        const filters = wrapper.findComponent({ name: 'TraceFilterContainer' })
        expect(filters.exists()).toBe(true)
        expect(filters.props('isAssociated')).toBe(true)
      })

      BddTest().then('it should not render any trace cards', () => {
        const cards = wrapper.findAllComponents({ name: 'StudentDetailedTraceCard' })
        expect(cards).toHaveLength(0)
      })

      BddTest().then('it should still render all UI components', () => {
        expect(wrapper.findComponent({ name: 'Pagination' }).exists()).toBe(true)
      })
    })
  })
})
