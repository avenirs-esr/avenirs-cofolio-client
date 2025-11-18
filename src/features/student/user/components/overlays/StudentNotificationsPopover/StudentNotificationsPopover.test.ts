import StudentNotificationsPopover from '@/features/student/user/components/overlays/StudentNotificationsPopover/StudentNotificationsPopover.vue'
import { AvButtonStub, AvCancelConfirmButtonsStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

vi.mock('@/common/composables', () => ({
  useNavigation: () => ({
    navigateToStudentNotifications: vi.fn()
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

BddTest().given('a student notifications popover', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentNotificationsPopover>>

  const stubs = {
    AvButton: AvButtonStub,
    AvIconText: AvIconTextStub,
    AvPopover: AvPopoverStub,
    AvCancelConfirmButtons: AvCancelConfirmButtonsStub
  }

  const getIconText = () => wrapper.findComponent(AvIconTextStub)
  const getCancelConfirmButtons = () => wrapper.findComponent(AvCancelConfirmButtonsStub)

  BddTest().and('no notifications', () => {
    beforeEach(() => {
      wrapper = mount(StudentNotificationsPopover, {
        props: { notificationsCount: 0 },
        global: { stubs }
      })
    })

    BddTest().when('the popover is rendered', () => {
      BddTest().then('it should render the no notifications message', () => {
        const titleIconText = getIconText()
        expect(titleIconText.exists()).toBe(true)
        expect(titleIconText?.props('text')).toBe('Aucune notification')
      })

      BddTest().then('it should not show the "See All" button', () => {
        const cancelConfirmButtons = getCancelConfirmButtons()
        expect(cancelConfirmButtons.exists()).toBe(true)
        expect(cancelConfirmButtons.props('confirmLabel')).toBeUndefined()
      })
    })
  })

  BddTest().and('notifications', () => {
    beforeEach(() => {
      wrapper = mount(StudentNotificationsPopover, {
        props: { notificationsCount: 5 },
        global: { stubs }
      })
    })

    BddTest().when('the popover is rendered', () => {
      BddTest().then('it should render the notifications title with count', () => {
        const titleIconText = getIconText()
        expect(titleIconText.exists()).toBe(true)
        expect(titleIconText?.props('text')).toBe('5 notifications non lues')
      })

      BddTest().then('it should display the "See All" button', () => {
        const cancelConfirmButtons = getCancelConfirmButtons()
        expect(cancelConfirmButtons.exists()).toBe(true)
        expect(cancelConfirmButtons.props('confirmLabel')).toBe('Voir tout')
      })
    })
  })
})
