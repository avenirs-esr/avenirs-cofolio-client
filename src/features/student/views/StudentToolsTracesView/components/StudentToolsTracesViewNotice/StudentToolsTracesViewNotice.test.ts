import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import StudentToolsTracesViewNotice from './StudentToolsTracesViewNotice.vue'

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
  })

  it('displays an alert with the correct parameters if unassociated traces are present', async () => {
    const wrapper = mount(StudentToolsTracesViewNotice, {
      props: {
        unassignedTracesSummary: mockedUnassignedTracesSummary,
        tracesConfig: mockedTracesConfiguration
      },
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
    const wrapper = mount(StudentToolsTracesViewNotice, {
      props: {
        unassignedTracesSummary: mockedUnassignedTracesSummary,
        tracesConfig: undefined
      },
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
    const wrapper = mount(StudentToolsTracesViewNotice, {
      props: {
        unassignedTracesSummary: { total: 0, totalWarnings: 0, totalCriticals: 0 },
        tracesConfig: mockedTracesConfiguration
      },
      global: {
        stubs
      }
    })

    await nextTick()

    const notice = wrapper.findComponent({ name: 'AvNotice' })
    expect(notice.exists()).toBe(false)
  })

  it('should have correct message when just have one unassociated trace', async () => {
    const wrapper = mount(StudentToolsTracesViewNotice, {
      props: {
        unassignedTracesSummary: { total: 1, totalWarnings: 0, totalCriticals: 1 },
        tracesConfig: {
          maxDayRemaining: 30,
          maxDayRemainingWarning: 7,
          maxDayRemainingCritical: 1
        }
      },
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
