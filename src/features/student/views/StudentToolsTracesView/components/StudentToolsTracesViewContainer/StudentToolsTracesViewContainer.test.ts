import type { TracesViewResponse } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryDefinedReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { TracePageSizePicker } from '@/common/components'
import { createMockedTracesViewResponse, useTracesViewQuery } from '@/features/student/queries'
import { useTracePageSizePicker, useTracePagination } from '@/store'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import StudentToolsTracesViewContainer from './StudentToolsTracesViewContainer.vue'

vi.mock('@/features/student/queries', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/student/queries')>()

  return {
    ...actual,
    useTracesViewQuery: vi.fn(),
  }
})

const mockedUseTracesViewQuery = vi.mocked(useTracesViewQuery)

function mockUseTracesViewQuery (payload: TracesViewResponse) {
  const mockData: Ref<TracesViewResponse> = ref(payload)
  const mockError: Ref<null | null> = ref(null)
  const queryMockedData = {
    data: mockData,
    error: mockError
  } as unknown as UseQueryDefinedReturnType<TracesViewResponse, BaseApiException>
  mockedUseTracesViewQuery.mockReturnValue(queryMockedData)
}

function mockUseTracesViewQueryUndefined () {
  const mockData: Ref<TracesViewResponse | undefined> = ref(undefined)
  const mockError: Ref<null | null> = ref(null)
  const queryMockedData = {
    data: mockData,
    error: mockError
  } as unknown as UseQueryDefinedReturnType<TracesViewResponse, BaseApiException>
  mockedUseTracesViewQuery.mockReturnValue(queryMockedData)
}

describe('studentToolsTracesViewContainer', () => {
  const mockedData = createMockedTracesViewResponse(4, 20, 1)

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    mockUseTracesViewQuery(mockedData)
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

    const tracePaginationStore = useTracePagination()
    expect(tracePaginationStore.currentPage).toBe(0)

    const pagination = wrapper.findComponent({ name: 'AvPagination' })
    await pagination.vm.$emit('update:current-page', 3)

    expect(tracePaginationStore.currentPage).toBe(3)
  })

  it('should reset currentPage to 0 when pageSize changes', async () => {
    const wrapper = mount(StudentToolsTracesViewContainer, {
      global: {
        plugins: [createPinia()]
      }
    })

    const pageSizeStore = useTracePageSizePicker()
    const tracePaginationStore = useTracePagination()

    tracePaginationStore.currentPage = 2
    pageSizeStore.pageSize = 12

    await wrapper.vm.$nextTick()

    expect(tracePaginationStore.currentPage).toBe(0)
  })

  it('should handle undefined query data', () => {
    mockUseTracesViewQueryUndefined()

    const wrapper = mount(StudentToolsTracesViewContainer, {
      global: {
        plugins: [createPinia()]
      }
    })
    const cards = wrapper.findAllComponents({ name: 'StudentDetailedTraceCard' })
    expect(cards.length).toBe(0)
  })
})
