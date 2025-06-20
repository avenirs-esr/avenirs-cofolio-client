import { TraceStatus, type TraceViewDTO } from '@/api/avenir-esr'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import StudentToolsTracesViewNotice from './StudentToolsTracesViewNotice.vue'

describe('studentToolsTracesViewNotice', () => {
  const mockedTraces: TraceViewDTO[] = []
  for (let i = 1; i < 17; i++) {
    const dayNumber = i < 10 ? `0${i}` : i
    const rand = Math.floor(Math.random() * 31) + 1
    const randomDayNumber = rand < 10 ? `0${rand}` : rand
    const trace = {
      id: `trace${i}`,
      title: `Ma super trace numéro ${i}`,
      status: TraceStatus.UNASSOCIATED,
      createdAt: `2025-06-${dayNumber}T10:42:00.000Z`,
      updatedAt: `2025-06-${dayNumber}T11:42:00.000Z`,
      deletionDate: `2025-07-${randomDayNumber}T10:42:00.000Z`
    }
    mockedTraces.push(trace)
  }

  const mockedTracesConfiguration = {
    maxDayRemaining: 30,
    maxDayRemainingWarning: 15,
    maxDayRemainingCritical: 7
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
        traces: mockedTraces,
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
        traces: mockedTraces,
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
})
