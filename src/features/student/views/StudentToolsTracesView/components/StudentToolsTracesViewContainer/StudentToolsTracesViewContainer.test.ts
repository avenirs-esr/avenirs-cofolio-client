import { TraceStatus, type TracesViewResponse } from '@/api/avenir-esr'
import {
  useUnassignedTracesViewQuery
} from '@/features/student/queries'
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

const commonStubs = {
  StudentToolsTracesViewNotice: {
    name: 'StudentToolsTracesViewNotice',
    template: '<div class="student-tools-traces-view-notice-stub" />'
  },
  TracePageSizePicker: {
    name: 'TracePageSizePicker',
    template: '<div class="trace-page-size-picker-stub" />'
  },
  StudentDetailedTraceCard: {
    name: 'StudentDetailedTraceCard',
    props: ['trace'],
    template: '<div class="student-detailed-trace-card-stub" />'
  },
  AvPagination: {
    name: 'AvPagination',
    props: ['currentPage', 'pages', 'items', 'ariaLabel', 'compact', 'id'],
    template: '<div class="av-pagination-stub" @click="$emit(\'update:current-page\', 3)" />',
    emits: ['update:current-page']
  }
}

describe('studentToolsTracesViewContainer', () => {
  const mockedTracesData: TracesViewResponse = {
    data: {
      traces: [
        { id: '1', title: 'Trace 1', status: TraceStatus.UNASSOCIATED, createdAt: '2024-01-01', updatedAt: '2024-01-01', deletionDate: '2024-02-01' },
        { id: '2', title: 'Trace 2', status: TraceStatus.UNASSOCIATED, createdAt: '2024-01-02', updatedAt: '2024-01-02', deletionDate: '2024-02-02' },
        { id: '3', title: 'Trace 3', status: TraceStatus.UNASSOCIATED, createdAt: '2024-01-03', updatedAt: '2024-01-03', deletionDate: '2024-02-03' },
        { id: '4', title: 'Trace 4', status: TraceStatus.UNASSOCIATED, createdAt: '2024-01-04', updatedAt: '2024-01-04', deletionDate: '2024-02-04' }
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

  describe('given a student tools traces view container with trace data', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      vi.clearAllMocks()
      setActivePinia(createPinia())

      mockUseUnassignedTracesViewQuery(mockedTracesData)
      wrapper = mount(StudentToolsTracesViewContainer, {
        global: {
          plugins: [createPinia()],
          stubs: commonStubs
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render StudentToolsTracesViewNotice', () => {
        expect(wrapper.findComponent({ name: 'StudentToolsTracesViewNotice' }).exists()).toBe(true)
      })

      it('then it should render TracePageSizePicker', () => {
        expect(wrapper.findComponent({ name: 'TracePageSizePicker' }).exists()).toBe(true)
      })

      it('then it should render correct number of trace cards', () => {
        const traceCards = wrapper.findAllComponents({ name: 'StudentDetailedTraceCard' })
        expect(traceCards).toHaveLength(4)
      })

      it('then it should render both pagination components', () => {
        const paginations = wrapper.findAllComponents({ name: 'AvPagination' })
        expect(paginations).toHaveLength(2)
      })

      it('then it should render the correct structure', () => {
        const notice = wrapper.find('.student-tools-traces-view-notice-stub')
        const pageSizePicker = wrapper.find('.trace-page-size-picker-stub')
        const traceCards = wrapper.findAll('.student-detailed-trace-card-stub')
        const paginations = wrapper.findAll('.av-pagination-stub')

        expect(notice.exists()).toBe(true)
        expect(pageSizePicker.exists()).toBe(true)
        expect(traceCards).toHaveLength(4)
        expect(paginations).toHaveLength(2)
      })
    })

    describe('when pagination current page is updated', () => {
      it('then it should update the store current page', async () => {
        const store = useTracesStore()
        expect(store.currentPage).toBe(0)

        const pagination = wrapper.findComponent({ name: 'AvPagination' })
        await pagination.trigger('click')

        expect(store.currentPage).toBe(3)
      })
    })

    describe('when page size changes in store', () => {
      it('then it should reset current page to 0', async () => {
        const store = useTracesStore()

        store.currentPage = 2
        store.pageSizeSelected = 12

        await wrapper.vm.$nextTick()

        expect(store.currentPage).toBe(0)
      })
    })
  })

  describe('given a student tools traces view container with no trace data', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      vi.clearAllMocks()
      setActivePinia(createPinia())

      mockUseUnassignedTracesViewQuery(undefined)

      wrapper = mount(StudentToolsTracesViewContainer, {
        global: {
          plugins: [createPinia()],
          stubs: commonStubs
        }
      })
    })

    describe('when the component is mounted with undefined trace data', () => {
      it('then it should not render any trace cards', () => {
        const traceCards = wrapper.findAllComponents({ name: 'StudentDetailedTraceCard' })
        expect(traceCards).toHaveLength(0)
      })

      it('then it should still render other essential components', () => {
        expect(wrapper.findComponent({ name: 'StudentToolsTracesViewNotice' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'TracePageSizePicker' }).exists()).toBe(true)
        expect(wrapper.findAllComponents({ name: 'AvPagination' })).toHaveLength(2)
      })
    })
  })

  describe('given a student tools traces view container with empty trace data', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      vi.clearAllMocks()
      setActivePinia(createPinia())

      const emptyTracesData: TracesViewResponse = {
        data: {
          traces: [],
          criticalCount: 0
        },
        page: {
          number: 0,
          pageSize: 20,
          totalElements: 0,
          totalPages: 0
        }
      }

      mockUseUnassignedTracesViewQuery(emptyTracesData)
      wrapper = mount(StudentToolsTracesViewContainer, {
        global: {
          plugins: [createPinia()],
          stubs: commonStubs
        }
      })
    })

    describe('when the component is mounted with empty traces array', () => {
      it('then it should not render any trace cards', () => {
        const traceCards = wrapper.findAllComponents({ name: 'StudentDetailedTraceCard' })
        expect(traceCards).toHaveLength(0)
      })

      it('then it should still render pagination components', () => {
        const paginations = wrapper.findAllComponents({ name: 'AvPagination' })
        expect(paginations).toHaveLength(2)
      })

      it('then it should render notice and page size picker', () => {
        expect(wrapper.findComponent({ name: 'StudentToolsTracesViewNotice' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'TracePageSizePicker' }).exists()).toBe(true)
      })
    })
  })

  describe('given a student tools traces view container with no configuration', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      vi.clearAllMocks()
      setActivePinia(createPinia())

      mockUseUnassignedTracesViewQuery(mockedTracesData)

      wrapper = mount(StudentToolsTracesViewContainer, {
        global: {
          plugins: [createPinia()],
          stubs: commonStubs
        }
      })
    })

    describe('when the component is mounted with null configuration', () => {
      it('then it should still render all components correctly', () => {
        expect(wrapper.findComponent({ name: 'StudentToolsTracesViewNotice' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'TracePageSizePicker' }).exists()).toBe(true)
        expect(wrapper.findAllComponents({ name: 'StudentDetailedTraceCard' })).toHaveLength(4)
        expect(wrapper.findAllComponents({ name: 'AvPagination' })).toHaveLength(2)
      })
    })
  })
})
