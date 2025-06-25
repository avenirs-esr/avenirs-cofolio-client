import StudentNotificationsModal from '@/features/student/components/modals/StudentNotificationsModal/StudentNotificationsModal.vue'
import { mount } from '@vue/test-utils'

const navigateToStudentNotifications = vi.fn()

vi.mock('@/common/composables', () => ({
  useNavigation: () => ({
    navigateToStudentNotifications,
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

describe('studentNotificationsModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render correct content for no unread notification', () => {
    const onClose = vi.fn()
    const wrapper = mount(StudentNotificationsModal, {
      props: { notificationsCount: 0, showModal: true, onClose },
    })
    const avModal = wrapper.getComponent({ name: 'AvModal' })

    expect(avModal.props('title')).toBe('Aucune notification')
    expect(wrapper.text()).toContain('Vous recevrez une notification dans les cas suivants :')
  })

  it('should render correct content for 1 unread notification', () => {
    const onClose = vi.fn()
    const wrapper = mount(StudentNotificationsModal, {
      props: { notificationsCount: 1, showModal: true, onClose },
    })
    const avModal = wrapper.getComponent({ name: 'AvModal' })
    const avButton = wrapper.getComponent({ name: 'AvButton' })

    expect(avModal.props('title')).toBe('1 notification non lue')
    expect(wrapper.text()).toBe('Notifications...')
    expect(avButton.props('label')).toBe('Voir tout')
  })

  it('should render correct content for 2 and more unread notifications', () => {
    const onClose = vi.fn()
    const wrapper = mount(StudentNotificationsModal, {
      props: { notificationsCount: 2, showModal: true, onClose },
    })
    const avModal = wrapper.getComponent({ name: 'AvModal' })
    const avButton = wrapper.getComponent({ name: 'AvButton' })

    expect(avModal.props('title')).toBe('2 notifications non lues')
    expect(wrapper.text()).toBe('Notifications...')
    expect(avButton.props('label')).toBe('Voir tout')
  })

  it('should call navigate and onClose when button is clicked', async () => {
    const onClose = vi.fn()
    const wrapper = mount(StudentNotificationsModal, {
      props: { notificationsCount: 1, showModal: true, onClose },
    })

    const button = wrapper.findComponent({ name: 'AvButton' })
    await button.trigger('click')

    expect(navigateToStudentNotifications).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })

  it('should call onClose when modal is closed', async () => {
    const onClose = vi.fn()
    const wrapper = mount(StudentNotificationsModal, {
      props: { notificationsCount: 1, showModal: true, onClose },
    })

    await wrapper.findComponent({ name: 'AvModal' }).vm.$emit('close')
    expect(onClose).toHaveBeenCalled()
  })
})
