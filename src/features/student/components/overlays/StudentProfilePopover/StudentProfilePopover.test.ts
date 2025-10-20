import StudentProfilePopover from '@/features/student/components/overlays/StudentProfilePopover/StudentProfilePopover.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a profile popover', () => {
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
    }
  }

  beforeEach(() => {
    wrapper = mount(StudentProfilePopover, {
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
        'Gérer mon profil',
        'Voir mon agenda',
        'Aller sur mon ENT',
        'Aller sur le passeport de compétences',
        'Me déconnecter'
      ]

      labels.forEach((label) => {
        const button = wrapper.findAllComponents({ name: 'AvButton' }).find(btn => btn.text() === label)
        expect(button).toBeDefined()
      })
    })
  })
})
