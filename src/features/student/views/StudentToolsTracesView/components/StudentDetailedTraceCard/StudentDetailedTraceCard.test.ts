import type { TraceViewDTO } from '@/api/avenir-esr'
import StudentDetailedTraceCard from '@/features/student/views/StudentToolsTracesView/components/StudentDetailedTraceCard/StudentDetailedTraceCard.vue'
import { AvVIconStub } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a student detailed trace card', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentDetailedTraceCard>>

  const stubs = {
    AvVIcon: AvVIconStub,
    StudentDetailedTraceModal: {
      name: 'StudentDetailedTraceModal',
      template: '<div />'
    },
    RouterLink: RouterLinkStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const nextMonthDate = new Date(today)
  nextMonthDate.setDate(nextMonthDate.getDate() + 30)
  const nextMonthDateIsoString = nextMonthDate.toISOString()

  const mockedTrace: TraceViewDTO = {
    id: 'trace1',
    title: 'Ma super trace',
    isAssociated: false,
    createdAt: '2025-06-16T10:42:00.000Z',
    updatedAt: '2025-06-17T15:18:00.000Z',
    willBeDeletedAt: nextMonthDateIsoString
  }

  const mockedAssociatedTrace: TraceViewDTO = {
    ...mockedTrace,
    isAssociated: true
  }

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the trace name and deletion time for unassociated trace', async () => {
      wrapper = mount(StudentDetailedTraceCard, {
        props: { trace: mockedTrace },
        global: {
          stubs,
        },
      })

      expect(wrapper.text()).toContain('Ma super trace')
      expect(wrapper.text()).toContain('Suppression dans 30 jours')
    })

    BddTest().then('ot should not render the trace deletion time for associated trace', async () => {
      wrapper = mount(StudentDetailedTraceCard, {
        props: { trace: mockedAssociatedTrace },
        global: {
          stubs,
        },
      })

      expect(wrapper.text()).toContain('Ma super trace')
      expect(wrapper.text()).not.toContain('Suppression')
    })
  })
})
