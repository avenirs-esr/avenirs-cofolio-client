import StaffProfilePopover from '@/features/staff/user/components/overlays/StaffProfilePopover/StaffProfilePopover.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a staff profile popover', () => {
  let wrapper: VueWrapper

  const stubs = {
    AvButton: {
      name: 'AvButton',
      props: ['label'],
      template: '<button class="av-button">{{ label }}</button>'
    },
    AvPopover: {
      name: 'AvPopover',
      template: `
        <div>
          <slot name="trigger" :toggle="() => {}"></slot>
          <slot name="popover"></slot>
        </div>
      `
    },
    ConfirmationModal: {
      name: 'ConfirmationModal',
      template: '<div />'
    }
  }

  beforeEach(() => {
    wrapper = mount(StaffProfilePopover, {
      props: { username: 'J. Moulin' },
      global: { stubs }
    })
  })

  BddTest().when('the popover is rendered', () => {
    BddTest().then('it should render the username as button label', () => {
      const buttons = wrapper.findAllComponents({ name: 'AvButton' })
      const triggerButton = buttons.find(btn => btn.text() === 'J. Moulin')

      expect(triggerButton).toBeDefined()
    })

    BddTest().then('it should render all profile menu buttons', () => {
      const labels = [
        'Me déconnecter'
      ]

      labels.forEach((label) => {
        const button = wrapper.findAllComponents({ name: 'AvButton' }).find(btn => btn.text() === label)

        expect(button).toBeDefined()
      })
    })
  })
})
