import StudentMailboxModal from '@/features/student/components/modals/StudentMailboxModal/StudentMailboxModal.vue'
import { mount } from '@vue/test-utils'

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

describe('studentMailboxModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render correct content for no new message', () => {
    const onClose = vi.fn()
    const wrapper = mount(StudentMailboxModal, {
      props: { messagesCount: 0, showModal: true, onClose },
    })
    const avModal = wrapper.getComponent({ name: 'AvModal' })
    const avButton = wrapper.getComponent({ name: 'AvButton' })

    expect(avModal.props('title')).toBe('Aucun nouveau message')
    expect(wrapper.text()).toBe('Vous n\'avez aucun nouveau message à consulter.')
    expect(avButton.props('label')).toBe('Aller à ma messagerie')
  })

  it('should render correct content for 1 new message', () => {
    const onClose = vi.fn()
    const wrapper = mount(StudentMailboxModal, {
      props: { messagesCount: 1, showModal: true, onClose },
    })
    const avModal = wrapper.getComponent({ name: 'AvModal' })
    const avButton = wrapper.getComponent({ name: 'AvButton' })

    expect(avModal.props('title')).toBe('1 message non lu')
    expect(wrapper.text()).toBe('Messages...')
    expect(avButton.props('label')).toBe('Voir tout')
  })

  it('should render correct content for 2 and more new messages', () => {
    const onClose = vi.fn()
    const wrapper = mount(StudentMailboxModal, {
      props: { messagesCount: 2, showModal: true, onClose },
    })
    const avModal = wrapper.getComponent({ name: 'AvModal' })
    const avButton = wrapper.getComponent({ name: 'AvButton' })

    expect(avModal.props('title')).toBe('2 messages non lus')
    expect(wrapper.text()).toBe('Messages...')
    expect(avButton.props('label')).toBe('Voir tout')
  })

  it('should call navigate and onClose when button is clicked', async () => {
    const onClose = vi.fn()
    const wrapper = mount(StudentMailboxModal, {
      props: { messagesCount: 1, showModal: true, onClose },
    })

    const button = wrapper.findComponent({ name: 'AvButton' })
    await button.trigger('click')

    expect(navigateToStudentMailbox).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })

  it('should call onClose when modal is closed', async () => {
    const onClose = vi.fn()
    const wrapper = mount(StudentMailboxModal, {
      props: { messagesCount: 1, showModal: true, onClose },
    })

    await wrapper.findComponent({ name: 'AvModal' }).vm.$emit('close')
    expect(onClose).toHaveBeenCalled()
  })
})
