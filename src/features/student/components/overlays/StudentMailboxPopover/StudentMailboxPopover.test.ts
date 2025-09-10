import StudentMailboxPopover from '@/features/student/components/overlays/StudentMailboxPopover/StudentMailboxPopover.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

vi.mock('@/common/composables', () => ({
  useNavigation: () => ({
    navigateToStudentMailbox: vi.fn()
  })
}))

BddTest().given('a student mailbox popover', () => {
  const stubs = {
    AvButton: {
      name: 'AvButton',
      props: ['label'],
      template: '<button class="av-button" />'
    },
    AvIconText: {
      name: 'AvIconText',
      props: ['text'],
      template: '<div class="av-icon-text title" />'
    },
    AvPopover: {
      name: 'AvPopOver',
      template: `
        <div>
          <slot name="trigger" :toggle="() => {}"></slot>
          <slot name="popover" :close="() => {}"></slot>
        </div>
      `
    }
  }

  BddTest().and('no messages', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(StudentMailboxPopover, {
        props: { messagesCount: 0 },
        global: { stubs }
      })
    })

    BddTest().when('the popover is rendered', () => {
      BddTest().then('it should render the no messages message', () => {
        const titleIconText = wrapper.findComponent('[data-testid="mailbox-popover-title"]') as VueWrapper<{ $props: { text: string } }>
        expect(titleIconText).toBeDefined()
        expect(titleIconText?.props('text')).toBe('Aucun nouveau message')
        expect(wrapper.find('span.b2-light').exists()).toBe(true)
      })

      BddTest().then('it should display the navigate button for no messages', () => {
        const navigateButton = wrapper.findComponent('[data-testid="mailbox-popover-navigate-none"]')
        expect(navigateButton.exists()).toBe(true)
      })
    })
  })

  BddTest().and('messages', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(StudentMailboxPopover, {
        props: { messagesCount: 3 },
        global: { stubs }
      })
    })

    BddTest().when('the popover is rendered', () => {
      BddTest().then('it should render the messages title with count', () => {
        const titleIconText = wrapper.findComponent('[data-testid="mailbox-popover-title"]') as VueWrapper<{ $props: { text: string } }>
        expect(titleIconText).toBeDefined()
        expect(titleIconText?.props('text')).toBe('3 messages non lus')
      })

      BddTest().then('it should display the navigate button for some messages', () => {
        const navigateButton = wrapper.findComponent('[data-testid="mailbox-popover-navigate-some"]')
        expect(navigateButton.exists()).toBe(true)
      })
    })
  })
})
