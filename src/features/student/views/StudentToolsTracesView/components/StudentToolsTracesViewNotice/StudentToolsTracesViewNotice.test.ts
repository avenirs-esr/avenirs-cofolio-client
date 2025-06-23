import type { TraceConfigurationInfo, UnassociatedTracesSummaryDTO } from '@/api/avenir-esr'
import { useStudentTracesConfigurationQuery, useUnassignedTracesSummaryQuery } from '@/features/student/queries'
import StudentToolsTracesViewNotice from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesViewNotice/StudentToolsTracesViewNotice.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

vi.mock('@/features/student/queries', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/student/queries')>()

  return {
    ...actual,
    useStudentTracesConfigurationQuery: vi.fn(),
    useUnassignedTracesSummaryQuery: vi.fn(),
  }
})

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

describe('studentToolsTracesViewNotice', () => {
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

  const stubs = {
    AvNotice: {
      name: 'AvNotice',
      template: `<div class="av-notice" v-bind="$attrs"><slot /></div>`,
      props: ['text', 'type'],
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseStudentTracesConfigurationQuery(mockedTracesConfiguration)
    mockUseUnassignedTracesSummaryQuery(mockedUnassignedTracesSummary)
  })

  it('displays an alert with the correct parameters if unassociated traces are present', async () => {
    const wrapper = mount(StudentToolsTracesViewNotice, {
      global: {
        stubs
      }
    })

    await nextTick()

    const notice = wrapper.findComponent({ name: 'AvNotice' })
    expect(notice.exists()).toBe(true)
    expect(notice.props('type')).toBe('warning')
    expect(notice.props('text')).toContain('traces non associées')
    expect(notice.props('text')).toContain('Pour rappel')
  })

  it('displays an alert without the last sentence if it can\'t find the configuration', async () => {
    mockUseStudentTracesConfigurationQuery(null)
    const wrapper = mount(StudentToolsTracesViewNotice, {
      global: {
        stubs
      }
    })

    await nextTick()

    const notice = wrapper.findComponent({ name: 'AvNotice' })
    expect(notice.exists()).toBe(true)
    expect(notice.props('type')).toBe('warning')
    expect(notice.props('text')).toContain('traces non associées')
    expect(notice.props('text')).not.toContain('Pour rappel')
  })

  it('should not display an alert if no unassociated traces are present', async () => {
    mockUseUnassignedTracesSummaryQuery({ total: 0, totalWarnings: 0, totalCriticals: 0 })
    const wrapper = mount(StudentToolsTracesViewNotice, {
      global: {
        stubs
      }
    })

    await nextTick()

    const notice = wrapper.findComponent({ name: 'AvNotice' })
    expect(notice.exists()).toBe(false)
  })

  it('should have correct message when just have one unassociated trace', async () => {
    mockUseStudentTracesConfigurationQuery({
      maxDayRemaining: 30,
      maxDayRemainingWarning: 7,
      maxDayRemainingCritical: 1
    })
    mockUseUnassignedTracesSummaryQuery({ total: 1, totalWarnings: 0, totalCriticals: 1 })
    const wrapper = mount(StudentToolsTracesViewNotice, {
      global: {
        stubs
      }
    })

    await nextTick()

    const notice = wrapper.findComponent({ name: 'AvNotice' })
    expect(notice.exists()).toBe(true)
    expect(notice.props('type')).toBe('warning')
    expect(notice.props('text')).toContain('Vous avez une trace non associée')
    expect(notice.props('text')).toContain('Attention, la trace sera supprimée demain')
    expect(notice.props('text')).toContain('Pour rappel')
  })
})
