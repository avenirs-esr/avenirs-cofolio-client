import { TraceStatus, type TracesViewResponse } from '@/api/avenir-esr'
import { useUnassignedTracesViewQuery } from '@/features/student/queries'
import StudentToolsTracesViewContainer from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesViewContainer/StudentToolsTracesViewContainer.vue'
import { useTracesStore } from '@/store'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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
    pageInfo: computed(() => mockData.value?.page ?? { number: 0, totalPages: 0, totalElements: 0 }),
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
  Pagination: {
    name: 'Pagination',
    props: ['pageInfo', 'pageSizeSelected', 'onUpdateCurrentPage', 'onUpdatePageSize'],
    template: `
      <div class="pagination-stub">
        <button class="emit-current-page" @click="onUpdateCurrentPage(2)">Page 2</button>
        <button class="emit-page-size" @click="onUpdatePageSize(50)">Size 50</button>
        <slot />
      </div>
    `
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
      number: 0,
      pageSize: 20,
      totalElements: 20,
      totalPages: 1
    }
  }

  describe('given trace data is available', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      vi.clearAllMocks()
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
    })

    describe('when Pagination emits current page update', () => {
      beforeEach(async () => {
        await wrapper.find('.emit-current-page').trigger('click')
      })

      it('then it should update the current page in the store', () => {
        const store = useTracesStore()
        expect(store.currentPage).toBe(2)
      })
    })

    describe('when Pagination emits page size update', () => {
      beforeEach(async () => {
        const store = useTracesStore()
        store.currentPage = 1
        await wrapper.find('.emit-page-size').trigger('click')
      })

      it('then it should update the page size in the store', () => {
        const store = useTracesStore()
        expect(store.pageSizeSelected).toBe(50)
      })

      it('then it should reset current page to 0', () => {
        const store = useTracesStore()
        expect(store.currentPage).toBe(0)
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

      it('then it should still render notice and pagination', () => {
        expect(wrapper.findComponent({ name: 'StudentToolsTracesViewNotice' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'Pagination' }).exists()).toBe(true)
      })
    })
  })
})
