import type { TracesViewResponse } from '@/api/avenir-esr'
import {
  useUnassignedTracesViewQuery
} from '@/features/student/queries'
import { createMockedTracesViewResponse } from '@/features/student/queries/fixtures'
import { useTracesStore } from '@/store'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMockedTracesViewQueryReturn } from 'tests/mocks'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import StudentToolsTracesViewContainer from './StudentToolsTracesViewContainer.vue'

vi.mock('@/features/student/queries', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/student/queries')>()

  return {
    ...actual,
    useUnassignedTracesViewQuery: vi.fn(),
  }
})

const mockedUseUnassignedTracesViewQuery = vi.mocked(useUnassignedTracesViewQuery)

function mockUseUnassignedTracesViewQuery (payload: TracesViewResponse | undefined) {
  const mockReturn = createMockedTracesViewQueryReturn(payload, null)
  mockedUseUnassignedTracesViewQuery.mockReturnValue(mockReturn)
}

describe('studentToolsTracesViewContainer', () => {
  const stubs = {
    StudentToolsTracesViewNotice: {
      name: 'StudentToolsTracesViewNotice',
      template: '<div data-testid="student-tools-traces-view-notice" />',
      props: ['traces', 'tracesConfig']
    },
    TracePageSizePicker: {
      name: 'TracePageSizePicker',
      template: '<div data-testid="trace-page-size-picker" />',
      emits: ['update:page-size']
    },
    AvPagination: {
      name: 'AvPagination',
      template: '<div data-testid="av-pagination" />',
      props: ['currentPage', 'totalPages'],
      emits: ['update:current-page']
    },
    StudentDetailedTraceCard: {
      name: 'StudentDetailedTraceCard',
      template: '<div data-testid="student-detailed-trace-card" />',
      props: ['trace', 'traceConfiguration']
    }
  }

  const mockedTracesViewResponse = createMockedTracesViewResponse(4, 20, 1)

  describe('given traces data is available', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      setActivePinia(createPinia())
      mockUseUnassignedTracesViewQuery(mockedTracesViewResponse)
    })

    describe('when component is mounted', () => {
      let wrapper: VueWrapper

      beforeEach(() => {
        wrapper = mount(StudentToolsTracesViewContainer, {
          global: {
            plugins: [createPinia()],
            stubs
          }
        })
      })

      it('then should render StudentToolsTracesViewNotice component', () => {
        const notice = wrapper.find('[data-testid="student-tools-traces-view-notice"]')
        expect(notice.exists()).toBe(true)
      })

      it('then should render TracePageSizePicker component', () => {
        const tracePageSizePicker = wrapper.find('[data-testid="trace-page-size-picker"]')
        expect(tracePageSizePicker.exists()).toBe(true)
      })

      it('then should render correct number of StudentDetailedTraceCard components', () => {
        const traceCards = wrapper.findAll('[data-testid="student-detailed-trace-card"]')
        expect(traceCards).toHaveLength(4)
      })

      it('then should render AvPagination component', () => {
        const pagination = wrapper.find('[data-testid="av-pagination"]')
        expect(pagination.exists()).toBe(true)
      })
    })

    describe('when pagination current page is updated', () => {
      let wrapper: VueWrapper
      let store: ReturnType<typeof useTracesStore>

      beforeEach(() => {
        wrapper = mount(StudentToolsTracesViewContainer, {
          global: {
            plugins: [createPinia()],
            stubs
          }
        })
        store = useTracesStore()
      })

      it('then should update currentPage in store', async () => {
        expect(store.currentPage).toBe(0)

        const pagination = wrapper.findComponent({ name: 'AvPagination' })
        await pagination.vm.$emit('update:current-page', 3)

        expect(store.currentPage).toBe(3)
      })
    })
  })

  describe('given no traces data is available', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      setActivePinia(createPinia())
      mockUseUnassignedTracesViewQuery(undefined)
    })

    describe('when component is mounted', () => {
      let wrapper: VueWrapper

      beforeEach(() => {
        wrapper = mount(StudentToolsTracesViewContainer, {
          global: {
            plugins: [createPinia()],
            stubs
          }
        })
      })

      it('then should not render any StudentDetailedTraceCard components', () => {
        const traceCards = wrapper.findAll('[data-testid="student-detailed-trace-card"]')
        expect(traceCards).toHaveLength(0)
      })

      it('then should still render StudentToolsTracesViewNotice component', () => {
        const notice = wrapper.find('[data-testid="student-tools-traces-view-notice"]')
        expect(notice.exists()).toBe(true)
      })
    })
  })
})
