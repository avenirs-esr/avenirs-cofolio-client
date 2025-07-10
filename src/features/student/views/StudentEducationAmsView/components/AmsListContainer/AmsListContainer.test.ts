import type { AmsViewResponse } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { createMockedAmsViewResponse } from '@/__mocks__/fixtures/student'
import { useAmsViewQuery } from '@/features/student/queries'
import AmsListContainer from '@/features/student/views/StudentEducationAmsView/components/AmsListContainer/AmsListContainer.vue'
import { useAmsStore } from '@/store'
import { mountWithRouter } from '@/ui/tests/utils'
import { createMockedAmsViewQueryReturn } from 'tests/mocks'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/features/student/queries', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/student/queries')>()
  return {
    ...actual,
    useAmsViewQuery: vi.fn(),
  }
})

const mockedUseAmsViewQuery = vi.mocked(useAmsViewQuery)

function mockUseAmsViewQuery (payload: AmsViewResponse | undefined) {
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
    Pagination: {
      name: 'Pagination',
      props: ['pageInfo', 'pageSizeSelected', 'onUpdateCurrentPage', 'onUpdatePageSize'],
      template: `
        <div class="pagination-stub">
          <button class="emit-current-page" @click="onUpdateCurrentPage(5)">Set Page 5</button>
          <button class="emit-page-size" @click="onUpdatePageSize(50)">Set Page Size 50</button>
          <slot />
        </div>
      `
    }
  }

  const mockedAmsData = createMockedAmsViewResponse(4, 20, 1, 'program-1')

  describe('given the component has ams data', () => {
    let wrapper: VueWrapper

    beforeEach(async () => {
      vi.clearAllMocks()
      setActivePinia(createPinia())
      mockUseAmsViewQuery(mockedAmsData)

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
      mockUseAmsViewQuery(undefined)

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
  })

  describe('given the Pagination emits update events', () => {
    let wrapper: VueWrapper

    beforeEach(async () => {
      vi.clearAllMocks()
      setActivePinia(createPinia())
      mockUseAmsViewQuery(mockedAmsData)

      wrapper = await mountWithRouter(AmsListContainer, {
        global: {
          plugins: [createPinia()],
          stubs
        }
      })
    })

    describe('when Pagination calls onUpdateCurrentPage', () => {
      beforeEach(async () => {
        await wrapper.find('.emit-current-page').trigger('click')
      })

      it('then it should update the store currentPage', () => {
        const store = useAmsStore()
        expect(store.currentPage).toBe(5)
      })
    })

    describe('when Pagination calls onUpdatePageSize', () => {
      beforeEach(async () => {
        const store = useAmsStore()
        store.currentPage = 2
        await wrapper.find('.emit-page-size').trigger('click')
      })

      it('then it should update the store pageSizeSelected', () => {
        const store = useAmsStore()
        expect(store.pageSizeSelected).toBe(50)
      })

      it('then it should reset currentPage to 0', () => {
        const store = useAmsStore()
        expect(store.currentPage).toBe(0)
      })
    })
  })
})
