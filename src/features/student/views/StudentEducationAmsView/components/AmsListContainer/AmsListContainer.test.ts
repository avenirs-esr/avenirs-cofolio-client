import type { PagedResponseAmsViewDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { createMockedPagedResponseAmsViewDTO } from '@/__mocks__/fixtures/student'
import { useAmsViewQuery } from '@/features/student/queries'
import AmsListContainer from '@/features/student/views/StudentEducationAmsView/components/AmsListContainer/AmsListContainer.vue'
import { PageSizes } from '@/ui/config'
import { mountWithRouter } from '@/ui/tests/utils'
import { createMockedAmsViewQueryReturn } from 'tests/mocks'
import { createUsePaginationMock } from 'tests/mocks/mockUsePagination'
import { PaginationStub } from 'tests/stubs'
import { describe, expect, it, vi } from 'vitest'

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
    useAmsViewQuery: vi.fn(),
  }
})

const mockedUseAmsViewQuery = vi.mocked(useAmsViewQuery)

function mockUseAmsViewQuery (payload: PagedResponseAmsViewDTO | undefined) {
  const mockReturn = createMockedAmsViewQueryReturn(payload, null)
  mockedUseAmsViewQuery.mockReturnValue(mockReturn)
}

describe('amsListContainer', () => {
  const stubs = {
    ProgramProgressSelector: {
      name: 'ProgramProgressSelector',
      props: ['modelValue'],
      emits: ['update:modelValue'],
      template: '<div class="program-progress-selector-stub" />'
    },
    StudentDetailedAmsCard: {
      name: 'StudentDetailedAmsCard',
      props: ['ams'],
      template: '<div class="student-detailed-ams-card-stub" />'
    },
    Pagination: PaginationStub
  }

  const mockedAmsData = createMockedPagedResponseAmsViewDTO(4, 20, 1, 'program-1')

  describe('given the component has ams data', () => {
    let wrapper: VueWrapper

    beforeEach(async () => {
      vi.clearAllMocks()

      setActivePinia(createPinia())
      mockUseAmsViewQuery(mockedAmsData)

      paginationMock = createUsePaginationMock()

      wrapper = await mountWithRouter(AmsListContainer, {
        global: {
          plugins: [createPinia()],
          stubs
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render ProgramProgressSelector', () => {
        expect(wrapper.findComponent({ name: 'ProgramProgressSelector' }).exists()).toBe(true)
      })

      it('then it should render Pagination', () => {
        expect(wrapper.findComponent({ name: 'Pagination' }).exists()).toBe(true)
      })

      it('then it should render correct number of AMS cards', () => {
        const cards = wrapper.findAllComponents({ name: 'StudentDetailedAmsCard' })
        expect(cards).toHaveLength(4)
      })

      it('then ProgramProgressSelector should receive undefined as modelValue', () => {
        const selector = wrapper.findComponent({ name: 'ProgramProgressSelector' })
        expect(selector.props('modelValue')).toBeUndefined()
      })
    })
  })

  describe('given the component has no AMS data', () => {
    let wrapper: VueWrapper

    beforeEach(async () => {
      vi.clearAllMocks()
      setActivePinia(createPinia())
      mockUseAmsViewQuery(undefined)

      paginationMock = createUsePaginationMock()

      wrapper = await mountWithRouter(AmsListContainer, {
        global: {
          plugins: [createPinia()],
          stubs
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render ProgramProgressSelector', () => {
        expect(wrapper.findComponent({ name: 'ProgramProgressSelector' }).exists()).toBe(true)
      })

      it('then it should render Pagination', () => {
        expect(wrapper.findComponent({ name: 'Pagination' }).exists()).toBe(true)
      })

      it('then it should not render any AMS cards', () => {
        const cards = wrapper.findAllComponents({ name: 'StudentDetailedAmsCard' })
        expect(cards).toHaveLength(0)
      })
    })
  })

  describe('given the component loads successfully', () => {
    let wrapper: VueWrapper

    beforeEach(async () => {
      vi.clearAllMocks()
      setActivePinia(createPinia())
      mockUseAmsViewQuery(mockedAmsData)

      paginationMock = createUsePaginationMock()

      wrapper = await mountWithRouter(AmsListContainer, {
        global: {
          plugins: [createPinia()],
          stubs
        }
      })
    })

    describe('when a program is selected via v-model', () => {
      beforeEach(async () => {
        const selector = wrapper.findComponent({ name: 'ProgramProgressSelector' })
        await selector.vm.$emit('update:modelValue', 'program-2')
        await wrapper.vm.$nextTick()
      })

      it('then ProgramProgressSelector should receive the updated value', () => {
        const selector = wrapper.findComponent({ name: 'ProgramProgressSelector' })
        expect(selector.props('modelValue')).toBe('program-2')
      })

      it('then useAmsViewQuery should be called with the selected program ID', () => {
        expect(mockedUseAmsViewQuery).toHaveBeenCalledWith(
          expect.objectContaining({ value: 'program-2' }),
          expect.any(Object),
          expect.any(Object)
        )
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
  })
})
