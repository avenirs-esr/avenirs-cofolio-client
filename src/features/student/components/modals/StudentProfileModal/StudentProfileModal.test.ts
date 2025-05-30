import { mount } from '@vue/test-utils'
import StudentProfileModal from './StudentProfileModal.vue'

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

describe('studentProfileModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render correct content', () => {
    const onClose = vi.fn()
    const wrapper = mount(StudentProfileModal, {
      props: { showModal: true, onClose },
    })
    const avModal = wrapper.getComponent({ name: 'AvModal' })
    const avButtons = wrapper.findAllComponents({ name: 'AvButton' })

    expect(avModal.props('title')).toBe('')
    expect(avButtons).toHaveLength(5)

    const [manageProfileButton, seeCalendarButton, goToDwButton, goToSkillsButton, logoutButton] = avButtons
    expect(manageProfileButton.props('label')).toBe('Gérer mon profil')
    expect(seeCalendarButton.props('label')).toBe('Voir mon agenda')
    expect(goToDwButton.props('label')).toBe('Aller sur mon ENT')
    expect(goToSkillsButton.props('label')).toBe('Aller sur le passeport de compétences')
    expect(logoutButton.props('label')).toBe('Me déconnecter')
  })

  it('should call onClose when modal is closed', async () => {
    const onClose = vi.fn()
    const wrapper = mount(StudentProfileModal, {
      props: { showModal: true, onClose },
    })

    await wrapper.findComponent({ name: 'AvModal' }).vm.$emit('close')
    expect(onClose).toHaveBeenCalled()
  })
})
