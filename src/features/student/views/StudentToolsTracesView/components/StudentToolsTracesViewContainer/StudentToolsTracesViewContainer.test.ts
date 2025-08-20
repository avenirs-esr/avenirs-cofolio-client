import { TraceStatus, type TracesViewResponse } from '@/api/avenir-esr'
import { useUnassignedTracesViewQuery } from '@/features/student/queries'
import StudentToolsTracesViewContainer from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesViewContainer/StudentToolsTracesViewContainer.vue'
import { useTracesStore } from '@/store'
import { PageSizes } from '@/ui/config'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createUsePaginationMock } from 'tests/mocks/mockUsePagination'
import { PaginationStub } from 'tests/stubs'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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
    useUnassignedTracesViewQuery: vi.fn(),
  }
})

const mockedUseUnassignedTracesViewQuery = vi.mocked(useUnassignedTracesViewQuery)

function mockUseUnassignedTracesViewQuery (payload: TracesViewResponse | undefined) {
  const mockData = ref(payload)
  const mockReturn = {
    data: mockData,
    traces: computed(() => mockData.value?.data.traces ?? []),
    pageInfo: computed(() => mockData.value?.page ?? { page: 0, totalPages: 0, totalElements: 0 }),
    error: ref(null),
    isLoading: ref(false),
    isSuccess: ref(true)
  } as unknown as ReturnType<typeof useUnassignedTracesViewQuery>
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
  StudentToolsTracesActionButtons: {
    name: 'StudentToolsTracesActionButtons',
    template: '<div class="student-tools-traces-action-buttons-stub">Action Buttons</div>'
  },
  StudentToolsTracesAddTraceDrawer: {
    name: 'StudentToolsTracesAddTraceDrawer',
    template: '<div class="student-tools-traces-add-trace-drawer-stub">Drawer Content</div>'
  }
}

describe('studentToolsTracesViewContainer', () => {
  const mockedTracesData: TracesViewResponse = {
    data: {
      traces: [
        { id: '1', title: 'Trace 1', status: TraceStatus.UNASSOCIATED, createdAt: '2024-01-01', updatedAt: '2024-01-01', deletedAt: '2024-02-01' },
        { id: '2', title: 'Trace 2', status: TraceStatus.UNASSOCIATED, createdAt: '2024-01-02', updatedAt: '2024-01-02', deletedAt: '2024-02-02' },
        { id: '3', title: 'Trace 3', status: TraceStatus.UNASSOCIATED, createdAt: '2024-01-03', updatedAt: '2024-01-03', deletedAt: '2024-02-03' },
        { id: '4', title: 'Trace 4', status: TraceStatus.UNASSOCIATED, createdAt: '2024-01-04', updatedAt: '2024-01-04', deletedAt: '2024-02-04' }
      ],
      criticalCount: 2
    },
    page: {
      page: 0,
      pageSize: 20,
      totalElements: 20,
      totalPages: 1
    }
  }

  describe('given trace data is available', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      vi.clearAllMocks()

      paginationMock = createUsePaginationMock()

      setActivePinia(createPinia())
      mockUseUnassignedTracesViewQuery(mockedTracesData)

      wrapper = mount(StudentToolsTracesViewContainer, {
        global: {
          plugins: [createPinia()],
          stubs
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render the action buttons', () => {
        expect(wrapper.findComponent({ name: 'StudentToolsTracesActionButtons' }).exists()).toBe(true)
      })

      it('then it should render the notice', () => {
        expect(wrapper.findComponent({ name: 'StudentToolsTracesViewNotice' }).exists()).toBe(true)
      })

      it('then it should render the Pagination component', () => {
        expect(wrapper.findComponent({ name: 'Pagination' }).exists()).toBe(true)
      })

      it('then it should render the correct number of trace cards', () => {
        const traceCards = wrapper.findAllComponents({ name: 'StudentDetailedTraceCard' })
        expect(traceCards).toHaveLength(4)
      })

      it('then it should render the add trace drawer', () => {
        expect(wrapper.findComponent({ name: 'StudentToolsTracesAddTraceDrawer' }).exists()).toBe(true)
      })

      it('then it should not show the drawer initially', () => {
        const store = useTracesStore()
        expect(store.showCreateTraceDrawer).toBe(false)
      })
    })

    describe('when clicking on the page update buttons', () => {
      it('then it should update current page and page size in the mock', async () => {
        await wrapper.find('.emit-current-page').trigger('click')
        expect(paginationMock.onUpdateCurrentPage).toHaveBeenCalledWith(5)
        expect(paginationMock.currentPage.value).toBe(5)

        await wrapper.find('.emit-page-size').trigger('click')
        expect(paginationMock.onUpdatePageSize).toHaveBeenCalledWith(PageSizes.TWELVE)
        expect(paginationMock.pageSizeSelected.value).toBe(PageSizes.TWELVE)
        expect(paginationMock.currentPage.value).toBe(0)
      })
    })

    describe('when displayCreateTraceDrawer is called', () => {
      beforeEach(async () => {
        const store = useTracesStore()
        store.displayCreateTraceDrawer()
        await wrapper.vm.$nextTick()
      })

      it('then it should display the create trace drawer', () => {
        const store = useTracesStore()
        expect(store.showCreateTraceDrawer).toBe(true)
      })

      it('then the store should have showCreateTraceDrawer set to true', async () => {
        await wrapper.vm.$nextTick()
        const store = useTracesStore()
        expect(store.showCreateTraceDrawer).toBe(true)
      })
    })

    describe('when drawer is closed via store', () => {
      beforeEach(async () => {
        const store = useTracesStore()
        store.displayCreateTraceDrawer()
        await wrapper.vm.$nextTick()
        store.hideCreateTraceDrawer()
        await wrapper.vm.$nextTick()
      })

      it('then it should hide the create trace drawer', () => {
        const store = useTracesStore()
        expect(store.showCreateTraceDrawer).toBe(false)
      })
    })
  })

  describe('given no trace data is available', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      vi.clearAllMocks()
      setActivePinia(createPinia())
      mockUseUnassignedTracesViewQuery(undefined)

      wrapper = mount(StudentToolsTracesViewContainer, {
        global: {
          plugins: [createPinia()],
          stubs
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should not render any trace cards', () => {
        const cards = wrapper.findAllComponents({ name: 'StudentDetailedTraceCard' })
        expect(cards).toHaveLength(0)
      })

      it('then it should still render all UI components', () => {
        expect(wrapper.findComponent({ name: 'StudentToolsTracesActionButtons' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'StudentToolsTracesViewNotice' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'Pagination' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'StudentToolsTracesAddTraceDrawer' }).exists()).toBe(true)
      })
    })
  })
})
