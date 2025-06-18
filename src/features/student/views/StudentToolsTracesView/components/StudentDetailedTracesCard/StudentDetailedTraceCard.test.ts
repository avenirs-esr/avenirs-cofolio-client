import { TraceStatus, type TraceViewDTO } from '@/api/avenir-esr'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import StudentDetailedTraceCard from './StudentDetailedTraceCard.vue'

describe('studentDetailedTraceCard', () => {
  const stubs = {
    AvVIcon: {
      name: 'AvVIcon',
      props: ['name', 'color', 'size'],
      template: `<div class="av-vicon" />`,
    },
    StudentDetailedTraceModal: {
      name: 'StudentDetailedTraceModal',
      props: ['showModal', 'onClose', 'trace'],
      template: '<div v-if="showModal" data-testid="student-detailed-trace-modal">StudentDetailedTraceModal</div>',
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const nextMonthDate = new Date()
  nextMonthDate.setDate(nextMonthDate.getDate() + 30)
  const nextMonthDateIsoString = nextMonthDate.toISOString()

  const mockedTrace: TraceViewDTO = {
    id: 'trace1',
    title: 'Ma super trace',
    status: TraceStatus.UNASSOCIATED,
    createdAt: '2025-06-16T10:42:00.000Z',
    updatedAt: '2025-06-17T15:18:00.000Z',
    deletionDate: nextMonthDateIsoString
  }

  const mockedAssociatedTrace: TraceViewDTO = {
    ...mockedTrace,
    status: TraceStatus.ASSOCIATED
  }

  it('should open modal on click and close it when onClose is called', async () => {
    const wrapper = mount(StudentDetailedTraceCard, {
      props: { trace: mockedTrace },
      global: {
        stubs,
      },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('[data-testid="student-detailed-trace-modal"]').exists()).toBe(true)

    await wrapper.findComponent({ name: 'StudentDetailedTraceModal' }).vm.onClose()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-testid="student-detailed-trace-modal"]').exists()).toBe(false)
  })

  it('should render the trace name and deletion time for unassociated trace', async () => {
    const wrapper = mount(StudentDetailedTraceCard, {
      props: { trace: mockedTrace },
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Ma super trace')
    expect(wrapper.text()).toContain('Suppression dans 30 jours')
  })

  it('should not render the trace deletion time for associated trace', async () => {
    const wrapper = mount(StudentDetailedTraceCard, {
      props: { trace: mockedAssociatedTrace },
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Ma super trace')
    expect(wrapper.text()).not.toContain('Suppression')
  })
})
