import StudentMailboxPopover from '@/features/student/user/components/overlays/StudentMailboxPopover/StudentMailboxPopover.vue'
import { AvButtonStub, AvCancelConfirmButtonsStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

vi.mock('@/common/composables', () => ({
  useNavigation: () => ({
    navigateToStudentMailbox: vi.fn()
  })
}))

const AvPopoverStub = defineComponent({
  name: 'AvPopOver',
  template: `
    <div>
      <slot name="trigger" :toggle="() => {}"></slot>
      <slot name="popover" :close="() => {}"></slot>
    </div>
  `
})

BddTest().given('a student mailbox popover', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentMailboxPopover>>

  const stubs = {
    AvButton: AvButtonStub,
    AvIconText: AvIconTextStub,
    AvPopover: AvPopoverStub,
    AvCancelConfirmButtons: AvCancelConfirmButtonsStub
  }

  const getIconText = () => wrapper.findComponent(AvIconTextStub)
  const getCancelConfirmButtons = () => wrapper.findComponent(AvCancelConfirmButtonsStub)

  BddTest().and('no messages', () => {
    beforeEach(() => {
      wrapper = mount(StudentMailboxPopover, {
        props: { messagesCount: 0 },
        global: { stubs }
      })
    })

    BddTest().when('the popover is rendered', () => {
      BddTest().then('it should render the no messages message', () => {
        const titleIconText = getIconText()
        expect(titleIconText.exists()).toBe(true)
        expect(titleIconText?.props('text')).toBe('Aucun nouveau message')
      })

      BddTest().then('it should display the navigate button for no messages', () => {
        const cancelConfirmButtons = getCancelConfirmButtons()
        expect(cancelConfirmButtons.exists()).toBe(true)
        expect(cancelConfirmButtons.props('confirmLabel')).toBe('Aller à ma messagerie')
      })
    })
  })

  BddTest().and('messages', () => {
    beforeEach(() => {
      wrapper = mount(StudentMailboxPopover, {
        props: { messagesCount: 3 },
        global: { stubs }
      })
    })

    BddTest().when('the popover is rendered', () => {
      BddTest().then('it should render the messages title with count', () => {
        const titleIconText = getIconText()
        expect(titleIconText.exists()).toBe(true)
        expect(titleIconText?.props('text')).toBe('3 messages non lus')
      })

      BddTest().then('it should display the navigate button for some messages', () => {
        const cancelConfirmButtons = getCancelConfirmButtons()
        expect(cancelConfirmButtons.exists()).toBe(true)
        expect(cancelConfirmButtons.props('confirmLabel')).toBe('Voir tout')
      })
    })
  })
})
