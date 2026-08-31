import type { TracesSummaryDTO } from '@/api/avenir-esr'
import { getTraceConfigErrorHandler } from '@/__mocks__/msw/handlers/student/traces.handlers'
import { server } from '@/__mocks__/msw/server'
import StudentToolsTracesViewNotice from '@/features/traces/views/StudentToolsTracesView/components/StudentToolsTracesViewNotice/StudentToolsTracesViewNotice.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'

BddTest().given('a student tools traces view notice component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentToolsTracesViewNotice>>

  const commonStubs = {
    AvNotice: {
      name: 'AvNotice',
      props: ['text', 'type'],
      template: '<div class="av-notice-stub" :data-type="type" :data-text="text" />'
    }
  }

  const tracesSummaryDefault: TracesSummaryDTO = {
    associated: 7,
    unassociated: 15,
    totalWarnings: 5,
    totalCriticals: 3,
  }

  BddTest().and('with default configuration', () => {
    beforeEach(async () => {
      vi.clearAllMocks()

      wrapper = mountComponent(StudentToolsTracesViewNotice, {
        props: { tracesSummary: tracesSummaryDefault },
        global: {
          stubs: commonStubs
        }
      })

      await flushPromises()
    })

    BddTest().when('the component is mounted with unassociated traces', () => {
      BddTest().then('it should display AvNotice with correct warning type', async () => {
        await nextTick()

        const notice = wrapper.findComponent({ name: 'AvNotice' })
        expect(notice.exists()).toBe(true)
        expect(notice.props('type')).toBe('warning')
      })

      BddTest().then('it should display correct message with traces count and reminder', async () => {
        await nextTick()

        const notice = wrapper.findComponent({ name: 'AvNotice' })
        expect(notice.props('text')).toContain('traces non associées')
        expect(notice.props('text')).toContain('Pour rappel')
      })

      BddTest().then('it should render the notice container structure', () => {
        const container = wrapper.find('.student-tools-traces-view-notice')
        expect(container.exists()).toBe(true)
      })
    })
  })

  BddTest().and('with no configuration', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      server.use(getTraceConfigErrorHandler)

      wrapper = mountComponent(StudentToolsTracesViewNotice, {
        props: { tracesSummary: tracesSummaryDefault },
        global: {
          stubs: commonStubs
        }
      })

      await flushPromises()
    })

    BddTest().when('the component is mounted without configuration', () => {
      BddTest().then('it should display alert without reminder message', async () => {
        await nextTick()

        const notice = wrapper.findComponent({ name: 'AvNotice' })
        expect(notice.exists()).toBe(true)
        expect(notice.props('type')).toBe('warning')
        expect(notice.props('text')).toContain('traces non associées')
        expect(notice.props('text')).not.toContain('Pour rappel')
      })
    })
  })

  BddTest().and('with no unassociated traces', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      const tracesSummaryEmpty: TracesSummaryDTO = {
        associated: 0,
        unassociated: 0,
        totalWarnings: 0,
        totalCriticals: 0,
      }

      wrapper = mountComponent(StudentToolsTracesViewNotice, {
        props: { tracesSummary: tracesSummaryEmpty },
        global: {
          stubs: commonStubs
        }
      })

      await flushPromises()
    })

    BddTest().when('the component is mounted with no unassociated traces', () => {
      BddTest().then('it should not display any notice', async () => {
        await nextTick()

        const notice = wrapper.findComponent({ name: 'AvNotice' })
        expect(notice.exists()).toBe(false)
      })

      BddTest().then('it should not render the notice container', () => {
        const container = wrapper.find('.student-tools-traces-view-notice')
        expect(container.exists()).toBe(false)
      })
    })
  })

  BddTest().given('with single critical trace', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      const tracesSummaryMock: TracesSummaryDTO = {
        associated: 0,
        unassociated: 1,
        totalWarnings: 0,
        totalCriticals: 1,
      }

      wrapper = mountComponent(StudentToolsTracesViewNotice, {
        props: { tracesSummary: tracesSummaryMock },
        global: {
          stubs: commonStubs
        }
      })

      await flushPromises()
    })

    BddTest().when('the component is mounted with one critical trace', () => {
      BddTest().then('it should display correct singular message', async () => {
        await nextTick()

        const notice = wrapper.findComponent({ name: 'AvNotice' })
        expect(notice.exists()).toBe(true)
        expect(notice.props('type')).toBe('warning')
        expect(notice.props('text')).toContain('Vous avez une trace non associée')
        expect(notice.props('text')).toContain('Attention, la trace sera supprimée')
        expect(notice.props('text')).toContain('Pour rappel')
      })
    })
  })

  BddTest().given('with multiple critical traces', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      const tracesSummaryMock: TracesSummaryDTO = {
        associated: 0,
        unassociated: 10,
        totalWarnings: 5,
        totalCriticals: 5,
      }

      wrapper = mountComponent(StudentToolsTracesViewNotice, {
        props: { tracesSummary: tracesSummaryMock },
        global: {
          stubs: commonStubs
        }
      })

      await flushPromises()
    })

    BddTest().when('the component is mounted with multiple critical traces', () => {
      BddTest().then('it should display correct plural message', async () => {
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
