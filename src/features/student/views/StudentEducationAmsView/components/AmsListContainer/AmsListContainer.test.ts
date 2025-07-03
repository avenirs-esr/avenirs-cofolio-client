import type { AmsViewResponse } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { createMockedAmsViewResponse } from '@/__mocks__/fixtures/student'
import { useAmsViewQuery } from '@/features/student/queries'
import AmsListContainer from '@/features/student/views/StudentEducationAmsView/components/AmsListContainer/AmsListContainer.vue'
import { useAmsStore } from '@/store'
import { mountWithRouter } from '@/ui/tests/utils'
import { createMockedAmsViewQueryReturn } from 'tests/mocks'
import { describe, expect, it } from 'vitest'

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
    AmsPageSizePicker: {
      name: 'AmsPageSizePicker',
      template: '<div class="ams-page-size-picker-stub" />'
    },
    AvPagination: {
      name: 'AvPagination',
      props: ['id', 'currentPage', 'pages', 'ariaLabel', 'compact', 'items'],
      emits: ['update:current-page'],
      template: '<div class="av-pagination-stub" />'
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

      it('then it should render AmsPageSizePicker', () => {
        expect(wrapper.findComponent({ name: 'AmsPageSizePicker' }).exists()).toBe(true)
      })

      it('then it should render correct number of AMS cards', () => {
        const cards = wrapper.findAllComponents({ name: 'StudentDetailedAmsCard' })
        expect(cards).toHaveLength(4)
      })

      it('then it should render both pagination components', () => {
        const paginations = wrapper.findAllComponents({ name: 'AvPagination' })
        expect(paginations).toHaveLength(2)
      })

      it('then ProgramProgressSelector should receive undefined as initial modelValue', () => {
        const programSelector = wrapper.findComponent({ name: 'ProgramProgressSelector' })
        expect(programSelector.props('modelValue')).toBeUndefined()
      })
    })

    describe('when a pagination update is triggered', () => {
      beforeEach(async () => {
        const topPagination = wrapper.findAllComponents({ name: 'AvPagination' })[0]
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
      mockUseAmsViewQuery(undefined)

      wrapper = await mountWithRouter(AmsListContainer, {
        global: {
          plugins: [createPinia()],
          stubs
        }
      })
    })

    describe('when the component is mounted with undefined AMS data', () => {
      it('then it should not render any AMS cards', () => {
        const cards = wrapper.findAllComponents({ name: 'StudentDetailedAmsCard' })
        expect(cards).toHaveLength(0)
      })

      it('then it should still render the pagination components', () => {
        const paginations = wrapper.findAllComponents({ name: 'AvPagination' })
        expect(paginations).toHaveLength(2)
      })

      it('then it should still render ProgramProgressSelector', () => {
        expect(wrapper.findComponent({ name: 'ProgramProgressSelector' }).exists()).toBe(true)
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

    describe('when a program is selected through v-model', () => {
      beforeEach(async () => {
        const programSelector = wrapper.findComponent({ name: 'ProgramProgressSelector' })
        await programSelector.vm.$emit('update:modelValue', 'program-2')
        await wrapper.vm.$nextTick()
      })

      it('then the selectedProgramProgressId should be updated', () => {
        const programSelector = wrapper.findComponent({ name: 'ProgramProgressSelector' })
        expect(programSelector.props('modelValue')).toBe('program-2')
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
})
