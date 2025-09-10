import { ETraceStatus, type TraceViewDTO } from '@/api/avenir-esr'
import { StudentDetailedTraceModalStub } from '@/features/student/views/StudentToolsTracesView/components/StudentDetailedTraceModal/StudentDetailedTraceModal.stub'
import StudentDetailedTraceCard from '@/features/student/views/StudentToolsTracesView/components/StudentDetailedTracesCard/StudentDetailedTraceCard.vue'
import { AvVIconStub } from '@/ui/base/AvVIcon/AvVIcon.stub'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a student detailed trace card', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentDetailedTraceCard>>

  const stubs = {
    AvVIcon: AvVIconStub,
    StudentDetailedTraceModal: StudentDetailedTraceModalStub,
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
    status: ETraceStatus.UNASSOCIATED,
    createdAt: '2025-06-16T10:42:00.000Z',
    updatedAt: '2025-06-17T15:18:00.000Z',
    willBeDeletedAt: nextMonthDateIsoString
  }

  const mockedAssociatedTrace: TraceViewDTO = {
    ...mockedTrace,
    status: ETraceStatus.ASSOCIATED
  }

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the trace name and deletion time for unassociated trace', async () => {
      const wrapper = mount(StudentDetailedTraceCard, {
        props: { trace: mockedTrace },
        global: {
          stubs,
        },
      })

      expect(wrapper.text()).toContain('Ma super trace')
      expect(wrapper.text()).toContain('Suppression dans 30 jours')
    })

    BddTest().then('ot should not render the trace deletion time for associated trace', async () => {
      const wrapper = mount(StudentDetailedTraceCard, {
        props: { trace: mockedAssociatedTrace },
        global: {
          stubs,
        },
      })

      expect(wrapper.text()).toContain('Ma super trace')
      expect(wrapper.text()).not.toContain('Suppression')
    })

    BddTest().and('the modal is closed and clicking the card', () => {
      beforeEach(() => {
        wrapper = mount(StudentDetailedTraceCard, {
          props: { trace: mockedTrace },
          global: {
            stubs,
          },
        })
      })

      BddTest().then('it should open modal on click and close it when onClose is called', async () => {
        await wrapper.find('button').trigger('click')
        expect(wrapper.find('[data-testid="student-detailed-trace-modal"]').exists()).toBe(true)
      })
    })

    BddTest().and('the modal is opened and onClose is called', () => {
      beforeEach(() => {
        wrapper = mount(StudentDetailedTraceCard, {
          props: { trace: mockedTrace },
          global: {
            stubs,
          },
        })
      })

      BddTest().then('close the modal', async () => {
        await wrapper.find('button').trigger('click')
        expect(wrapper.find('[data-testid="student-detailed-trace-modal"]').exists()).toBe(true)

        await wrapper.findComponent({ name: 'StudentDetailedTraceModal' }).vm.onClose()
        await wrapper.vm.$nextTick()
        expect(wrapper.find('[data-testid="student-detailed-trace-modal"]').exists()).toBe(false)
      })
    })
  })
})
