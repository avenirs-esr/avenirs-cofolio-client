import type { TracesViewResponse } from '@/api/avenir-esr'
import { TracePageSizePicker } from '@/common/components'
import { createMockedTracesViewResponse, useUnassignedTracesViewQuery } from '@/features/student/queries'
import { useTracesStore } from '@/store'
import { mount } from '@vue/test-utils'
import { createMockedTracesViewQueryReturn } from 'tests/mocks'
import { describe, expect, it } from 'vitest'
import StudentToolsTracesViewContainer from './StudentToolsTracesViewContainer.vue'

vi.mock('@/features/student/queries', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/student/queries')>()

  return {
    ...actual,
    useUnassignedTracesViewQuery: vi.fn(),
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

describe('studentToolsTracesViewContainer', () => {
  const mockedData = createMockedTracesViewResponse(4, 20, 1)

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    mockUseUnassignedTracesViewQuery(mockedData)
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
})
