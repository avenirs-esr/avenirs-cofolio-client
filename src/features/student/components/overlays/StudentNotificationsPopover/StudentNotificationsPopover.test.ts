import StudentNotificationsPopover from '@/features/student/components/overlays/StudentNotificationsPopover/StudentNotificationsPopover.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/common/composables', () => ({
  useNavigation: () => ({
    navigateToStudentNotifications: vi.fn()
  })
}))

describe('studentNotificationsPopover', () => {
  const stubs = {
    AvButton: {
      name: 'AvButton',
      props: ['label'],
      template: '<button class="av-button" />'
    },
    AvIconText: {
      name: 'AvIconText',
      props: ['text'],
      template: '<div class="av-icon-text" />'
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

  describe('given a popover with no notifications', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(StudentNotificationsPopover, {
        props: { notificationsCount: 0 },
        global: { stubs }
      })
    })

    describe('when the popover is rendered', () => {
      it('then it should render the no notifications message', () => {
        const titleIconText = wrapper.findComponent('[data-testid="notifications-popover-title"]') as VueWrapper<{ $props: { text: string } }>
        expect(titleIconText).toBeDefined()
        expect(titleIconText?.props('text')).toBe('Aucune notification')
        expect(wrapper.find('ul').exists()).toBe(true)
      })

      it('then it should not show the "See All" button', () => {
        expect(wrapper.findAll('button').some(btn => btn.text().includes('Voir tout'))).toBe(false)
      })
    })
  })

  describe('given a popover with notifications', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(StudentNotificationsPopover, {
        props: { notificationsCount: 5 },
        global: { stubs }
      })
    })

    describe('when the popover is rendered', () => {
      it('then it should render the notifications title with count', () => {
        const titleIconText = wrapper.findComponent('[data-testid="notifications-popover-title"]') as VueWrapper<{ $props: { text: string } }>
        expect(titleIconText).toBeDefined()
        expect(titleIconText?.props('text')).toBe('5 notifications non lues')
      })

      it('then it should display the "See All" button', () => {
        const navButton = wrapper.findComponent('[data-testid="notifications-popover-navigate"]')
        expect(navButton).toBeDefined()
      })
    })
  })
})
