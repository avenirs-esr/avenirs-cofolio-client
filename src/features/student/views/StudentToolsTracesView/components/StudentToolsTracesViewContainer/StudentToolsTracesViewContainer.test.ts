import type { TraceConfigurationInfo, TracesViewResponse, UnassociatedTracesSummaryDTO } from '@/api/avenir-esr'
import { TracePageSizePicker } from '@/common/components'
import {
  createMockedTracesViewResponse,
  useStudentTracesConfigurationQuery,
  useUnassignedTracesSummaryQuery,
  useUnassignedTracesViewQuery
} from '@/features/student/queries'
import StudentToolsTracesViewContainer from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesViewContainer/StudentToolsTracesViewContainer.vue'
import { useTracesStore } from '@/store'
import { mount } from '@vue/test-utils'
import { createMockedTracesViewQueryReturn } from 'tests/mocks'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/features/student/queries', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/student/queries')>()

  return {
    ...actual,
    useUnassignedTracesViewQuery: vi.fn(),
    useStudentTracesConfigurationQuery: vi.fn(),
    useUnassignedTracesSummaryQuery: vi.fn(),
  }
})

const mockedUseUnassignedTracesViewQuery = vi.mocked(useUnassignedTracesViewQuery)

export function mockUseUnassignedTracesViewQuery (payload: TracesViewResponse) {
  const mockReturn = createMockedTracesViewQueryReturn(payload, null)
  mockedUseUnassignedTracesViewQuery.mockReturnValue(mockReturn)
}

export function mockUseUnassignedTracesViewQueryUndefined () {
  const mockReturn = createMockedTracesViewQueryReturn(undefined, null)
  mockedUseUnassignedTracesViewQuery.mockReturnValue(mockReturn)
}

const mockedUseUnassignedTracesSummaryQuery = vi.mocked(useUnassignedTracesSummaryQuery)

export function mockUseUnassignedTracesSummaryQuery (payload: UnassociatedTracesSummaryDTO) {
  const mockData = ref(payload)
  const queryMockedData = {
    data: mockData,
  } as unknown as ReturnType<typeof useUnassignedTracesSummaryQuery>
  mockedUseUnassignedTracesSummaryQuery.mockReturnValue(queryMockedData)
}

const mockedUseStudentTracesConfigurationQuery = vi.mocked(useStudentTracesConfigurationQuery)

function mockUseStudentTracesConfigurationQuery (payload: TraceConfigurationInfo | null) {
  const mockData = ref(payload)
  const queryMockedData = {
    data: mockData,
  } as unknown as ReturnType<typeof useStudentTracesConfigurationQuery>
  mockedUseStudentTracesConfigurationQuery.mockReturnValue(queryMockedData)
}

describe('studentToolsTracesViewContainer', () => {
  const mockedData = createMockedTracesViewResponse(4, 20, 1)

  const mockedTracesConfiguration = {
    maxDayRemaining: 30,
    maxDayRemainingWarning: 15,
    maxDayRemainingCritical: 7
  }

  const mockedUnassignedTracesSummary = {
    total: 15,
    totalWarnings: 5,
    totalCriticals: 3
  }

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    mockUseUnassignedTracesViewQuery(mockedData)
    mockUseStudentTracesConfigurationQuery(mockedTracesConfiguration)
    mockUseUnassignedTracesSummaryQuery(mockedUnassignedTracesSummary)
  })

  it('should render TracePageSizePicker', () => {
    const wrapper = mount(StudentToolsTracesViewContainer, {
      global: {
        plugins: [createPinia()]
      }
    })

    expect(wrapper.findComponent(TracePageSizePicker).exists()).toBe(true)
  })

  it('should render correctly with mocked data', async () => {
    const wrapper = mount(StudentToolsTracesViewContainer, {
      global: {
        stubs: ['StudentDetailedTraceCard', 'TracePageSizePicker', 'AvPagination']
      }
    })

    expect(wrapper.exists()).toBe(true)

    const cards = wrapper.findAllComponents({ name: 'StudentDetailedTraceCard' })
    expect(cards.length).toBe(4)
  })

  it('should update currentPage in store when onUpdateCurrentPage is called', async () => {
    const wrapper = mount(StudentToolsTracesViewContainer, {
      global: {
        plugins: [createPinia()]
      }
    })

    const store = useTracesStore()
    expect(store.currentPage).toBe(0)

    const pagination = wrapper.findComponent({ name: 'AvPagination' })
    await pagination.vm.$emit('update:current-page', 3)

    expect(store.currentPage).toBe(3)
  })

  it('should reset currentPage to 0 when pageSize changes', async () => {
    const wrapper = mount(StudentToolsTracesViewContainer, {
      global: {
        plugins: [createPinia()]
      }
    })

    const store = useTracesStore()

    store.currentPage = 2
    store.pageSizeSelected = 12

    await wrapper.vm.$nextTick()

    expect(store.currentPage).toBe(0)
  })

  it('should handle undefined query data', () => {
    mockUseUnassignedTracesViewQueryUndefined()

    const wrapper = mount(StudentToolsTracesViewContainer, {
      global: {
        plugins: [createPinia()]
      }
    })
    const cards = wrapper.findAllComponents({ name: 'StudentDetailedTraceCard' })
    expect(cards.length).toBe(0)
  })

  it('should notice component with correct props', () => {
    const wrapper = mount(StudentToolsTracesViewContainer, {
      global: {
        stubs: ['StudentToolsTracesViewNotice']
      }
    })

    const notice = wrapper.findComponent({ name: 'StudentToolsTracesViewNotice' })
    expect(notice.exists()).toBe(true)
  })
})
