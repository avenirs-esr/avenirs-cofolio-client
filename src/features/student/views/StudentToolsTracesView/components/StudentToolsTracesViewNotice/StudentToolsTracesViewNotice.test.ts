import type { TraceConfigurationInfo, UnassociatedTracesSummaryDTO } from '@/api/avenir-esr'
import { useTracesConfigurationQuery, useUnassignedTracesSummaryQuery } from '@/features/student/queries'
import StudentToolsTracesViewNotice from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesViewNotice/StudentToolsTracesViewNotice.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

vi.mock('@/features/student/queries', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/student/queries')>()

  return {
    ...actual,
    useTracesConfigurationQuery: vi.fn(),
    useUnassignedTracesSummaryQuery: vi.fn(),
  }
})

const mockedUseTracesConfigurationQuery = vi.mocked(useTracesConfigurationQuery)
const mockedUseUnassignedTracesSummaryQuery = vi.mocked(useUnassignedTracesSummaryQuery)

function mockUseTracesConfigurationQuery (payload: TraceConfigurationInfo | null) {
  const mockData = ref(payload)
  const queryMockedData = {
    data: mockData,
    error: ref(null),
    isLoading: ref(false),
    isSuccess: ref(true)
  } as ReturnType<typeof useTracesConfigurationQuery>
  mockedUseTracesConfigurationQuery.mockReturnValue(queryMockedData)
}

function mockUseUnassignedTracesSummaryQuery (payload: UnassociatedTracesSummaryDTO) {
  const mockData = ref(payload)
  const queryMockedData = {
    data: mockData,
    error: ref(null),
    isLoading: ref(false),
    isSuccess: ref(true)
  } as ReturnType<typeof useUnassignedTracesSummaryQuery>
  mockedUseUnassignedTracesSummaryQuery.mockReturnValue(queryMockedData)
}

const commonStubs = {
  AvNotice: {
    name: 'AvNotice',
    props: ['text', 'type'],
    template: '<div class="av-notice-stub" :data-type="type" :data-text="text" />'
  }
}

describe('studentToolsTracesViewNotice', () => {
  const mockedTracesConfiguration: TraceConfigurationInfo = {
    maxDayRemaining: 30,
    maxDayRemainingWarning: 15,
    maxDayRemainingCritical: 7
  }

  const mockedUnassignedTracesSummary: UnassociatedTracesSummaryDTO = {
    total: 15,
    totalWarnings: 5,
    totalCriticals: 3
  }

  describe('given a student tools traces view notice component', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      vi.clearAllMocks()
      mockUseTracesConfigurationQuery(mockedTracesConfiguration)
      mockUseUnassignedTracesSummaryQuery(mockedUnassignedTracesSummary)

      wrapper = mount(StudentToolsTracesViewNotice, {
        global: {
          stubs: commonStubs
        }
      })
    })

    describe('when the component is mounted with unassociated traces', () => {
      it('then it should display AvNotice with correct warning type', async () => {
        await nextTick()

        const notice = wrapper.findComponent({ name: 'AvNotice' })
        expect(notice.exists()).toBe(true)
        expect(notice.props('type')).toBe('warning')
      })

      it('then it should display correct message with traces count and reminder', async () => {
        await nextTick()

        const notice = wrapper.findComponent({ name: 'AvNotice' })
        expect(notice.props('text')).toContain('traces non associées')
        expect(notice.props('text')).toContain('Pour rappel')
      })

      it('then it should render the notice container structure', () => {
        const container = wrapper.find('.traces-notice-container')
        expect(container.exists()).toBe(true)
      })
    })
  })

  describe('given a student tools traces view notice component with no configuration', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      vi.clearAllMocks()
      mockUseTracesConfigurationQuery(null)
      mockUseUnassignedTracesSummaryQuery(mockedUnassignedTracesSummary)

      wrapper = mount(StudentToolsTracesViewNotice, {
        global: {
          stubs: commonStubs
        }
      })
    })

    describe('when the component is mounted without configuration', () => {
      it('then it should display alert without reminder message', async () => {
        await nextTick()

        const notice = wrapper.findComponent({ name: 'AvNotice' })
        expect(notice.exists()).toBe(true)
        expect(notice.props('type')).toBe('warning')
        expect(notice.props('text')).toContain('traces non associées')
        expect(notice.props('text')).not.toContain('Pour rappel')
      })
    })
  })

  describe('given a student tools traces view notice component with no unassociated traces', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      vi.clearAllMocks()
      mockUseTracesConfigurationQuery(mockedTracesConfiguration)
      mockUseUnassignedTracesSummaryQuery({
        total: 0,
        totalWarnings: 0,
        totalCriticals: 0
      })

      wrapper = mount(StudentToolsTracesViewNotice, {
        global: {
          stubs: commonStubs
        }
      })
    })

    describe('when the component is mounted with no unassociated traces', () => {
      it('then it should not display any notice', async () => {
        await nextTick()

        const notice = wrapper.findComponent({ name: 'AvNotice' })
        expect(notice.exists()).toBe(false)
      })

      it('then it should not render the notice container', () => {
        const container = wrapper.find('.traces-notice-container')
        expect(container.exists()).toBe(false)
      })
    })
  })

  describe('given a student tools traces view notice component with single critical trace', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      vi.clearAllMocks()
      mockUseTracesConfigurationQuery({
        maxDayRemaining: 30,
        maxDayRemainingWarning: 7,
        maxDayRemainingCritical: 1
      })
      mockUseUnassignedTracesSummaryQuery({
        total: 1,
        totalWarnings: 0,
        totalCriticals: 1
      })

      wrapper = mount(StudentToolsTracesViewNotice, {
        global: {
          stubs: commonStubs
        }
      })
    })

    describe('when the component is mounted with one critical trace', () => {
      it('then it should display correct singular message', async () => {
        await nextTick()

        const notice = wrapper.findComponent({ name: 'AvNotice' })
        expect(notice.exists()).toBe(true)
        expect(notice.props('type')).toBe('warning')
        expect(notice.props('text')).toContain('Vous avez une trace non associée')
        expect(notice.props('text')).toContain('Attention, la trace sera supprimée demain')
        expect(notice.props('text')).toContain('Pour rappel')
      })
    })
  })

  describe('given a student tools traces view notice component with multiple critical traces', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      vi.clearAllMocks()
      mockUseTracesConfigurationQuery({
        maxDayRemaining: 30,
        maxDayRemainingWarning: 15,
        maxDayRemainingCritical: 3
      })
      mockUseUnassignedTracesSummaryQuery({
        total: 10,
        totalWarnings: 5,
        totalCriticals: 5
      })

      wrapper = mount(StudentToolsTracesViewNotice, {
        global: {
          stubs: commonStubs
        }
      })
    })

    describe('when the component is mounted with multiple critical traces', () => {
      it('then it should display correct plural message', async () => {
        await nextTick()

        const notice = wrapper.findComponent({ name: 'AvNotice' })
        expect(notice.exists()).toBe(true)
        expect(notice.props('type')).toBe('warning')
        expect(notice.props('text')).toContain('traces non associées')
        expect(notice.props('text')).toContain('seront supprimées')
        expect(notice.props('text')).toContain('Pour rappel')
      })
    })
  })
})
