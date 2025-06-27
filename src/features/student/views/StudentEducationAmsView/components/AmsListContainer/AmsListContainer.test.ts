import type { AmsViewResponse, ProgramProgressDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import type { VueWrapper } from '@vue/test-utils'
import type { Ref } from 'vue'
import { AmsPageSizePicker } from '@/common/components'
import { useAllMyProgramProgressQuery, useAmsViewQuery } from '@/features/student/queries'
import { createMockedAmsViewResponse } from '@/features/student/queries/fixtures'
import AmsListContainer from '@/features/student/views/StudentEducationAmsView/components/AmsListContainer/AmsListContainer.vue'
import ProgramProgressSelector from '@/features/student/views/StudentEducationAmsView/components/ProgramProgressSelector/ProgramProgressSelector.vue'
import { useAmsStore } from '@/store'
import { AvPagination } from '@/ui'
import { createMockedAmsViewQueryReturn } from 'tests/mocks'
import { mountWithRouter } from 'tests/utils'
import { describe, expect, it } from 'vitest'

vi.mock('@/features/student/queries', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/student/queries')>()

  return {
    ...actual,
    useAmsViewQuery: vi.fn(),
    useAllMyProgramProgressQuery: vi.fn(),
  }
})

const mockedUseAmsViewQuery = vi.mocked(useAmsViewQuery)
const mockedUseAllMyProgramProgressQuery = vi.mocked(useAllMyProgramProgressQuery)

function mockUseAmsViewQuery (payload: AmsViewResponse | undefined) {
  const mockReturn = createMockedAmsViewQueryReturn(payload, null)
  mockedUseAmsViewQuery.mockReturnValue(mockReturn)
}

function mockUseAllMyProgramProgressQuery (payload: ProgramProgressDTO[]) {
  const mockData: Ref<ProgramProgressDTO[]> = ref(payload)
  const mockError: Ref<null> = ref(null)
  const mockReturn = {
    data: mockData,
    error: mockError,
    isFetched: ref(true),
    isLoading: ref(false),
    isSuccess: ref(true),
  } as unknown as UseQueryReturnType<ProgramProgressDTO[], BaseApiException>
  mockedUseAllMyProgramProgressQuery.mockReturnValue(mockReturn)
}

describe('amsListContainer', () => {
  const mockedPrograms: ProgramProgressDTO[] = [
    { id: 'program-1', name: 'Program 1' },
    { id: 'program-2', name: 'Program 2' },
    { id: 'program-3', name: 'Program 3' },
  ]

  const mockedAmsData = createMockedAmsViewResponse(4, 20, 1, 'program-1')

  describe('given the component has program data and ams data', () => {
    let wrapper: VueWrapper

    beforeEach(async () => {
      vi.clearAllMocks()
      setActivePinia(createPinia())
      mockUseAllMyProgramProgressQuery(mockedPrograms)
      mockUseAmsViewQuery(mockedAmsData)

      wrapper = await mountWithRouter(AmsListContainer, {
        global: {
          plugins: [createPinia()],
          stubs: {
            StudentDetailedAmsCard: { name: 'StudentDetailedAmsCard', template: '<div class="student-detailed-ams-card" />' },
            ProgramProgressSelector: { name: 'ProgramProgressSelector', template: '<div class="program-progress-selector" />' },
          }
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render ProgramProgressSelector', () => {
        expect(wrapper.findComponent(ProgramProgressSelector).exists()).toBe(true)
      })

      it('then it should render AmsPageSizePicker', () => {
        expect(wrapper.findComponent(AmsPageSizePicker).exists()).toBe(true)
      })

      it('then it should render correct number of AMS cards', () => {
        const cards = wrapper.findAllComponents({ name: 'StudentDetailedAmsCard' })
        expect(cards).toHaveLength(4)
      })

      it('then it should render both pagination components', () => {
        const paginations = wrapper.findAllComponents(AvPagination)
        expect(paginations).toHaveLength(2)
        expect(paginations[0].attributes('id')).toBe('top-pagination')
        expect(paginations[1].attributes('id')).toBe('bottom-pagination')
      })
    })

    describe('when a pagination update is triggered', () => {
      beforeEach(async () => {
        const topPagination = wrapper.findAllComponents(AvPagination)[0]
        await topPagination.vm.$emit('update:current-page', 3)
      })

      it('then the store currentPage should be updated', () => {
        const store = useAmsStore()
        expect(store.currentPage).toBe(3)
      })
    })

    describe('when the page size changes', () => {
      beforeEach(async () => {
        const store = useAmsStore()
        store.currentPage = 2
        store.pageSizeSelected = 12
        await wrapper.vm.$nextTick()
      })

      it('then the current page should reset to 0', () => {
        const store = useAmsStore()
        expect(store.currentPage).toBe(0)
      })
    })
  })

  describe('given the component has no AMS data', () => {
    let wrapper: VueWrapper

    beforeEach(async () => {
      vi.clearAllMocks()
      setActivePinia(createPinia())
      mockUseAllMyProgramProgressQuery(mockedPrograms)
      mockUseAmsViewQuery(undefined)

      wrapper = await mountWithRouter(AmsListContainer, {
        global: {
          plugins: [createPinia()],
          stubs: {
            StudentDetailedAmsCard: { name: 'StudentDetailedAmsCard', template: '<div class="student-detailed-ams-card" />' },
          }
        }
      })
    })

    describe('when the component is mounted with undefined AMS data', () => {
      it('then it should not render any AMS cards', () => {
        const cards = wrapper.findAllComponents({ name: 'StudentDetailedAmsCard' })
        expect(cards).toHaveLength(0)
      })

      it('then it should still render the pagination components', () => {
        const paginations = wrapper.findAllComponents(AvPagination)
        expect(paginations).toHaveLength(2)
      })
    })
  })

  describe('given the component has no program data', () => {
    let wrapper: VueWrapper

    beforeEach(async () => {
      vi.clearAllMocks()
      setActivePinia(createPinia())
      mockUseAllMyProgramProgressQuery([])
      mockUseAmsViewQuery(undefined)

      wrapper = await mountWithRouter(AmsListContainer, {
        global: {
          plugins: [createPinia()],
        }
      })
    })

    describe('when the component is mounted with no programs', () => {
      it('then it should not render ProgramProgressSelector', () => {
        expect(wrapper.findComponent(ProgramProgressSelector).exists()).toBe(false)
      })

      it('then it should still render other components', () => {
        expect(wrapper.findComponent(AmsPageSizePicker).exists()).toBe(true)
        expect(wrapper.findAllComponents(AvPagination)).toHaveLength(2)
      })
    })
  })

  describe('given the component loads successfully', () => {
    let wrapper: VueWrapper

    beforeEach(async () => {
      vi.clearAllMocks()
      setActivePinia(createPinia())
      mockUseAllMyProgramProgressQuery(mockedPrograms)
      mockUseAmsViewQuery(mockedAmsData)

      wrapper = await mountWithRouter(AmsListContainer, {
        global: {
          plugins: [createPinia()],
        }
      })
    })

    describe('when a program is selected', () => {
      beforeEach(async () => {
        const programSelector = wrapper.findComponent(ProgramProgressSelector)
        await programSelector.vm.$emit('programSelected', mockedPrograms[1])
      })

      it('then the current page should reset to 0', () => {
        const store = useAmsStore()
        expect(store.currentPage).toBe(0)
      })
    })
  })
})
