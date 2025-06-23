import type { AmsViewResponse } from '@/api/avenir-esr'
import { AmsPageSizePicker } from '@/common/components'
import { createMockedAmsViewResponse, useAmsViewQuery } from '@/features/student/queries'
import StudentEducationAmsViewContainer from '@/features/student/views/StudentEducationAmsView/components/StudentEducationAmsViewContainer/StudentEducationAmsViewContainer.vue'
import { useAmsStore } from '@/store'
import { createMockedAmsViewQueryReturn } from 'tests/mocks'
import { mountWithRouter } from 'tests/utils'
import { describe, expect, it } from 'vitest'

vi.mock('@/features/student/queries', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/student/queries')>()

  return {
    ...actual,
    useAmsViewQuery: vi.fn(),
  }
})

const mockedUseAmsViewQuery = vi.mocked(useAmsViewQuery)

export function mockUseAmsViewQuery (payload: AmsViewResponse) {
  const mockReturn = createMockedAmsViewQueryReturn(payload, null)
  mockedUseAmsViewQuery.mockReturnValue(mockReturn)
}

export function mockUseAmsViewQueryUndefined () {
  const mockReturn = createMockedAmsViewQueryReturn(undefined, null)
  mockedUseAmsViewQuery.mockReturnValue(mockReturn)
}

describe('studentEducationAmsViewContainer', () => {
  const mockedData = createMockedAmsViewResponse(4, 20, 1)

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    mockUseAmsViewQuery(mockedData)
  })

  it('should render AmsPageSizePicker', async () => {
    const wrapper = await mountWithRouter(StudentEducationAmsViewContainer, {
      global: {
        plugins: [createPinia()]
      }
    })

    expect(wrapper.findComponent(AmsPageSizePicker).exists()).toBe(true)
  })

  it('should render correctly with mocked data', async () => {
    const wrapper = await mountWithRouter(StudentEducationAmsViewContainer, {
      global: {
        stubs: ['StudentDetailedAmsCard', 'AmsPageSizePicker', 'AvPagination']
      }
    })

    expect(wrapper.exists()).toBe(true)

    const cards = wrapper.findAllComponents({ name: 'StudentDetailedAmsCard' })
    expect(cards.length).toBe(4)
  })

  it('should update currentPage in store when onUpdateCurrentPage is called', async () => {
    const wrapper = await mountWithRouter(StudentEducationAmsViewContainer, {
      global: {
        plugins: [createPinia()]
      }
    })

    const store = useAmsStore()
    expect(store.currentPage).toBe(0)

    const pagination = wrapper.findComponent({ name: 'AvPagination' })
    await pagination.vm.$emit('update:current-page', 3)

    expect(store.currentPage).toBe(3)
  })

  it('should reset currentPage to 0 when pageSize changes', async () => {
    const wrapper = await mountWithRouter(StudentEducationAmsViewContainer, {
      global: {
        plugins: [createPinia()]
      }
    })

    const store = useAmsStore()

    store.currentPage = 2
    store.pageSizeSelected = 12

    await wrapper.vm.$nextTick()

    expect(store.currentPage).toBe(0)
  })

  it('should handle undefined query data', async () => {
    mockUseAmsViewQueryUndefined()

    const wrapper = await mountWithRouter(StudentEducationAmsViewContainer, {
      global: {
        plugins: [createPinia()]
      }
    })
    const cards = wrapper.findAllComponents({ name: 'StudentDetailedAmsCard' })
    expect(cards.length).toBe(0)
  })
})
