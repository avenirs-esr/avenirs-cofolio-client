import { TraceStatus, type TraceViewDTO } from '@/api/avenir-esr'
import { mount } from '@vue/test-utils'
import { describe, it, vi } from 'vitest'
import StudentDetailedTraceModal from './StudentDetailedTraceModal.vue'

const navigateToStudentMailbox = vi.fn()

vi.mock('@/common/composables', () => ({
  useNavigation: () => ({
    navigateToStudentMailbox,
  }),
}))

vi.mock('@/ui', async () => {
  const actual = await vi.importActual<typeof import('@/ui')>('@/ui')

  return {
    ...actual,
    AvModal: {
      name: 'AvModal',
      props: ['title'],
      template: `<div><slot /><slot name="footer" /></div>`,
      emits: ['close'],
    },
    AvButton: {
      name: 'AvButton',
      template: `<button @click="onClick && onClick()"><slot /></button>`,
      props: ['label', 'icon', 'size', 'onClick'],
    },
  }
})

describe('studentDetailedTraceModal', () => {
  const nextMonthDate = new Date()
  nextMonthDate.setDate(nextMonthDate.getDate() + 30)
  const nextMonthDateIsoString = nextMonthDate.toISOString()

  const onClose = vi.fn()
  const mockedTrace: TraceViewDTO = {
    id: 'trace1',
    title: 'Ma super trace',
    status: TraceStatus.UNASSOCIATED,
    createdAt: '2025-06-16T10:42:00.000Z',
    updatedAt: '2025-06-17T15:18:00.000Z',
    deletionDate: nextMonthDateIsoString
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render correct content', () => {
    const wrapper = mount(StudentDetailedTraceModal, {
      props: { trace: mockedTrace, showModal: true, onClose },
    })
    const avModal = wrapper.getComponent({ name: 'AvModal' })

    expect(avModal.props('title')).toBe(`Détail de ma trace - ${mockedTrace.title}`)
  })

  it('should call onClose when modal is closed', async () => {
    const wrapper = mount(StudentDetailedTraceModal, {
      props: { trace: mockedTrace, showModal: true, onClose },
    })

    await wrapper.findComponent({ name: 'AvModal' }).vm.$emit('close')
    expect(onClose).toHaveBeenCalled()
  })
})
